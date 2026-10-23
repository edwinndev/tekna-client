import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tekna Gamer | Control de inventario",
  description: "Sistema centralizado de inventario, registro de movimientos y alertas de stock",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${jetbrainsMono.variable} ${chakraPetch.variable} h-full antialiased`}
    >
      <body className={`${outfit.className} min-h-full flex flex-col font-sans`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
