"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, FileText, Scale, Home, LogIn, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

 const menuItems = [
  { name: "خانه", href: "/", icon: Home },
  { name: "داشبورد", href: "/dashboard", icon: LayoutDashboard },
  { name: "املاک", href: "/properties", icon: Building2 },
  { name: "قراردادها", href: "/contracts", icon: FileText },
  { name: "امور حقوقی", href: "/legal", icon: Scale },
];

  return (
    <nav dir="rtl" className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-zinc-900 hidden sm:block">
              سامانه جامع
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              let classes = "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ";
              if (isActive) classes = classes + "bg-blue-50 text-blue-700";
              else classes = classes + "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900";
              return (
                <Link key={item.href} href={item.href} className={classes}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            ورود
          </Link>
        </div>
      </div>
    </nav>
  );
}