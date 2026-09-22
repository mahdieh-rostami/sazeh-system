"use client";

import { useState } from "react";

const sampleContracts = [
  { id: 1, code: "CTR-1405-001", title: "قرارداد نگهداری آسانسور", party: "شرکت آسانسور پارس", property: "ساختمان اداری مرکزی", amount: 250000000, startDate: "۱۴۰۵/۰۱/۱۵", endDate: "۱۴۰۵/۱۲/۲۹", status: "فعال" },
  { id: 2, code: "CTR-1405-002", title: "قرارداد نظافت و خدمات", party: "شرکت خدماتی پاک‌سازان", property: "ساختمان اداری مرکزی", amount: 480000000, startDate: "۱۴۰۵/۰۲/۰۱", endDate: "۱۴۰۵/۰۸/۰۱", status: "در حال اجرا" },
  { id: 3, code: "CTR-1405-003", title: "قرارداد اجاره انبار", party: "شرکت بازرگانی آریا", property: "انبار شماره ۳", amount: 1200000000, startDate: "۱۴۰۵/۰۳/۱۰", endDate: "۱۴۰۶/۰۳/۱۰", status: "فعال" },
  { id: 4, code: "CTR-1404-045", title: "قرارداد تعمیرات تأسیسات", party: "مهندسی سازه‌پرداز", property: "ساختمان مسکونی سازمان", amount: 380000000, startDate: "۱۴۰۴/۰۹/۰۱", endDate: "۱۴۰۵/۰۱/۰۱", status: "خاتمه‌یافته" },
  { id: 5, code: "CTR-1405-004", title: "قرارداد بیمه ساختمان", party: "بیمه ایران", property: "ساختمان اداری مرکزی", amount: 950000000, startDate: "۱۴۰۵/۰۴/۰۱", endDate: "۱۴۰۶/۰۴/۰۱", status: "فعال" },
  { id: 6, code: "CTR-1404-038", title: "قرارداد اجاره واحد تجاری", party: "آقای رضا محمدی", property: "واحد تجاری طبقه اول", amount: 720000000, startDate: "۱۴۰۴/۰۵/۱۵", endDate: "۱۴۰۵/۰۵/۱۵", status: "منقضی" },
];

function getStatusStyle(status: string) {
  if (status === "فعال") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "در حال اجرا") return "bg-blue-100 text-blue-700 border-blue-200";
  if (status === "منقضی") return "bg-rose-100 text-rose-700 border-rose-200";
  if (status === "خاتمه‌یافته") return "bg-zinc-100 text-zinc-700 border-zinc-200";
  return "bg-zinc-100 text-zinc-700 border-zinc-200";
}

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("همه");

  const statuses = ["همه", "فعال", "در حال اجرا", "منقضی", "خاتمه‌یافته"];

  const filteredContracts = sampleContracts.filter((contract) => {
    const matchesSearch =
      contract.title.includes(searchTerm) ||
      contract.party.includes(searchTerm) ||
      contract.property.includes(searchTerm) ||
      contract.code.includes(searchTerm);
    const matchesStatus = statusFilter === "همه" || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">مدیریت قراردادها</h1>
          <p className="text-zinc-600">مدیریت چرخه کامل قراردادهای سازمان</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md whitespace-nowrap">
          + ثبت قرارداد جدید
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-200 mb-6 space-y-4">
        <input
          type="text"
          placeholder="🔍 جستجو در قراردادها..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={
                statusFilter === status
                  ? "px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white"
                  : "px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }
            >
              {status}
            </button>
          ))}
        </div>
      </div>
<div className="mb-4 text-sm text-zinc-600">
        نمایش {filteredContracts.length} قرارداد از {sampleContracts.length} قرارداد
      </div>

      <div className="space-y-4">
        {filteredContracts.map((contract) => (
          <div
            key={contract.id}
            className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-2 py-1 rounded">
                    {contract.code}
                  </span>
                  <span className={'text-xs px-3 py-1 rounded-full border ${getStatusStyle(contract.status)}'}>
                    {contract.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">
                  {contract.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <span>👤</span>
                    <span>طرف قرارداد:</span>
                    <span className="font-medium text-zinc-900">{contract.party}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <span>🏢</span>
                    <span>ملک مرتبط:</span>
                    <span className="font-medium text-zinc-900">{contract.property}</span>
                  </div>
                </div>
              </div>

              <div className="md:text-left md:min-w-[180px] border-t md:border-t-0 md:border-r border-zinc-100 pt-4 md:pt-0 md:pr-6 space-y-2">
                <div>
                  <div className="text-xs text-zinc-500 mb-1">مبلغ قرارداد</div>
                  <div className="font-bold text-zinc-900">
                    {contract.amount.toLocaleString("fa-IR")} ریال
                  </div>
                </div>
                <div className="text-xs text-zinc-500">
                  <div>شروع: {contract.startDate}</div>
                  <div>پایان: {contract.endDate}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">قراردادی پیدا نشد</h3>
          <p className="text-zinc-600">عبارت جستجو یا فیلتر دیگری را امتحان کنید</p>
        </div>
      )}
    </div>
  );
}
