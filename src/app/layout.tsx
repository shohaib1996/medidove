import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Poppins, Rubik } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medidove.ai";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const rubik = Rubik({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MediDove AI Clinic Platform",
    template: "%s | MediDove",
  },
  description:
    "AI-powered clinic receptionist, smart appointment intake, Supabase admin dashboard, WhatsApp engagement, and patient workflow automation.",
  applicationName: "MediDove",
  keywords: [
    "AI medical receptionist",
    "clinic appointment system",
    "Supabase healthcare app",
    "ElevenLabs receptionist",
    "Twilio WhatsApp clinic",
    "patient engagement platform",
  ],
  authors: [{ name: "MediDove" }],
  creator: "MediDove",
  publisher: "MediDove",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "MediDove",
    title: "MediDove AI Clinic Platform",
    description:
      "AI clinic receptionist, smart booking, patient reminders, lead triage, and admin workflows for modern healthcare teams.",
    images: [
      {
        url: "/assets/img/slider/slider-bg-1.jpg",
        width: 1200,
        height: 630,
        alt: "MediDove AI Clinic Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MediDove AI Clinic Platform",
    description:
      "AI-powered appointment intake, receptionist workflows, patient engagement, and clinic admin automation.",
    images: ["/assets/img/slider/slider-bg-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e12454",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${rubik.variable}`}>{children}</body>
    </html>
  );
}
