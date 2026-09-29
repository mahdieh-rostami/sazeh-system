"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const result = await supabase.from("properties").select("*").order("id", { ascending: false });
    if (result.data) setProperties(result.data);
    setLoading(false);
  }

  const filtered = properties.filter(function (p) {
    return (
      p.title.includes(searchTerm) ||
      p.code.includes(searchTerm) ||
      (p.full_address && p.full_address.includes(searchTerm))
    );
  });

  function getStatusClass(st: string) {
    if (st === "فعال") return "text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700";
    if (st === "در حال اجاره") return "text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700";
    if (st === "در حال تعمیر") return "text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700";
    return "text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700";
  }

  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">مدیریت املاک</h1>
          <p className="text-zinc-600">اتصال به دیتابیس Supabase</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 whitespace-nowrap">
          ثبت ملک جدید
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-200 mb-6">
        <input
          type="text"
          placeholder="جستجو..."
          value={searchTerm}
          onChange={function (e) { setSearchTerm(e.target.value); }}
          className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <h3 className="text-xl font-bold">در حال بارگذاری...</h3>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-zinc-600">
            نمایش {filtered.length} از {properties.length} ملک
          </div>

          <div className="space-y-4">
            {filtered.map(function (p) {
              return (
                <div key={p.id} className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-2 py-1 rounded">{p.code}</span>
                        <span className={getStatusClass(p.status)}>{p.status}</span>
                        <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded">{p.property_type}</span>
                      </div>
                      <Link href={"/properties/" + p.id} className="text-lg font-bold text-zinc-900 mb-3 block hover:text-blue-600">
                        {p.title}
                      </Link>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="text-zinc-600">آدرس: <span className="font-medium text-zinc-900">{p.full_address || "—"}</span></div>
                        <div className="text-zinc-600">مالک: <span className="font-medium text-zinc-900">{p.owner_name || "—"}</span></div>
                        </div>
                    </div>
                    <div className="md:min-w-[200px] border-t md:border-t-0 md:border-r border-zinc-100 pt-4 md:pt-0 md:pr-6 space-y-3">
                      <div>
                        <div className="text-xs text-zinc-500 mb-1">متراژ</div>
                        <div className="font-bold text-zinc-900">{Number(p.area || 0).toLocaleString("fa-IR")} متر</div>
                      </div>
                      <div className="text-xs text-zinc-500">
                        <div>شهر: {p.city || "—"}</div>
                        <div>سند: {p.deed_number || "—"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
              <h3 className="text-xl font-bold">ملکی پیدا نشد</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}