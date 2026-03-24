import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Mood Map - Tvoj dnevni mikro-dnevnik",
  description: "Prati svoje raspoloženje svaki dan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr" className="h-full antialiased">
      <body className="min-h-full bg-gradient-to-b from-[#FEF0E4] via-[#FDF2F8] to-[#EDE9FE] font-sans">
        <main className="pb-20">
          {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}
