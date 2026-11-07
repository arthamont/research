import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

/** Safe markdown renderer for user-authored content (sanitized). */
export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose-nx max-w-none text-sm leading-relaxed text-text-secondary sm:text-base",
        "[&_h1]:mt-10 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-text",
        "[&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-text",
        "[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-text",
        "[&_p]:mt-4 [&_p]:leading-relaxed",
        "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5",
        "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5",
        "[&_a]:text-accent-text [&_a]:underline [&_a]:underline-offset-4",
        "[&_strong]:text-text [&_strong]:font-semibold",
        "[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_code]:font-mono [&_code]:text-[0.85em] [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-accent-text",
        "[&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_hr]:my-10 [&_hr]:border-border",
        "[&_table]:mt-6 [&_table]:w-full [&_table]:text-sm [&_th]:border-b [&_th]:border-border [&_th]:pb-2 [&_th]:text-left [&_th]:font-mono [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-text-secondary [&_td]:border-b [&_td]:border-border [&_td]:py-2.5 [&_td]:pr-4",
        "[&_img]:mt-6 [&_img]:border [&_img]:border-border",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
