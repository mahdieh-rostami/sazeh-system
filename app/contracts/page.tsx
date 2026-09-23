"use client";

import { useState } from "react";
import Link from "next/link";

const initial = [
  { id: 1, code: "CTR-001", title: "قرارداد نگهداری آسانسور", party: "شرکت آسانسور نمونه", property: "ساختمان اداری مرکزی", amount: 250000000, startDate: "۱۴۰۵/۰۱/۱۵", endDate: "۱۴۰۵/۱۲/۲۹", status: "فعال" },
  { id: 2, code: "CTR-002", title: "قرارداد نظافت", party: "شرکت خدماتی نمونه", property: "ساختمان اداری مرکزی", amount: 480000000, startDate: "۱۴۰۵/۰۲/۰۱", endDate: "۱۴۰۵/۰۸/۰۱", status: "در حال اجرا" },
  { id: 3, code: "CTR-003", title: "قرارداد اجاره انبار", party: "شرکت بازرگانی نمونه", property: "انبار شماره ۳", amount: 1200000000, startDate: "۱۴۰۵/۰۳/۱۰", endDate: "۱۴۰۶/۰۳/۱۰", status: "فعال" },
];

export default function Page() {
  const [items, setItems] = useState(initial);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f1, setF1] = useState("");
  const [f2, setF2] = useState("");
  const [f3, setF3] = useState("");
  const [f4, setF4] = useState("");
  const [f5, setF5] = useState("");
  const [f6, setF6] = useState("");
  const [f7, setF7] = useState("فعال");

  const list = items.filter(function (x) {
    return x.title.includes(search) || x.party.includes(search);
  });

  function clear() {
    setF1(""); setF2(""); setF3(""); setF4(""); setF5(""); setF6(""); setF7("فعال"); setEditId(null);
  }

  function add() { clear(); setOpen(true); }

  function edit(x: any) {
    setEditId(x.id); setF1(x.title); setF2(x.party);
    setF3(x.property === "—" ? "" : x.property);
    setF4(String(x.amount));
    setF5(x.startDate === "—" ? "" : x.startDate);
    setF6(x.endDate === "—" ? "" : x.endDate);
    setF7(x.status);
    setOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f1 || !f2) { alert("عنوان و طرف را وارد کنید"); return; }

    if (editId !== null) {
      setItems(items.map(function (x) {
        if (x.id === editId) {
          return { id: x.id, code: x.code, title: f1, party: f2, property: f3, amount: namber(f4), startDate: f5,  endDate: f6, status: f7 };
        }
        return x;
      }));
    } else {
      const nid = items.length + 1;
      setItems([...items, { id: nid, code: "CTR-" + String(nid).padStart(3, "0"), title: f1, party: f2, property: f3, amount: Number(f4), startDate: f5, endDate:  f6, status: f7 }]);
    }
    setOpen(false); clear();
  }

  function del(id: number) {
    if (window.confirm("مطمئن هستید؟")) {
      setItems(items.filter(function (x) { return x.id !== id; }));
    }
  }

  function statusCls(s: string) {
    if (s === "فعال") return "text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700";
    if (s === "در حال اجرا") return "text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700";
    if (s === "منقضی") return "text-xs px-3 py-1 rounded-full bg-rose-100 text-rose-700";
    return "text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700";
  }

  function statusBtn(s: string) {
    if (f7 === s) return "px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white";
    return "px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200";
  }

  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">مدیریت قراردادها</h1>
          <p className="text-zinc-600">مدیریت چرخه کامل قراردادهای سازمان</p>
        </div>
        <button onClick={add} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-sm whitespace-nowrap">
          + ثبت قرارداد جدید
        </button>
      </div>
      <div className="bg-white p-4 rounded-xl border border-zinc-200 mb-6">
        <input type="text" placeholder="🔍 جستجو..." value={search} onChange={function (e) { setSearch(e.target.value); }} className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="mb-4 text-sm text-zinc-600">
        نمایش {list.length} از {items.length} قرارداد
      </div>

      <div className="space-y-4">
        {list.map(function (x) {
          return (
            <div key={x.id} className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-2 py-1 rounded">{x.code}</span>
                    <span className={statusCls(x.status)}>{x.status}</span>
                  </div>
                  <Link href={"/contracts/" + x.id} className="text-lg font-bold text-zinc-900 mb-3 block hover:text-blue-600">
  {x.title}
</Link>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="text-zinc-600">👤 طرف: <span className="font-medium text-zinc-900">{x.party}</span></div>
                    <div className="text-zinc-600">🏢 ملک: <span className="font-medium text-zinc-900">{x.property}</span></div>
                  </div>
                </div>
                <div className="md:min-w-[200px] border-t md:border-t-0 md:border-r border-zinc-100 pt-4 md:pt-0 md:pr-6 space-y-3">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">مبلغ</div>
                    <div className="font-bold text-zinc-900">{x.amount.toLocaleString("fa-IR")} ریال</div>
                  </div>
                  <div className="text-xs text-zinc-500">
                    <div>شروع: {x.startDate}</div>
                    <div>پایان: {x.endDate}</div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={function () { edit(x); }} className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-100">✏️ ویرایش</button>
                    <button onClick={function () { del(x.id); }} className="flex-1 bg-rose-50 text-rose-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-rose-100">🗑️ حذف</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <div className="text-6xl mb-4">🔍</div>
          <Link href={"/contracts/" + x.id} className="text-lg font-bold text-zinc-900 mb-3 block hover:text-blue-600">
  {x.title}
</Link>
         </div> 
      ) : null}

      {open ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-xl font-bold text-zinc-900">{editId !== null ? "ویرایش قرارداد" : "ثبت قرارداد جدید"}</h2>
              <button onClick={function () { setOpen(false); clear(); }} className="text-2xl text-zinc-500 hover:text-zinc-700 px-2">×</button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">عنوان <span className="text-rose-500">*</span></label>
                  <input type="text" value={f1} onChange={function (e) { setF1(e.target.value); }} placeholder="عنوان قرارداد" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">طرف قرارداد <span className="text-rose-500">*</span></label>
                  <input type="text" value={f2} onChange={function (e) { setF2(e.target.value); }} placeholder="نام شرکت یا شخص" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">ملک مرتبط</label>
                <select value={f3} onChange={function (e) { setF3(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— انتخاب —</option>
                  <option value="ساختمان اداری مرکزی">ساختمان اداری مرکزی</option>
                  <option value="انبار شماره ۳">انبار شماره ۳</option>
                  <option value="واحد تجاری طبقه اول">واحد تجاری طبقه اول</option>
                  <option value="ساختمان مسکونی سازمان">ساختمان مسکونی سازمان</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">مبلغ (ریال)</label>
                <input type="number" value={f4} onChange={function (e) { setF4(e.target.value); }} placeholder="مثلاً: 500000000" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">تاریخ شروع</label>
                  <input type="text" value={f5} onChange={function (e) { setF5(e.target.value); }} placeholder="۱۴۰۵/۰۱/۰۱" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">تاریخ پایان</label>
                  <input type="text" value={f6} onChange={function (e) { setF6(e.target.value); }} placeholder="۱۴۰۵/۱۲/۲۹" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">وضعیت</label>
                <div className="flex flex-wrap gap-2">
                  {["فعال", "در حال اجرا", "منقضی", "خاتمه‌یافته"].map(function (s) {
                    return (
                      <button type="button" key={s} onClick={function () { setF7(s); }} className={statusBtn(s)}>{s}</button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-zinc-200">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">{editId !== null ? "ذخیره" : "ثبت"}</button>
                <button type="button" onClick={function () { setOpen(false); clear(); }} className="flex-1 bg-zinc-100 text-zinc-700 py-3 rounded-lg font-medium hover:bg-zinc-200">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

