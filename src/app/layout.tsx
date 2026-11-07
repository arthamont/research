import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Fraunces } from "next/font/google";
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

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ARTHAMONT — Built on Principle. Defined by Time.",
    template: "%s · ARTHAMONT",
  },
  description:
    "An independent trading and research initiative across US futures, global markets, and Indian markets — with a long-term institutional vision. Conviction. Discipline. Longevity.",
  openGraph: {
    siteName: "ARTHAMONT",
    type: "website",
    title: "ARTHAMONT — Built on Principle. Defined by Time.",
    description:
      "An independent trading and research initiative across US futures, global markets, and Indian markets — with a long-term institutional vision.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${ibmPlexMono.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeScript />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
