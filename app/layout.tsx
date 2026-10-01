import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#2563eb" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "سامانه جامع قرارداد، حقوقی و املاک",
    template: "%s | سامانه جامع",
  },
  description:
    "سامانه جامع مدیریت قراردادها، امور حقوقی و املاک سازمان — بستر یکپارچه برای مدیریت هوشمند فرآیندهای سازمانی",
  applicationName: "سامانه جامع",
  authors: [{ name: "مهدیه رستمی" }],
  keywords: [
    "مدیریت قرارداد",
    "امور حقوقی",
    "مدیریت املاک",
    "سامانه سازمانی",
    "قرارداد",
    "پرونده حقوقی",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "سامانه جامع",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    title: "سامانه جامع قرارداد، حقوقی و املاک",
    description:
      "سامانه جامع مدیریت قراردادها، امور حقوقی و املاک سازمان",
    siteName: "سامانه جامع",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <body className={vazirmatn.className}>
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}