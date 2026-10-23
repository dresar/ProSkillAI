import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://proskillai.dev"),
  title: {
    template: "%s | ProSkillAI",
    default: "ProSkillAI — Katalog Skill Agent & Kumpulan Prompt AI",
  },
  description: "Katalog terbuka skill terverifikasi untuk AI coding agent dan pustaka prompt rekayasa dengan variabel dinamis.",
  icons: {
    icon: "/brand/favicon.svg",
    apple: "/brand/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="noir" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider defaultTheme="system" defaultColorTheme="noir">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
