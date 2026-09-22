"use client";

import { useState } from "react";

const sampleProperties = [
  {
    id: 1,
    code: "MLK-001",
    title: "ساختمان اداری مرکزی",
    address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
    area: 450,
    usageType: "اداری",
    status: "فعال",
    image: "🏢",
  },
  {
    id: 2,
    code: "MLK-002",
    title: "انبار شماره ۳",
    address: "کرج، شهرک صنعتی، خیابان ۵",
    area: 1200,
    usageType: "انبار",
    status: "در حال اجاره",
    image: "🏭",
  },
  {
    id: 3,
    code: "MLK-003",
    title: "زمین ورزشی شمال",
    address: "تهران، سعادت‌آباد، بلوار دریا",
    area: 2500,
    usageType: "ورزشی",
    status: "فعال",
    image: "🏟️",
  },
  {
    id: 4,
    code: "MLK-004",
    title: "واحد تجاری طبقه اول",
    address: "اصفهان، خیابان چهارباغ",
    area: 120,
    usageType: "تجاری",
    status: "فعال",
    image: "🏬",
  },
  {
    id: 5,
    code: "MLK-005",
    title: "ساختمان مسکونی سازمان",
    address: "مشهد، بلوار وکیل‌آباد",
    area: 680,
    usageType: "مسکونی",
    status: "در حال تعمیر",
    image: "🏘️",
  },
  {
    id: 6,
    code: "MLK-006",
    title: "پارکینگ طبقاتی",
    address: "شیراز، بلوار زند",
    area: 900,
    usageType: "پارکینگ",
    status: "فعال",
    image: "🅿️",
  },
];

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = sampleProperties.filter(
    (property) =>
      property.title.includes(searchTerm) ||
      property.address.includes(searchTerm) ||
      property.code.includes(searchTerm)
  );

  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            مدیریت املاک
          </h1>
          <p className="text-zinc-600">
            بانک اطلاعاتی جامع املاک سازمان
          </p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md whitespace-nowrap">
          + ثبت ملک جدید
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-200 mb-6">
        <input
          type="text"
          placeholder="🔍 جستجو در املاک (نام، آدرس، کد ملک)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-4 text-sm text-zinc-600">
        نمایش {filteredProperties.length} ملک از {sampleProperties.length} ملک
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-40 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
              {property.image}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-2 py-1 rounded">
                  {property.code}
                </span>
                <span
                  className={
                    property.status === "فعال"
                      ? "text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700"
                      : "text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700"
                      }
                >
                  {property.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                {property.title}
              </h3>
              <p className="text-sm text-zinc-600 mb-4 leading-relaxed">
                📍 {property.address}
              </p>
              <div className="border-t border-zinc-100 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">متراژ</span>
                  <span className="font-medium text-zinc-900">
                    {property.area.toLocaleString("fa-IR")} متر
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">نوع کاربری</span>
                  <span className="font-medium text-zinc-900">
                    {property.usageType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">
            ملکی پیدا نشد
          </h3>
          <p className="text-zinc-600">
            عبارت جستجوی دیگری را امتحان کنید
          </p>
        </div>
      )}
    </div>
  );
}