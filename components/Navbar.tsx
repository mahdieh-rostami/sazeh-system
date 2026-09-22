"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav dir="rtl" className="bg-white border-b border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-blue-700">
          سامانه جامع
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-zinc-700 hover:text-blue-700">
            خانه
          </Link>
          <Link href="/properties" className="text-zinc-700 hover:text-blue-700">
            املاک
          </Link>
          <Link href="/contracts" className="text-zinc-700 hover:text-blue-700">
            قراردادها
          </Link>
          <Link href="/legal" className="text-zinc-700 hover:text-blue-700">
            امور حقوقی
          </Link>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            ورود
          </Link>
        </div>
      </div>
    </nav>
  );
}