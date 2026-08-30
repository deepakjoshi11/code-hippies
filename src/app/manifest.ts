import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.founder}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    // Follows the page, which is light. A dark splash that flashes to a white
    // app is worse than no splash colour at all.
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
