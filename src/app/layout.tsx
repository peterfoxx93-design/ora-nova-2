import React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chatbot/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Ora Nova | Arte en Odontología",
  description:
    "Odontología estética de precisión. Transformamos sonrisas con tecnología de vanguardia en República Dominicana.",
  keywords:
    "dentista, odontología estética, RD, ortodoncia invisible, carillas, implantes dentales",
  openGraph: {
    title: "Ora Nova | Arte en Odontología",
    description:
      "Donde la ciencia se encuentra con el arte. Transformamos sonrisas con tecnología de vanguardia.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-dark text-white font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
