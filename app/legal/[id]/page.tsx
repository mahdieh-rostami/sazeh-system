"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LegalCaseDetailPage() {
  const pathname = usePathname();
  const id = pathname ? pathname.split("/").pop() : null;
  const [legalCase, setLegalCase] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    if (id) {
      loadCase();
    }
  }, [id]);

  async function loadCase() {
    setLoading(true);
    const result = await supabase
      .from("legal_cases")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (result.data) {
      setLegalCase(result.data);
    } else {
      setLegalCase(null);
    }
    setLoading(false);
  }

  function getStageClass(st: string) {
    if (st === "در حال رسیدگی") return "text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700";
    if (st === "مختومه") return "text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700";
    if (st === "تجدیدنظر") return "text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700";
    return "text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700";
  }

  function getTypeClass(t: string) {
    if (t === "له سازمان") return "text-xs px-3 py-1 rounded bg-emerald-50 text-emerald-700";
    if (t === "علیه سازمان") return "text-xs px-3 py-1 rounded bg-rose-50 text-rose-700";
    return "text-xs px-3 py-1 rounded bg-zinc-50 text-zinc-700";
  }

  if (loading) {
    return (
      <div dir="rtl" className="p-8 max-w-7xl mx-auto text-center">
        <h3 className="text-xl font-bold">در حال بارگذاری...</h3>
      </div>
    );
  }

  if (!legalCase) {
    return (
      <div dir="rtl" className="p-8 max-w-7xl mx-auto text-center">
        <h3 className="text-xl font-bold mb-4">پرونده پیدا نشد</h3>
        <Link href="/legal" className="text-blue-600 underline">
          بازگشت به لیست پرونده‌ها
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <Link href="/legal" className="inline-flex items-center gap-2 text-zinc-600 hover:text-blue-600 mb-6 text-sm font-medium">
        بازگشت به لیست پرونده‌ها
      </Link>

      <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-3 py-1 rounded">{legalCase.code}</span>
              <span className={getStageClass(legalCase.case_stage)}>{legalCase.case_stage}</span>
              <span className={getTypeClass(legalCase.case_type)}>{legalCase.case_type}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">{legalCase.title}</h1>
            <p className="text-zinc-600">شماره پرونده: {legalCase.case_number || "—"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">طرفین دعوا</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">خواهان / شاکی</span>
              <span className="font-medium text-zinc-900">{legalCase.plaintiff || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">خوانده</span>
              <span className="font-medium text-zinc-900">{legalCase.defendant || "—"}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">مرجع قضایی</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">دادگاه</span>
              <span className="font-medium text-zinc-900">{legalCase.court_name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">شعبه</span>
              <span className="font-medium text-zinc-900">{legalCase.court_branch || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">قاضی</span>
              <span className="font-medium text-zinc-900">{legalCase.judge_name || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">اطلاعات مالی</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">مبلغ خواسته</span>
              <span className="font-bold text-zinc-900">{Number(legalCase.claim_amount || 0).toLocaleString("fa-IR")} ریال</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">مبلغ محکوم‌به</span>
              <span className="font-medium text-zinc-900">{Number(legalCase.awarded_amount || 0).toLocaleString("fa-IR")} ریال</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">هزینه‌های دادرسی</span>
              <span className="font-medium text-zinc-900">{Number(legalCase.costs_amount || 0).toLocaleString("fa-IR")} ریال</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">وضعیت پرونده</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">وضعیت</span>
              <span className="font-medium text-zinc-900">{legalCase.case_status || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">اولویت</span>
              <span className="font-medium text-zinc-900">{legalCase.priority || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">سطح ریسک</span>
              <span className="font-medium text-zinc-900">{legalCase.risk_level || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
        <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">اطلاعات زمانی</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">ثبت</span>
            <span className="font-medium text-zinc-900">{legalCase.filing_date || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">آخرین جلسه</span>
            <span className="font-medium text-zinc-900">{legalCase.last_session_date || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">جلسه بعدی</span>
            <span className="font-medium text-zinc-900">{legalCase.next_session_date || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">مهلت بعدی</span>
            <span className="font-medium text-zinc-900">{legalCase.next_deadline || "—"}</span>
          </div>
        </div>
      </div>

      {legalCase.verdict_summary && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">خلاصه رأی</h2>
          <p className="text-sm text-zinc-700 leading-relaxed">{legalCase.verdict_summary}</p>
        </div>
      )}
    </div>
  );
}