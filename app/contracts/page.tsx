"use client";

import { useState } from "react";
import Link from "next/link";

const initialContracts = [
  { id: 1, code: "CTR-001", title: "قرارداد نگهداری آسانسور", party: "شرکت آسانسور نمونه", property: "ساختمان اداری مرکزی", amount: 250000000, startDate: "۱۴۰۵/۰۱/۱۵", endDate: "۱۴۰۵/۱۲/۲۹", status: "فعال" },
  { id: 2, code: "CTR-002", title: "قرارداد نظافت", party: "شرکت خدماتی نمونه", property: "ساختمان اداری مرکزی", amount: 480000000, startDate: "۱۴۰۵/۰۲/۰۱", endDate: "۱۴۰۵/۰۸/۰۱", status: "در حال اجرا" },
  { id: 3, code: "CTR-003", title: "قرارداد اجاره انبار", party: "شرکت بازرگانی نمونه", property: "انبار شماره ۳", amount: 1200000000, startDate: "۱۴۰۵/۰۳/۱۰", endDate: "۱۴۰۶/۰۳/۱۰", status: "فعال" },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState(initialContracts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [party, setParty] = useState("");
  const [property, setProperty] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("فعال");

  const filtered = contracts.filter(function (c) {
    return c.title.includes(searchTerm) || c.party.includes(searchTerm);
  });

  function resetForm() {
    setTitle("");
    setParty("");
    setProperty("");
    setAmount("");
    setStartDate("");
    setEndDate("");
    setStatus("فعال");
    setEditingId(null);
  }

  function openAdd() {
    resetForm();
    setIsModalOpen(true);
  }

  function openEdit(c: any) {
    setEditingId(c.id);
    setTitle(c.title);
    setParty(c.party);
    setProperty(c.property);
    setAmount(String(c.amount));
    setStartDate(c.startDate);
    setEndDate(c.endDate);
    setStatus(c.status);
    setIsModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !party) {
      alert("عنوان و طرف را وارد کنید");
      return;
    }

    if (editingId !== null) {
      setContracts(contracts.map(function (c) {
        if (c.id === editingId) {
          return {
            id: c.id,
            code: c.code,
            title: title,
            party: party,
            property: property,
            amount: Number(amount),
            startDate: startDate,
            endDate: endDate,
            status: status,
          };
        }
        return c;
      }));
    } else {
      const newId = contracts.length + 1;
      setContracts([...contracts, {
        id: newId,
        code: "CTR-" + String(newId).padStart(3, "0"),
        title: title,
        party: party,
        property: property,
        amount: Number(amount),
        startDate: startDate,
        endDate: endDate,
        status: status,
      }]);
    }
    setIsModalOpen(false);
    resetForm();
  }

  function handleDelete(id: number) {
    if (window.confirm("مطمئن هستید؟")) {
      setContracts(contracts.filter(function (c) { return c.id !== id; }));
    }
  }

  function getStatusClass(st: string) {
    if (st === "فعال") return "text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700";
    if (st === "در حال اجرا") return "text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700";
    if (st === "منقضی") return "text-xs px-3 py-1 rounded-full bg-rose-100 text-rose-700";
    return "text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700";
  }

  function getStatusBtnClass(st: string) {
    if (status === st) return "px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white";
    return "px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200";
  }
  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">مدیریت قراردادها</h1>
          <p className="text-zinc-600">مدیریت چرخه کامل قراردادهای سازمان</p>
        </div>
        <button onClick={openAdd} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-sm whitespace-nowrap">
          + ثبت قرارداد جدید
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-200 mb-6">
        <input type="text" placeholder="🔍 جستجو..." value={searchTerm} onChange={function (e) { setSearchTerm(e.target.value); }} className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="mb-4 text-sm text-zinc-600">
        نمایش {filtered.length} از {contracts.length} قرارداد
      </div>

      <div className="space-y-4">
        {filtered.map(function (c) {
          return (
            <div key={c.id} className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-2 py-1 rounded">{c.code}</span>
                    <span className={getStatusClass(c.status)}>{c.status}</span>
                  </div>
                  <Link href={"/contracts/" + c.id} className="text-lg font-bold text-zinc-900 mb-3 block hover:text-blue-600">
                    {c.title}
                  </Link>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="text-zinc-600">طرف: <span className="font-medium text-zinc-900">{c.party}</span></div>
                    <div className="text-zinc-600">ملک: <span className="font-medium text-zinc-900">{c.property}</span></div>
                  </div>
                </div>
                <div className="md:min-w-[200px] border-t md:border-t-0 md:border-r border-zinc-100 pt-4 md:pt-0 md:pr-6 space-y-3">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">مبلغ</div>
                    <div className="font-bold text-zinc-900">{c.amount.toLocaleString("fa-IR")} ریال</div>
                  </div>
                  <div className="text-xs text-zinc-500">
                    <div>شروع: {c.startDate}</div>
                    <div>پایان: {c.endDate}</div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={function () { openEdit(c); }} className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-100">ویرایش</button>
                    <button onClick={function () { handleDelete(c.id); }} className="flex-1 bg-rose-50 text-rose-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-rose-100">حذف</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-zinc-900">قراردادی پیدا نشد</h3>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          </div>
          <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-xl font-bold text-zinc-900">{editingId !== null ? "ویرایش قرارداد" : "ثبت قرارداد جدید"}</h2>
              <button onClick={function () { setIsModalOpen(false); resetForm(); }} className="text-2xl text-zinc-500 hover:text-zinc-700 px-2">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">عنوان *</label>
                  <input type="text" value={title} onChange={function (e) { setTitle(e.target.value); }} placeholder="عنوان قرارداد" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">طرف قرارداد *</label>
                  <input type="text" value={party} onChange={function (e) { setParty(e.target.value); }} placeholder="نام شرکت یا شخص" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">ملک مرتبط</label>
                <select value={property} onChange={function (e) { setProperty(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">انتخاب کنید</option>
                  <option value="ساختمان اداری مرکزی">ساختمان اداری مرکزی</option>
                  <option value="انبار شماره ۳">انبار شماره ۳</option>
                  <option value="واحد تجاری طبقه اول">واحد تجاری طبقه اول</option>
                  <option value="ساختمان مسکونی سازمان">ساختمان مسکونی سازمان</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">مبلغ (ریال)</label>
                <input type="number" value={amount} onChange={function (e) { setAmount(e.target.value); }} placeholder="مثلاً: 500000000" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">تاریخ شروع</label>
                  <input type="text" value={startDate} onChange={function (e) { setStartDate(e.target.value); }} placeholder="۱۴۰۵/۰۱/۰۱" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">تاریخ پایان</label>
                  <input type="text" value={endDate} onChange={function (e) { setEndDate(e.target.value); }} placeholder="۱۴۰۵/۱۲/۲۹" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">وضعیت</label>
                <div className="flex flex-wrap gap-2">
                  {["فعال", "در حال اجرا", "منقضی", "خاتمه‌یافته"].map(function (s) {
                    return (
                      <button type="button" key={s} onClick={function () { setStatus(s); }} className={getStatusBtnClass(s)}>{s}</button>
                      );
                  })}
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-zinc-200">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">{editingId !== null ? "ذخیره" : "ثبت"}</button>
                <button type="button" onClick={function () { setIsModalOpen(false); resetForm(); }} className="flex-1 bg-zinc-100 text-zinc-700 py-3 rounded-lg font-medium hover:bg-zinc-200">انصراف</button>
              </div>
            </form>
          </div>
        
      ) : null}
    </div>
  );
}