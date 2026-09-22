
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "سامانه جامع قرارداد، حقوقی و املاک",
  description: "سامانه جامع مدیریت قراردادها، امور حقوقی و املاک",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={'${vazirmatn.variable} h-full antialiased'}
    >
      <body className={'${vazirmatn.className} min-h-full flex flex-col'}>
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
