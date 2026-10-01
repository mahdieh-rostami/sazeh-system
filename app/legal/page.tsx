"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LegalPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [code, setCode] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [title, setTitle] = useState("");
  const [caseType, setCaseType] = useState("علیه سازمان");
  const [plaintiff, setPlaintiff] = useState("");
  const [defendant, setDefendant] = useState("");
  const [courtName, setCourtName] = useState("");
  const [caseStage, setCaseStage] = useState("در حال رسیدگی");
  const [caseStatus, setCaseStatus] = useState("جاری");
  const [filingDate, setFilingDate] = useState("");
  const [nextDeadline, setNextDeadline] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [priority, setPriority] = useState("عادی");
  const [riskLevel, setRiskLevel] = useState("متوسط");

  useEffect(function () {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const result = await supabase.from("legal_cases").select("*").order("id", { ascending: false });
    if (result.data) setCases(result.data);
    setLoading(false);
  }

  const filtered = cases.filter(function (c) {
    return (
      c.title.includes(searchTerm) ||
      c.code.includes(searchTerm) ||
      (c.plaintiff && c.plaintiff.includes(searchTerm)) ||
      (c.defendant && c.defendant.includes(searchTerm))
    );
  });

  function resetForm() {
    setCode("");
    setCaseNumber("");
    setTitle("");
    setCaseType("علیه سازمان");
    setPlaintiff("");
    setDefendant("");
    setCourtName("");
    setCaseStage("در حال رسیدگی");
    setCaseStatus("جاری");
    setFilingDate("");
    setNextDeadline("");
    setClaimAmount("");
    setPriority("عادی");
    setRiskLevel("متوسط");
    setEditingId(null);
  }

  function openAdd() {
    resetForm();
    setIsModalOpen(true);
  }

  function openEdit(c: any) {
    setEditingId(c.id);
    setCode(c.code || "");
    setCaseNumber(c.case_number || "");
    setTitle(c.title || "");
    setCaseType(c.case_type || "علیه سازمان");
    setPlaintiff(c.plaintiff || "");
    setDefendant(c.defendant || "");
    setCourtName(c.court_name || "");
    setCaseStage(c.case_stage || "در حال رسیدگی");
    setCaseStatus(c.case_status || "جاری");
    setFilingDate(c.filing_date || "");
    setNextDeadline(c.next_deadline || "");
    setClaimAmount(String(c.claim_amount || ""));
    setPriority(c.priority || "عادی");
    setRiskLevel(c.risk_level || "متوسط");
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) {
      alert("عنوان پرونده را وارد کنید");
      return;
    }

    const data = {
      code: code || "LG-1405-" + String(cases.length + 1).padStart(3, "0"),
      case_number: caseNumber,
      title: title,
      case_type: caseType,
      plaintiff: plaintiff,
      defendant: defendant,
      court_name: courtName,
      case_stage: caseStage,
      case_status: caseStatus,
      filing_date: filingDate,
      next_deadline: nextDeadline,
      claim_amount: Number(claimAmount) || 0,
      priority: priority,
      risk_level: riskLevel,
    };

    if (editingId !== null) {
      const result = await supabase.from("legal_cases").update(data).eq("id", editingId);
      if (result.error) {
        alert("خطا در ویرایش: " + result.error.message);
        return;
      }
    } else {
      const result = await supabase.from("legal_cases").insert([data]);
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

    const result = await supabase.from("legal_cases").delete().eq("id", id);
    if (result.error) {
      alert("خطا در حذف: " + result.error.message);
      return;
    }
    loadData();
  }

  function getStageClass(st: string) {
    if (st === "در حال رسیدگی") return "text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700";
    if (st === "مختومه") return "text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700";
    if (st === "تجدیدنظر") return "text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700";
    return "text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700";
  }

  function getTypeClass(t: string) {
    if (t === "له سازمان") return "text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700";
    if (t === "علیه سازمان") return "text-xs px-2 py-1 rounded bg-rose-50 text-rose-700";
    return "text-xs px-2 py-1 rounded bg-zinc-50 text-zinc-700";
  }

  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">امور حقوقی</h1>
          <p className="text-zinc-600">اتصال به دیتابیس Supabase</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 whitespace-nowrap"
        >
          ثبت پرونده جدید
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-200 mb-6">
        <input
          type="text"
          placeholder="جستجو در پرونده‌ها..."
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
            نمایش {filtered.length} از {cases.length} پرونده
          </div>

          <div className="space-y-4">
            {filtered.map(function (c) {
              return (
                <div key={c.id} className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-2 py-1 rounded">{c.code}</span>
                        <span className={getStageClass(c.case_stage)}>{c.case_stage}</span>
                        <span className={getTypeClass(c.case_type)}>{c.case_type}</span>
                      </div>
                      <Link href={"/legal/" + c.id} className="text-lg font-bold text-zinc-900 mb-3 block hover:text-blue-600">
                        {c.title}
                      </Link>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="text-zinc-600">خواهان: <span className="font-medium text-zinc-900">{c.plaintiff || "—"}</span></div>
                        <div className="text-zinc-600">خوانده: <span className="font-medium text-zinc-900">{c.defendant || "—"}</span></div>
                        <div className="text-zinc-600">مرجع: <span className="font-medium text-zinc-900">{c.court_name || "—"}</span></div>
                        <div className="text-zinc-600">شماره پرونده: <span className="font-medium text-zinc-900">{c.case_number || "—"}</span></div>
                      </div>
                    </div>
                    <div className="md:min-w-[200px] border-t md:border-t-0 md:border-r border-zinc-100 pt-4 md:pt-0 md:pr-6 space-y-3">
                      <div>
                        <div className="text-xs text-zinc-500 mb-1">مبلغ خواسته</div>
                        <div className="font-bold text-zinc-900">{Number(c.claim_amount || 0).toLocaleString("fa-IR")} ریال</div>
                      </div>
                      <div className="text-xs text-zinc-500">
                        <div>ثبت: {c.filing_date || "—"}</div>
                        <div>مهلت بعدی: {c.next_deadline || "—"}</div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={function () { openEdit(c); }} className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-100">
                          ویرایش
                        </button>
                        <button onClick={function () { handleDelete(c.id, c.title); }} className="flex-1 bg-rose-50 text-rose-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-rose-100">
                          حذف
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
              <h3 className="text-xl font-bold">پرونده‌ای پیدا نشد</h3>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-xl font-bold">{editingId !== null ? "ویرایش پرونده" : "ثبت پرونده جدید"}</h2>
              <button onClick={function () { setIsModalOpen(false); resetForm(); }} className="text-2xl text-zinc-500 hover:text-zinc-700 px-2">x</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">کد پرونده</label>
                  <input type="text" value={code} onChange={function (e) { setCode(e.target.value); }} placeholder="LG-1405-007" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">شماره پرونده</label>
                  <input type="text" value={caseNumber} onChange={function (e) { setCaseNumber(e.target.value); }} placeholder="140598..." className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">نوع پرونده</label>
                  <select value={caseType} onChange={function (e) { setCaseType(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="علیه سازمان">علیه سازمان</option>
                    <option value="له سازمان">له سازمان</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">عنوان پرونده *</label>
                <input type="text" value={title} onChange={function (e) { setTitle(e.target.value); }} placeholder="عنوان پرونده" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">خواهان / شاکی</label>
                  <input type="text" value={plaintiff} onChange={function (e) { setPlaintiff(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">خوانده</label>
                  <input type="text" value={defendant} onChange={function (e) { setDefendant(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">مرجع قضایی</label>
                <input type="text" value={courtName} onChange={function (e) { setCourtName(e.target.value); }} placeholder="دادگاه..." className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">مرحله پرونده</label>
                  <select value={caseStage} onChange={function (e) { setCaseStage(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="در حال رسیدگی">در حال رسیدگی</option>
                    <option value="تجدیدنظر">تجدیدنظر</option>
                    <option value="مختومه">مختومه</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">وضعیت</label>
                  <select value={caseStatus} onChange={function (e) { setCaseStatus(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="جاری">جاری</option>
                    <option value="مختومه">مختومه</option>
                    <option value="معوق">معوق</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">تاریخ ثبت</label>
                  <input type="text" value={filingDate} onChange={function (e) { setFilingDate(e.target.value); }} placeholder="۱۴۰۵/۰۱/۰۱" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">مهلت بعدی</label>
                  <input type="text" value={nextDeadline} onChange={function (e) { setNextDeadline(e.target.value); }} placeholder="۱۴۰۵/۰۹/۰۱" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">مبلغ خواسته (ریال)</label>
                  <input type="number" value={claimAmount} onChange={function (e) { setClaimAmount(e.target.value); }} placeholder="0" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">اولویت</label>
                  <select value={priority} onChange={function (e) { setPriority(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="کم">کم</option>
                    <option value="عادی">عادی</option>
                    <option value="مهم">مهم</option>
                    <option value="فوری">فوری</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">سطح ریسک</label>
                  <select value={riskLevel} onChange={function (e) { setRiskLevel(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="پایین">پایین</option>
                    <option value="متوسط">متوسط</option>
                    <option value="بالا">بالا</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-200">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
                  {editingId !== null ? "ذخیره تغییرات" : "ثبت پرونده"}
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