"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PropertyDetailPage() {
  const pathname = usePathname();
  const id = pathname ? pathname.split("/").pop() : null;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    if (id) {
      loadProperty();
    }
  }, [id]);

  async function loadProperty() {
    setLoading(true);
    const result = await supabase
      .from("properties")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (result.data) {
      setProperty(result.data);
    } else {
      setProperty(null);
    }
    setLoading(false);
  }

  function getStatusClass(st: string) {
    if (st === "فعال") return "text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700";
    if (st === "در حال اجاره") return "text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700";
    if (st === "در حال تعمیر") return "text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700";
    return "text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700";
  }

  if (loading) {
    return (
      <div dir="rtl" className="p-8 max-w-7xl mx-auto text-center">
        <h3 className="text-xl font-bold">در حال بارگذاری...</h3>
      </div>
    );
  }

  if (!property) {
    return (
      <div dir="rtl" className="p-8 max-w-7xl mx-auto text-center">
        <h3 className="text-xl font-bold mb-4">ملک پیدا نشد</h3>
        <Link href="/properties" className="text-blue-600 underline">
          بازگشت به لیست املاک
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <Link href="/properties" className="inline-flex items-center gap-2 text-zinc-600 hover:text-blue-600 mb-6 text-sm font-medium">
        بازگشت به لیست املاک
      </Link>

      <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-3 py-1 rounded">{property.code}</span>
              <span className={getStatusClass(property.status)}>{property.status}</span>
              <span className="text-xs text-zinc-500 bg-zinc-100 px-3 py-1 rounded">{property.property_type}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">{property.title}</h1>
            <p className="text-zinc-600">{property.full_address || "بدون آدرس"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">اطلاعات ثبتی</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">شماره سند</span>
              <span className="font-medium text-zinc-900">{property.deed_number || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">مالک</span>
              <span className="font-medium text-zinc-900">{property.owner_name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">نوع مالکیت</span>
              <span className="font-medium text-zinc-900">{property.ownership_type || "—"}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">مشخصات فیزیکی</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">متراژ</span>
              <span className="font-medium text-zinc-900">{Number(property.area || 0).toLocaleString("fa-IR")} متر</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">نوع کاربری</span>
              <span className="font-medium text-zinc-900">{property.usage_type || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">سال ساخت</span>
              <span className="font-medium text-zinc-900">{property.build_year || "—"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">موقعیت</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">استان</span>
              <span className="font-medium text-zinc-900">{property.province || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">شهر</span>
              <span className="font-medium text-zinc-900">{property.city || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">کد پستی</span>
              <span className="font-medium text-zinc-900">{property.postal_code || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
        <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">اطلاعات مالی</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">ارزش فعلی</span>
            <span className="font-bold text-zinc-900">{Number(property.current_value || 0).toLocaleString("fa-IR")} ریال</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">ارزش برآوردی</span>
            <span className="font-medium text-zinc-900">{Number(property.estimated_value || 0).toLocaleString("fa-IR")} ریال</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">اجاره ماهانه</span>
            <span className="font-medium text-zinc-900">{Number(property.monthly_rent || 0).toLocaleString("fa-IR")} ریال</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">وضعیت حقوقی</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">وضعیت حقوقی</span>
            <span className="font-medium text-zinc-900">{property.legal_status || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">وضعیت بهره‌برداری</span>
            <span className="font-medium text-zinc-900">{property.occupancy_status || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">بهره‌بردار فعلی</span>
            <span className="font-medium text-zinc-900">{property.current_tenant || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}