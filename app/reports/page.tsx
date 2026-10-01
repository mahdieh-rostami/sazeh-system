"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { Download, Printer, Filter, X } from "lucide-react";

function StatusBadge(props: { status: string }) {
  let cls = "text-xs px-2 py-1 rounded-full ";
  if (props.status === "فعال") cls = cls + "bg-emerald-100 text-emerald-700";
  else if (props.status === "در حال اجرا") cls = cls + "bg-blue-100 text-blue-700";
  else if (props.status === "منقضی") cls = cls + "bg-rose-100 text-rose-700";
  else if (props.status === "خاتمه‌یافته") cls = cls + "bg-zinc-100 text-zinc-700";
  else if (props.status === "در حال اجاره") cls = cls + "bg-blue-100 text-blue-700";
  else if (props.status === "در حال تعمیر") cls = cls + "bg-amber-100 text-amber-700";
  else if (props.status === "جاری") cls = cls + "bg-blue-100 text-blue-700";
  else if (props.status === "مختومه") cls = cls + "bg-emerald-100 text-emerald-700";
  else cls = cls + "bg-zinc-100 text-zinc-700";
  return <span className={cls}>{props.status}</span>;
}

export default function ReportsPage() {
  const [tab, setTab] = useState("contracts");
  const [contracts, setContracts] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [legalCases, setLegalCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(function () {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const c = await supabase.from("contracts").select("*").order("id", { ascending: false });
    const p = await supabase.from("properties").select("*").order("id", { ascending: false });
    const l = await supabase.from("legal_cases").select("*").order("id", { ascending: false });
    if (c.data) setContracts(c.data);
    if (p.data) setProperties(p.data);
    if (l.data) setLegalCases(l.data);
    setLoading(false);
  }

  function filterItems(items: any[]) {
    return items.filter(function (item) {
      const matchSearch =
        search === "" ||
        (item.title && item.title.includes(search)) ||
        (item.code && item.code.includes(search)) ||
        (item.party && item.party.includes(search)) ||
        (item.plaintiff && item.plaintiff.includes(search)) ||
        (item.defendant && item.defendant.includes(search));

      let matchDate = true;
      if (dateFrom || dateTo) {
        const rawDate = item.created_at || item.filing_date;
        if (rawDate) {
          const d = new Date(rawDate);
          if (dateFrom && d < new Date(dateFrom)) matchDate = false;
          if (dateTo) {
            const to = new Date(dateTo);
            to.setHours(23, 59, 59, 999);
            if (d > to) matchDate = false;
          }
        }
      }
      return matchSearch && matchDate;
    });
  }

  const filteredContracts = filterItems(contracts);
  const filteredProperties = filterItems(properties);
  const filteredLegal = filterItems(legalCases);

  const totalContractsAmount = filteredContracts.reduce(function (sum, c) {
    return sum + Number(c.amount || 0);
  }, 0);

  const totalPropertiesArea = filteredProperties.reduce(function (sum, p) {
    return sum + Number(p.area || 0);
  }, 0);

  const totalLegalAmount = filteredLegal.reduce(function (sum, c) {
    return sum + Number(c.claim_amount || 0);
  }, 0);

  function exportExcel(rows: any[], sheetName: string, fileName: string) {
    if (rows.length === 0) {
      alert("داده‌ای برای خروجی وجود ندارد");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const today = new Date().toISOString().slice(0, 10);
    const fullName = fileName + "-" + today + ".xlsx";
    XLSX.writeFile(wb, fullName);
  }
  function exportContracts() {
    const rows = filteredContracts.map(function (c) {
      return {
        "کد": c.code || "",
        "عنوان": c.title || "",
        "طرف": c.party || "",
        "نوع": c.contract_type || "",
        "مبلغ": Number(c.amount || 0),
        "شروع": c.start_date || "",
        "پایان": c.end_date || "",
        "وضعیت": c.status || "",
      };
    });
    exportExcel(rows, "قراردادها", "contracts-report");
  }

  function exportProperties() {
    const rows = filteredProperties.map(function (p) {
      return {
        "کد": p.code || "",
        "عنوان": p.title || "",
        "نوع": p.property_type || "",
        "متراژ": Number(p.area || 0),
        "استان": p.province || "",
        "شهر": p.city || "",
        "آدرس": p.full_address || "",
        "سند": p.deed_number || "",
        "وضعیت": p.status || "",
      };
    });
    exportExcel(rows, "املاک", "properties-report");
  }

  function exportLegal() {
    const rows = filteredLegal.map(function (c) {
      return {
        "کد": c.code || "",
        "عنوان": c.title || "",
        "نوع": c.case_type || "",
        "خواهان": c.plaintiff || "",
        "خوانده": c.defendant || "",
        "مرجع": c.court_name || "",
        "مرحله": c.case_stage || "",
        "مبلغ خواسته": Number(c.claim_amount || 0),
        "وضعیت": c.case_status || "",
      };
    });
    exportExcel(rows, "پرونده‌ها", "legal-report");
  }

  function exportFinancial() {
    const months: any = {};
    contracts.forEach(function (c) {
      if (c.created_at && c.amount) {
        const d = new Date(c.created_at);
        const key = d.toLocaleDateString("fa-IR", { month: "long" });
        if (!months[key]) months[key] = 0;
        months[key] += Number(c.amount);
      }
    });
    const rows = Object.keys(months).map(function (k) {
      return { "ماه": k, "جمع مبالغ": months[k] };
    });
    exportExcel(rows, "گزارش مالی", "financial-report");
  }

  function clearFilters() {
    setSearch("");
    setDateFrom("");
    setDateTo("");
  }

  function formatAmount(amount: number) {
    if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + " میلیارد";
    if (amount >= 1000000) return (amount / 1000000).toFixed(0) + " میلیون";
    if (amount === 0) return "۰";
    return amount.toLocaleString("fa-IR");
  }

  function tabClass(name: string) {
    if (tab === name) {
      return "px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white";
    }
    return "px-4 py-2 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100";
  }

  if (loading) {
    return (
      <div dir="rtl" className="p-8 text-center">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">گزارش‌گیری</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="text-sm text-zinc-500 mb-1">جمع مبالغ قراردادها</div>
          <div className="text-2xl font-bold text-blue-700">{formatAmount(totalContractsAmount)}</div>
          <div className="text-xs text-zinc-500 mt-1">ریال</div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="text-sm text-zinc-500 mb-1">جمع متراژ املاک</div>
          <div className="text-2xl font-bold text-amber-700">{totalPropertiesArea.toLocaleString("fa-IR")}</div>
          <div className="text-xs text-zinc-500 mt-1">متر مربع</div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="text-sm text-zinc-500 mb-1">جمع مبالغ خواسته</div>
          <div className="text-2xl font-bold text-emerald-700">{formatAmount(totalLegalAmount)}</div>
          <div className="text-xs text-zinc-500 mt-1">ریال</div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-zinc-200 p-2 mb-6 flex flex-wrap gap-2">
        <button onClick={function () { setTab("contracts"); }} className={tabClass("contracts")}>گزارش قراردادها</button>
        <button onClick={function () { setTab("properties"); }} className={tabClass("properties")}>گزارش املاک</button>
        <button onClick={function () { setTab("legal"); }} className={tabClass("legal")}>گزارش حقوقی</button>
        <button onClick={function () { setTab("financial"); }} className={tabClass("financial")}>گزارش مالی</button>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-zinc-700">
          <Filter className="w-4 h-4" />
          فیلترها
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="جستجو..."
            value={search}
            onChange={function (e) { setSearch(e.target.value); }}
            className="px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dateFrom}
            onChange={function (e) { setDateFrom(e.target.value); }}
            className="px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            dir="ltr"
          />
          <input
            type="date"
            value={dateTo}
            onChange={function (e) { setDateTo(e.target.value); }}
            className="px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            dir="ltr"
          />
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 bg-zinc-100 text-zinc-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-200"
          >
            <X className="w-4 h-4" />
            پاک کردن
          </button>
        </div>
      </div>

      {tab === "contracts" && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="text-sm text-zinc-600">
              نمایش {filteredContracts.length} از {contracts.length} قرارداد
            </div>
            <div className="flex gap-2">
              <button onClick={exportContracts} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
                <Download className="w-4 h-4" />
                خروجی Excel
              </button>
              <button onClick={function () { window.print(); }} className="flex items-center gap-2 bg-zinc-100 text-zinc-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200">
                <Printer className="w-4 h-4" />
                چاپ
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">کد</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">عنوان</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">طرف قرارداد</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">نوع</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">مبلغ</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">وضعیت</th>
                </tr>
                </thead>
              <tbody>
                {filteredContracts.map(function (c) {
                  return (
                    <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="px-4 py-3 text-zinc-500 text-xs">{c.code}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{c.title}</td>
                      <td className="px-4 py-3 text-zinc-600">{c.party}</td>
                      <td className="px-4 py-3 text-zinc-600">{c.contract_type || "-"}</td>
                      <td className="px-4 py-3 text-zinc-900">{Number(c.amount || 0).toLocaleString("fa-IR")}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "properties" && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="text-sm text-zinc-600">
              نمایش {filteredProperties.length} از {properties.length} ملک
            </div>
            <div className="flex gap-2">
              <button onClick={exportProperties} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
                <Download className="w-4 h-4" />
                خروجی Excel
              </button>
              <button onClick={function () { window.print(); }} className="flex items-center gap-2 bg-zinc-100 text-zinc-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200">
                <Printer className="w-4 h-4" />
                چاپ
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">کد</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">عنوان</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">نوع</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">متراژ</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">شهر</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-700">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map(function (p) {
                  return (
                    <tr key={p.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="px-4 py-3 text-zinc-500 text-xs">{p.code}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{p.title}</td>
                      <td className="px-4 py-3 text-zinc-600">{p.property_type}</td>
                      <td className="px-4 py-3 text-zinc-900">{Number(p.area || 0).toLocaleString("fa-IR")} متر</td>
                      <td className="px-4 py-3 text-zinc-600">{p.city}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "legal" && (
        <div>
        
              <tbody>
                {filteredLegal.map(function (c) {
                  return (
                    <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="px-4 py-3 text-zinc-500 text-xs">{c.code}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{c.title}</td>
                      <td className="px-4 py-3 text-zinc-600">{c.case_type}</td>
                      <td className="px-4 py-3 text-zinc-600">{c.court_name}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.case_stage} /></td>
                      <td className="px-4 py-3 text-zinc-900">{Number(c.claim_amount || 0).toLocaleString("fa-IR")}</td>
                    </tr>
                  );
                })}
              </tbody>
            
          </div>
        
      )}

      {tab === "financial" && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="text-sm text-zinc-500">جمع مبالغ قراردادها</div>
            <button onClick={exportFinancial} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
              <Download className="w-4 h-4" />
              خروجی Excel
            </button>
          </div>
          <div className="text-4xl font-bold text-blue-700 text-center py-8">
            {formatAmount(totalContractsAmount)} ریال
          </div>
          <div className="text-center text-sm text-zinc-500">
             {filteredContracts.length}از قرارداد
          </div>
        </div>
      )}
    </div>
  );
}