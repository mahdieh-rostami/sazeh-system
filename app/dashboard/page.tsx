"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import {
  FileText,
  Building2,
  Scale,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  ChevronLeft,
  Download,
  Printer,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const RANGES = [
  { key: "today", label: "امروز" },
  { key: "week", label: "این هفته" },
  { key: "month", label: "این ماه" },
  { key: "year", label: "امسال" },
  { key: "all", label: "همه" },
];

export default function DashboardPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [legalCases, setLegalCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("all");

  useEffect(function () {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    const [c, p, l] = await Promise.all([
      supabase.from("contracts").select("*"),
      supabase.from("properties").select("*"),
      supabase.from("legal_cases").select("*"),
    ]);
    if (c.data) setContracts(c.data);
    if (p.data) setProperties(p.data);
    if (l.data) setLegalCases(l.data);
    setLoading(false);
  }

  function filterByRange(items: any[]) {
    if (range === "all") return items;
    const now = new Date();
    let start: Date;
    if (range === "today") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === "week") {
      const day = now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    } else if (range === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === "year") {
      start = new Date(now.getFullYear(), 0, 1);
    } else {
      return items;
    }
    return items.filter(function (item) {
      if (!item.created_at) return false;
      const d = new Date(item.created_at);
      return d >= start;
    });
  }

  const fContracts = filterByRange(contracts);
  const fProperties = filterByRange(properties);
  const fLegalCases = filterByRange(legalCases);

  const totalContractAmount = fContracts.reduce(function (sum, c) {
    return sum + Number(c.amount || 0);
  }, 0);

  const activeContracts = fContracts.filter(function (c) {
    return c.status === "فعال";
  }).length;

  const activeCases = fLegalCases.filter(function (c) {
    return c.case_status === "جاری";
  }).length;

  const closedCases = fLegalCases.filter(function (c) {
    return c.case_status === "مختومه";
  }).length;

  const contractsByStatus = [
    { name: "فعال", value: fContracts.filter(function (c) { return c.status === "فعال"; }).length },
    { name: "در حال اجرا", value: fContracts.filter(function (c) { return c.status === "در حال اجرا"; }).length },
    { name: "منقضی", value: fContracts.filter(function (c) { return c.status === "منقضی"; }).length },
    { name: "خاتمه‌یافته", value: fContracts.filter(function (c) { return c.status === "خاتمه‌یافته"; }).length },
  ].filter(function (item) { return item.value > 0; });

  const propertiesByType = [
    { name: "اداری", value: fProperties.filter(function (p) { return p.property_type === "اداری"; }).length },
    { name: "تجاری", value: fProperties.filter(function (p) { return p.property_type === "تجاری"; }).length },
    { name: "مسکونی", value: fProperties.filter(function (p) { return p.property_type === "مسکونی"; }).length },
    { name: "انبار", value: fProperties.filter(function (p) { return p.property_type === "انبار"; }).length },
    { name: "ورزشی", value: fProperties.filter(function (p) { return p.property_type === "ورزشی"; }).length },
    { name: "پارکینگ", value: fProperties.filter(function (p) { return p.property_type === "پارکینگ"; }).length },
  ].filter(function (item) { return item.value > 0; });

  const legalByStage = [
    { name: "در حال رسیدگی", value: fLegalCases.filter(function (c) { return c.case_stage === "در حال رسیدگی"; }).length },
    { name: "تجدیدنظر", value: fLegalCases.filter(function (c) { return c.case_stage === "تجدیدنظر"; }).length },
    { name: "مختومه", value: fLegalCases.filter(function (c) { return c.case_stage === "مختومه"; }).length },
  ].filter(function (item) { return item.value > 0; });

  function getPersianMonthName(dateStr: string) {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fa-IR", { month: "long" });
    } catch (e) {
      return null;
    }
  }

  function getMonthlyData() {
    const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"];
    const result = months.map(function (m) {
      return { month: m, قرارداد: 0, پرونده: 0 };
    });

    contracts.forEach(function (c) {
      const m = getPersianMonthName(c.created_at);
      const idx = months.indexOf(m || "");
      if (idx >= 0) result[idx].قرارداد++;
    });

    legalCases.forEach(function (c) {
      const m = getPersianMonthName(c.created_at);
      const idx = months.indexOf(m || "");
      if (idx >= 0) result[idx].پرونده++;
    });

    return result;
  }

  const monthlyData = getMonthlyData();

  const recentContracts = [...fContracts]
    .sort(function (a, b) { return b.id - a.id; })
    .slice(0, 5);
  const recentCases = [...fLegalCases]
    .sort(function (a, b) { return b.id - a.id; })
    .slice(0, 5);

  function formatAmount(amount: number) {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(1) + " میلیارد";
    }
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(0) + " میلیون";
    }
    return amount.toLocaleString("fa-IR");
  }

  function exportToExcel() {
    const wb = XLSX.utils.book_new();

    const contractsData = fContracts.map(function (c) {
      return {
        "کد": c.code,
        "عنوان": c.title,
        "طرف قرارداد": c.party,
        "نوع": c.contract_type,
        "مبلغ (ریال)": Number(c.amount || 0),
        "تاریخ شروع": c.start_date || "",
        "تاریخ پایان": c.end_date || "",
        "وضعیت": c.status,
      };
    });
    const wsContracts = XLSX.utils.json_to_sheet(contractsData);
    XLSX.utils.book_append_sheet(wb, wsContracts, "قراردادها");

    const propertiesData = fProperties.map(function (p) {
      return {
        "کد": p.code,
        "عنوان": p.title,
        "نوع": p.property_type,
        "متراژ": Number(p.area || 0),
        "استان": p.province || "",
        "شهر": p.city || "",
        "آدرس": p.full_address || "",
        "شماره سند": p.deed_number || "",
        "وضعیت": p.status,
      };
    });
    const wsProperties = XLSX.utils.json_to_sheet(propertiesData);
    XLSX.utils.book_append_sheet(wb, wsProperties, "املاک");

    const legalData = fLegalCases.map(function (c) {
      return {
        "کد": c.code,
        "عنوان": c.title,
        "نوع": c.case_type,
        "خواهان": c.plaintiff || "",
        "خوانده": c.defendant || "",
        "مرجع": c.court_name || "",
        "مرحله": c.case_stage,
        "مبلغ خواسته (ریال)": Number(c.claim_amount || 0),
        "مهلت بعدی": c.next_deadline || "",
        "وضعیت": c.case_status,
      };
    });
    const wsLegal = XLSX.utils.json_to_sheet(legalData);
    XLSX.utils.book_append_sheet(wb, wsLegal, "امور حقوقی");

    const fileName = "sazeh-system-report-" + new Date().toISOString().slice(0, 10) + ".xlsx";
    XLSX.writeFile(wb, fileName);
  }

  function printReport() {
    window.print();
  }

  if (loading) {
    return (
      <div dir="rtl" className="p-8 max-w-7xl mx-auto text-center">
        <h3 className="text-xl font-bold">در حال بارگذاری داشبورد...</h3>
      </div>
    );
  }
  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">داشبورد مدیریتی</h1>
        <p className="text-zinc-600">نمای کلی سامانه در یک نگاه</p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {RANGES.map(function (r) {
            const isActive = range === r.key;
            const cls = isActive
              ? "px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white"
              : "px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200";
            return (
              <button key={r.key} onClick={function () { setRange(r.key); }} className={cls}>
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
          >
            <Download className="w-4 h-4" />
            خروجی Excel
          </button>
          <button
            onClick={printReport}
            className="flex items-center gap-2 bg-zinc-100 text-zinc-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200"
          >
            <Printer className="w-4 h-4" />
            چاپ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg  from-blue-500 to-blue-700 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 mb-1">{fContracts.length}</div>
          <div className="text-sm text-zinc-600 mb-2">کل قراردادها</div>
          <div className="text-xs text-emerald-600">{activeContracts} قرارداد فعال</div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg  from-amber-500 to-amber-700 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 mb-1">{fProperties.length}</div>
          <div className="text-sm text-zinc-600 mb-2">کل املاک</div>
          <div className="text-xs text-emerald-600">
            {fProperties.filter(function (p) { return p.status === "فعال"; }).length} ملک فعال
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg  from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 mb-1">{fLegalCases.length}</div>
          <div className="text-sm text-zinc-600 mb-2">پرونده‌های حقوقی</div>
          <div className="text-xs text-zinc-500">
            {activeCases} جاری • {closedCases} مختومه
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg  from-purple-500 to-purple-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 mb-1">{formatAmount(totalContractAmount)}</div>
          <div className="text-sm text-zinc-600 mb-2">جمع مبالغ قراردادها</div>
          <div className="text-xs text-zinc-500">ریال</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-6">قراردادها بر اساس وضعیت</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contractsByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-6">املاک بر اساس کاربری</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertiesByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={function (entry: any) { return entry.name + " (" + entry.value + ")"; }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {propertiesByType.map(function (entry, index) {
                  return <Cell key={index} fill={COLORS[index % COLORS.length]} />;
                })}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-6">روند ۶ ماه اخیر</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="قرارداد" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="پرونده" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-6">پرونده‌های حقوقی بر اساس مرحله</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={legalByStage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={function (entry: any) { return entry.name + " (" + entry.value + ")"; }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {legalByStage.map(function (entry, index) {
                  return <Cell key={index} fill={COLORS[(index + 2) % COLORS.length]} />;
                })}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-amber-900 mb-2">هشدارهای مهم</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• {fContracts.filter(function (c) { return c.status === "فعال"; }).length} قرارداد فعال در حال پیگیری</li>
              <li>• {activeCases} پرونده حقوقی جاری نیاز به پیگیری دارد</li>
              <li>• {fProperties.filter(function (p) { return p.status === "در حال تعمیر"; }).length} ملک در حال تعمیر</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-zinc-900">آخرین قراردادها</h2>
            <Link href="/contracts" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              مشاهده همه
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentContracts.map(function (c) {
              return (
                <Link key={c.id} href={"/contracts/" + c.id} className="block p-3 rounded-lg hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-zinc-900 text-sm">{c.title}</span>
                    <span className="text-xs text-zinc-500 font-mono">{c.code}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{c.party}</span>
                    <span>{formatAmount(Number(c.amount || 0))} ریال</span>
                  </div>
                </Link>
              );
            })}
            {recentContracts.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-4">قراردادی یافت نشد</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-zinc-900">آخرین پرونده‌های حقوقی</h2>
            <Link href="/legal" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              مشاهده همه
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentCases.map(function (c) {
              return (
                <Link key={c.id} href={"/legal/" + c.id} className="block p-3 rounded-lg hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-zinc-900 text-sm">{c.title}</span>
                    <span className="text-xs text-zinc-500 font-mono">{c.code}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{c.case_stage}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {c.next_deadline || "—"}
                    </span>
                  </div>
                </Link>
              );
            })}
            {recentCases.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-4">پرونده‌ای یافت نشد</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
