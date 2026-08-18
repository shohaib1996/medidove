import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MediDove AI Clinic Platform",
    short_name: "MediDove",
    description:
      "AI clinic receptionist, appointment booking, patient engagement, and admin operations platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#e12454",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
