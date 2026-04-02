import type { Metadata } from "next";
import { Syne, Archivo_Black, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dpka - Developer Portfolio",
  description: "Software Engineer portfolio of Deepika Mundla built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${archivoBlack.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gaude-black text-white selection:bg-gaude-orange selection:text-white">
        {children}
      </body>
    </html>
  );
}
