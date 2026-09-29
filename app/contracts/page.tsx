"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [party, setParty] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("فعال");
  const [contractType, setContractType] = useState("خدماتی");

  useEffect(function () {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const result = await supabase.from("contracts").select("*").order("id", { ascending: false });
    if (result.data) setContracts(result.data);
    setLoading(false);
  }

  const filtered = contracts.filter(function (c) {
    return c.title.includes(searchTerm) || c.party.includes(searchTerm);
  });

  function resetForm() {
    setCode("");
    setTitle("");
    setParty("");
    setAmount("");
    setStartDate("");
    setEndDate("");
    setStatus("فعال");
    setContractType("خدماتی");
    setEditingId(null);
  }

  function openAdd() {
    resetForm();
    setIsModalOpen(true);
  }

  function openEdit(c: any) {
    setEditingId(c.id);
    setCode(c.code || "");
    setTitle(c.title || "");
    setParty(c.party || "");
    setAmount(String(c.amount || ""));
    setStartDate(c.start_date || "");
    setEndDate(c.end_date || "");
    setStatus(c.status || "فعال");
    setContractType(c.contract_type || "خدماتی");
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !party) {
      alert("عنوان و طرف را وارد کنید");
      return;
    }

    const data = {
      code: code || "CTR-" + String(contracts.length + 1).padStart(3, "0"),
      title: title,
      party: party,
      amount: Number(amount) || 0,
      start_date: startDate,
      end_date: endDate,
      status: status,
      contract_type: contractType,
    };

    if (editingId !== null) {
      const result = await supabase.from("contracts").update(data).eq("id", editingId);
      if (result.error) {
        alert("خطا در ویرایش: " + result.error.message);
        return;
      }
    } else {
      const result = await supabase.from("contracts").insert([data]);
      if (result.error) {
        alert("خطا در ثبت: " + result.error.message);
        return;
      }
    }

    setIsModalOpen(false);
    resetForm();
    loadData();
  }

  async function handleDelete(id: number, t: string) {
    if (!window.confirm("آیا از حذف «" + t + "» مطمئن هستید؟")) return;

    const result = await supabase.from("contracts").delete().eq("id", id);
    if (result.error) {
      alert("خطا در حذف: " + result.error.message);
      return;
    }
    loadData();
  }

  function getStatusClass(st: string) {
    if (st === "فعال") return "text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700";
    if (st === "در حال اجرا") return "text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700";
    if (st === "منقضی") return "text-xs px-3 py-1 rounded-full bg-rose-100 text-rose-700";
    return "text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700";
  }

  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">مدیریت قراردادها</h1>
          <p className="text-zinc-600">اتصال به دیتابیس Supabase</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 whitespace-nowrap"
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

      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-bold">در حال بارگذاری...</h3>
        </div>
      ) : (
        <>
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
                        <div className="text-zinc-600">نوع: <span className="font-medium text-zinc-900">{c.contract_type || "—"}</span></div>
                      </div>
                    </div>
                    <div className="md:min-w-[200px] border-t md:border-t-0 md:border-r border-zinc-100 pt-4 md:pt-0 md:pr-6 space-y-3">
                      <div>
                        <div className="text-xs text-zinc-500 mb-1">مبلغ</div>
                        <div className="font-bold text-zinc-900">{Number(c.amount || 0).toLocaleString("fa-IR")} ریال</div>
                      </div>
                      <div className="text-xs text-zinc-500">
                        <div>شروع: {c.start_date || "—"}</div>
                        <div>پایان: {c.end_date || "—"}</div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={function () { openEdit(c); }} className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-100">
                          ✏️ ویرایش
                        </button>
                        <button onClick={function () { handleDelete(c.id, c.title); }} className="flex-1 bg-rose-50 text-rose-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-rose-100">
                          🗑️ حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold">قراردادی پیدا نشد</h3>
            </div>
          )}
        </>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-xl font-bold">{editingId !== null ? "ویرایش قرارداد" : "ثبت قرارداد جدید"}</h2>
              <button onClick={function () { setIsModalOpen(false); resetForm(); }} className="text-2xl text-zinc-500 hover:text-zinc-700 px-2">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">کد</label>
                  <input type="text" value={code} onChange={function (e) { setCode(e.target.value); }} placeholder="CTR-007" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">نوع قرارداد</label>
                  <select value={contractType} onChange={function (e) { setContractType(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="خدماتی">خدماتی</option>
                    <option value="پیمانکاری">پیمانکاری</option>
                    <option value="اجاره">اجاره</option>
                    <option value="خرید">خرید</option>
                    <option value="فروش">فروش</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">عنوان قرارداد *</label>
                <input type="text" value={title} onChange={function (e) { setTitle(e.target.value); }} placeholder="عنوان" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">طرف قرارداد *</label>
                <input type="text" value={party} onChange={function (e) { setParty(e.target.value); }} placeholder="نام شرکت یا شخص" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">مبلغ (ریال)</label>
                <input type="number" value={amount} onChange={function (e) { setAmount(e.target.value); }} placeholder="0" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                <select value={status} onChange={function (e) { setStatus(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="فعال">فعال</option>
                  <option value="در حال اجرا">در حال اجرا</option>
                  <option value="منقضی">منقضی</option>
                  <option value="خاتمه‌یافته">خاتمه‌یافته</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-200">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
                  {editingId !== null ? "ذخیره تغییرات" : "ثبت قرارداد"}
                </button>
                <button type="button" onClick={function () { setIsModalOpen(false); resetForm(); }} className="flex-1 bg-zinc-100 text-zinc-700 py-3 rounded-lg font-medium hover:bg-zinc-200">
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
