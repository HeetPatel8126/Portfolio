import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI/ML Engineer — Portfolio",
  description:
    "Interactive terminal-based portfolio for an AI/ML engineer. Explore projects, skills, and experience through a hacker-style CLI interface.",
  keywords: ["AI", "ML", "engineer", "portfolio", "deep learning", "PyTorch", "CUDA"],
  authors: [{ name: "Heet Patel" }],
  openGraph: {
    title: "AI/ML Engineer — Portfolio",
    description: "Interactive terminal-based portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="bg-bg font-mono antialiased">{children}</body>
    </html>
  );
}
