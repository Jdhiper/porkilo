import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Clarity from "@/components/Clarity";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Porkilo | Panceta completa a domicilio en Pasto",
  description: "Panceta crujiente desde medio kilo, con acompañamientos, toppings y domicilio gratis. Preventa semanal con despacho los domingos en Pasto.",
  keywords: ["panceta", "porkilo", "panceta premium", "comida a domicilio", "preventa"],
  openGraph: {
    title: "Porkilo | Panceta completa a domicilio en Pasto",
    description: "Panceta crujiente desde $49.000, con acompañamientos, toppings y domicilio gratis. Cupos semanales limitados.",
    type: "website",
    locale: "es_CO",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Porkilo — Un kilo. Cero sobras." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Porkilo | Panceta completa a domicilio en Pasto",
    description: "Panceta crujiente desde $49.000, con acompañamientos, toppings y domicilio gratis. Cupos semanales limitados.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.variable}>
        {children}
        <MetaPixel />
        <Clarity />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
