import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "NextPlay AI Business Automation",
  description:
    "Intent-aware automation that turns customer conversations into sales, support, and payment flows."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx(inter.variable, "bg-surface text-white")}>
        {children}
      </body>
    </html>
  );
}
