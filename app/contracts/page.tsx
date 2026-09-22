"use client";

import { useState } from "react";

const initialContracts = [
  { id: 1, code: "CTR-001", title: "قرارداد نگهداری آسانسور", party: "شرکت آسانسور نمونه", status: "فعال" },
  { id: 2, code: "CTR-002", title: "قرارداد نظافت", party: "شرکت خدماتی نمونه", status: "در حال اجرا" },
  { id: 3, code: "CTR-003", title: "قرارداد اجاره انبار", party: "شرکت بازرگانی نمونه", status: "فعال" },
];

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = initialContracts.filter(function (c) {
    return c.title.includes(searchTerm) || c.party.includes(searchTerm);
  });

  return (
    <div dir="rtl" className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">مدیریت قراردادها</h1>
          <p className="text-zinc-600">مدیریت چرخه کامل قراردادهای سازمان</p>
        </div>
        <button
          onClick={function () { setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          + ثبت قرارداد جدید
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

      <div className="space-y-4">
        {filtered.map(function (c) {
          return (
            <div key={c.id} className="bg-white border border-zinc-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-2 py-1 rounded">{c.code}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">{c.status}</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">{c.title}</h3>
              <p className="text-sm text-zinc-600">طرف قرارداد: {c.party}</p>
            </div>
          );
        })}
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">ثبت قرارداد جدید</h2>
            <p className="text-zinc-600 mb-6">فرم ثبت قرارداد</p>
            <button
              onClick={function () { setIsModalOpen(false); }}
              className="w-full bg-zinc-100 text-zinc-700 py-2.5 rounded-lg font-medium"
            >
              بستن
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}