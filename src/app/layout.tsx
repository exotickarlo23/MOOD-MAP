import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SMOOD STORY - Your Mood Diary",
  description: "Track your mood and write your story every day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 font-sans">
        <main className="pb-20 md:pt-20 md:pb-8">
          {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}
