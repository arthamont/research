import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { supabaseAdmin, SCREENSHOT_BUCKET } from "@/lib/supabase";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "storage", "uploads");
const MAX_BYTES = 8 * 1024 * 1024;

const MAGIC: Record<string, number[]> = {
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
};

function magicOk(buf: Buffer, mime: string) {
  const sig = MAGIC[mime];
  if (!sig) return false;
  return sig.every((b, i) => buf[i] === b);
}

const mimeExt: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

async function authorized() {
  const session = await auth();
  return !!session?.user?.email && session.user.email.toLowerCase() === (process.env.OWNER_EMAIL ?? "").toLowerCase();
}

/** POST /api/uploads?tradeId=…&kind=BEFORE — owner-only screenshot upload. */
export async function POST(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tradeId = req.nextUrl.searchParams.get("tradeId");
  const kind = req.nextUrl.searchParams.get("kind") ?? "OTHER";
  if (!tradeId || !["BEFORE", "AFTER", "CONTEXT", "OTHER"].includes(kind)) {
    return NextResponse.json({ error: "tradeId and valid kind required" }, { status: 400 });
  }
  const session = await auth();
  const trade = await db.trade.findFirst({ where: { id: tradeId, userId: String(session?.user?.id) } });
  if (!trade) return NextResponse.json({ error: "Trade not found" }, { status: 404 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "file required" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Max 8MB" }, { status: 413 });

  const mime = file.type;
  const ext = mimeExt[mime];
  if (!ext) return NextResponse.json({ error: "PNG/JPEG/WebP only" }, { status: 415 });

  const buf = Buffer.from(await file.arrayBuffer());
  if (!magicOk(buf, mime)) return NextResponse.json({ error: "File content does not match type" }, { status: 415 });

  const name = `${crypto.randomBytes(8).toString("hex")}.${ext}`;
  const key = `${tradeId}/${name}`;

  const sb = supabaseAdmin();
  if (sb) {
    const { error } = await sb.storage.from(SCREENSHOT_BUCKET).upload(key, buf, {
      contentType: mime,
      upsert: false,
    });
    if (error) return NextResponse.json({ error: `Storage upload failed: ${error.message}` }, { status: 502 });
  } else {
    await mkdir(path.join(/*turbopackIgnore: true*/ UPLOAD_ROOT, tradeId), { recursive: true });
    await writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_ROOT, key), buf);
  }

  const shot = await db.tradeScreenshot.create({
    data: { tradeId, kind: kind as "BEFORE" | "AFTER" | "CONTEXT" | "OTHER", filePath: key },
  });
  return NextResponse.json({ id: shot.id, url: `/api/uploads?p=${encodeURIComponent(shot.filePath)}` });
}

/** GET /api/uploads?p=<key> — authenticated serving; redirects to a signed URL when Supabase is configured. */
export async function GET(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rel = req.nextUrl.searchParams.get("p");
  if (!rel || rel.includes("..") || rel.startsWith("/") || rel.startsWith("\\")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb.storage.from(SCREENSHOT_BUCKET).createSignedUrl(rel, 3600);
    if (error || !data?.signedUrl) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.redirect(data.signedUrl, 302);
  }

  const abs = path.join(UPLOAD_ROOT, rel);
  if (!abs.startsWith(UPLOAD_ROOT)) return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  try {
    const buf = await readFile(abs);
    const ext = rel.split(".").pop()?.toLowerCase();
    const type = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return new NextResponse(new Uint8Array(buf), {
      headers: { "Content-Type": type, "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
