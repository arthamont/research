import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ThemeScript } from "@/components/theme-provider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NAYXOR — Trade the Plan. Not the Noise.",
    template: "%s · NAYXOR",
  },
  description:
    "Independent trading identity, research archive, and journal across US futures, forex, and Indian markets. Discipline. Precision. Execution.",
  openGraph: {
    siteName: "NAYXOR",
    type: "website",
    title: "NAYXOR — Trade the Plan. Not the Noise.",
    description:
      "Independent trading identity, research archive, and journal across US futures, forex, and Indian markets.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeScript />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
