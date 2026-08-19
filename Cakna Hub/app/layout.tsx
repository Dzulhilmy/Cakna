import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cakna Hub",
  description:
    "Cakna Hub — a central hub for the 7 Core initiatives and Society & Others.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
