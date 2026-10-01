import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "سامانه جامع قرارداد، حقوقی و املاک",
    short_name: "سامانه جامع",
    description: "سامانه جامع مدیریت قراردادها، امور حقوقی و املاک",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait",
    lang: "fa",
    dir: "rtl",
    icons: [
  {
    src: "/icon.svg",
    sizes: "any",
    type: "image/svg+xml",
  },
],
  };
}