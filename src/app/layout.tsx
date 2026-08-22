import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medidove.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MediDove Online Clinic",
    template: "%s | MediDove",
  },
  description:
    "Online clinic appointments, reception support, patient reminders, service guidance, and follow-up communication.",
  applicationName: "MediDove",
  keywords: [
    "online medical appointment",
    "clinic reception",
    "patient reminders",
    "doctor booking",
    "medical services",
    "patient support",
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
    title: "MediDove Online Clinic",
    description:
      "Book appointments, reach reception, receive reminders, and get safe service guidance from MediDove.",
    images: [
      {
        url: "/assets/img/slider/slider-bg-1.jpg",
        width: 1200,
        height: 630,
        alt: "MediDove Online Clinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MediDove Online Clinic",
    description:
      "Online appointments, reception support, patient reminders, and clinic follow-up communication.",
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
      <body>{children}</body>
    </html>
  );
}
