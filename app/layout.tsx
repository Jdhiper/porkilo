import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Porkilo | Un kilo. Cero sobras.",
  description: "Panceta premium de piel crujiente, cocinada en lotes limitados y despachada los sábados. Arma tu pedido y reserva por WhatsApp.",
  keywords: ["panceta", "porkilo", "panceta premium", "comida a domicilio", "preventa"],
  openGraph: {
    title: "Porkilo | Un kilo. Cero sobras.",
    description: "Panceta premium por kilos. Cupos semanales limitados.",
    type: "website",
    locale: "es_CO",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Porkilo — Un kilo. Cero sobras." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Porkilo | Un kilo. Cero sobras.",
    description: "Panceta premium por kilos. Cupos semanales limitados.",
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
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
