import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://slotly-zeta.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Slotly — Reservas online para experiencias turísticas",
    template: "%s — Slotly",
  },
  description: "Sistema de reservas profesional para surf, diving, excursiones y actividades turísticas en Canarias. Cobra online, gestiona tu agenda y haz crecer tu negocio.",
  keywords: ["reservas online", "experiencias turísticas", "Canarias", "surf", "buceo", "actividades", "booking"],
  authors: [{ name: "Slotly" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: APP_URL,
    siteName: "Slotly",
    title: "Slotly — Reservas online para experiencias turísticas",
    description: "Sistema de reservas profesional para surf, diving, excursiones y actividades turísticas en Canarias.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Slotly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slotly — Reservas online para experiencias turísticas",
    description: "Sistema de reservas profesional para surf, diving y actividades turísticas en Canarias.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
