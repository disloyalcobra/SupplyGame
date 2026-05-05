import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Supply Chain Game | Aprende Jugando",
  description: "Descubre el mundo de la cadena de suministro con nuestro simulador educativo interactivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} antialiased`}>
      <body className="min-h-screen bg-white font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}
