"use client";

import { useState } from "react";

const sampleCases = [
  { id: 1, code: "LG-1405-001", title: "دعوای مطالبه وجه علیه سازمان", type: "علیه سازمان", client: "شرکت بازرگانی نمونه", court: "دادگاه عمومی تهران", stage: "در حال رسیدگی", nextDeadline: "۱۴۰۵/۰۸/۱۵" },
  { id: 2, code: "LG-1405-002", title: "شکایت از پیمانکار متخلف", type: "له سازمان", client: "شرکت ساختمانی الف", court: "دادگاه عمومی کرج", stage: "در حال رسیدگی", nextDeadline: "۱۴۰۵/۰۹/۰۱" },
  { id: 3, code: "LG-1405-003", title: "پرونده ملکی پلاک ۱۲۳", type: "له سازمان", client: "وراث مرحوم احمدی", court: "دادگاه عمومی مشهد", stage: "مختومه", nextDeadline: "-" },
  { id: 4, code: "LG-1405-004", title: "اعتراض به رأی دادگاه بدوی", type: "علیه سازمان", client: "آقای محمد رضایی", court: "دادگاه تجدیدنظر تهران", stage: "تجدیدنظر", nextDeadline: "۱۴۰۵/۰۸/۲۰" },
  { id: 5, code: "LG-1405-005", title: "دعوای الزام به تنظیم سند", type: "علیه سازمان", client: "خانم فاطمه کریمی", court: "دادگاه عمومی اصفهان", stage: "در حال رسیدگی", nextDeadline: "۱۴۰۵/۰۹/۱۰" },
  { id: 6, code: "LG-1404-020", title: "پرونده تخریب ساختمان", type: "له سازمان", client: "شهرداری منطقه ۵", court: "دادگاه عمومی تهران", stage: "مختومه", nextDeadline: "-" },
];

function StatusBadge({ stage }: { stage: string }) {
  let classes = "text-xs px-3 py-1 rounded-full border ";
  if (stage === "در حال رسیدگی") classes = classes + "bg-blue-100 text-blue-700 border-blue-200";
  else if (stage === "مختومه") classes = classes + "bg-emerald-100 text-emerald-700 border-emerald-200";
  else if (stage === "تجدیدنظر") classes = classes + "bg-amber-100 text-amber-700 border-amber-200";
  else classes = classes + "bg-zinc-100 text-zinc-700 border-zinc-200";
  return <span className={classes}>{stage}</span>;
}

function TypeBadge({ type }: { type: string }) {
  let classes = "text-xs px-2 py-1 rounded font-medium ";
  if (type === "له سازمان") classes = classes + "bg-emerald-50 text-emerald-700";
  else if (type === "علیه سازمان") classes = classes + "bg-rose-50 text-rose-700";
  else classes = classes + "bg-zinc-50 text-zinc-700";
  return <span className={classes}>{type}</span>;
}

export default function LegalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("همه");

  const stages = ["همه", "در حال رسیدگی", "تجدیدنظر", "مختومه"];

  const filteredCases = sampleCases.filter((c) => {
    const matchesSearch =
      c.title.includes(searchTerm) ||
      c.client.includes(searchTerm) ||
      c.code.includes(searchTerm) ||
      c.court.includes(searchTerm);
    const matchesStage = stageFilter === "همه" || c.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">امور حقوقی</h1>
          <p className="text-zinc-600">مدیریت پرونده‌های حقوقی و قضایی سازمان</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md whitespace-nowrap">
          + ثبت پرونده جدید
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-200 mb-6 space-y-4">
        <input
          type="text"
          placeholder="🔍 جستجو در پرونده‌ها (عنوان، طرف دعوا، دادگاه، کد)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex flex-wrap gap-2">
          {stages.map((stage) => {
let btnClass = "px-4 py-2 rounded-lg text-sm font-medium ";
            if (stageFilter === stage) btnClass = btnClass + "bg-blue-600 text-white";
            else btnClass = btnClass + "bg-zinc-100 text-zinc-700 hover:bg-zinc-200";
            return (
              <button key={stage} onClick={() => setStageFilter(stage)} className={btnClass}>
                {stage}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4 text-sm text-zinc-600">
        نمایش {filteredCases.length} پرونده از {sampleCases.length} پرونده
      </div>

      <div className="space-y-4">
        {filteredCases.map((c) => (
          <div key={c.id} className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-2 py-1 rounded">
                    {c.code}
                  </span>
                  <StatusBadge stage={c.stage} />
                  <TypeBadge type={c.type} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">{c.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <span>👤</span>
                    <span>طرف دعوا:</span>
                    <span className="font-medium text-zinc-900">{c.client}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <span>🏛️</span>
                    <span>مرجع:</span>
                    <span className="font-medium text-zinc-900">{c.court}</span>
                  </div>
                </div>
              </div>

              <div className="md:min-w-[180px] border-t md:border-t-0 md:border-r border-zinc-100 pt-4 md:pt-0 md:pr-6">
                <div className="text-xs text-zinc-500 mb-1">مهلت بعدی</div>
                <div className="font-bold text-zinc-900">{c.nextDeadline}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">پرونده‌ای پیدا نشد</h3>
          <p className="text-zinc-600">عبارت جستجو یا فیلتر دیگری را امتحان کنید</p>
        </div>
      )}
    </div>
  );
}
