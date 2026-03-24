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
      <body className="min-h-full bg-gradient-to-br from-[#E8F5EE] via-[#D4ECEC] to-[#F5F0E0] font-sans">
        <main className="pb-20">
          {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}
