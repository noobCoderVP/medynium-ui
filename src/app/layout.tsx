import type { Metadata } from "next";
import localFont from "next/font/local";
import { themeInitScript } from "@/components/shared/theme-provider";
import { env } from "@/lib/env";
import { Providers } from "./providers";
import "./globals.css";

// Inter carries the interface and body text; Roboto carries headings and display numbers. Both are
// self-hosted from /public so the app never calls a font CDN (no third party sees a clinician's session).
const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    {
      path: "../../public/Inter/Inter-VariableFont_opsz,wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/Inter/Inter-Italic-VariableFont_opsz,wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
});

const roboto = localFont({
  variable: "--font-roboto",
  display: "swap",
  src: [
    { path: "../../public/Roboto/Roboto-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/Roboto/Roboto-Italic.ttf", weight: "400", style: "italic" },
    { path: "../../public/Roboto/Roboto-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/Roboto/Roboto-Bold.ttf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: { default: env.NEXT_PUBLIC_APP_NAME, template: `%s | ${env.NEXT_PUBLIC_APP_NAME}` },
  description: "Governed Patient 360 and clinical agent. Synthetic data, decision support only.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the init script sets the theme class before React hydrates.
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${inter.variable} ${roboto.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
