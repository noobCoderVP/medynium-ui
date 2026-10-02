import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SyntheticBanner } from "@/components/synthetic-banner";
import { env } from "@/lib/env";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: env.NEXT_PUBLIC_APP_NAME, template: `%s | ${env.NEXT_PUBLIC_APP_NAME}` },
  description: "Governed Patient 360 and clinical agent. Synthetic data, decision support only.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SyntheticBanner />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
