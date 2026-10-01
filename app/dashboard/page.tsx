"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  FileText,
  Building2,
  Scale,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  ChevronLeft,
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

export default function DashboardPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [legalCases, setLegalCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalContractAmount = contracts.reduce(function (sum, c) {
    return sum + Number(c.amount || 0);
  }, 0);

  const activeContracts = contracts.filter(function (c) {
    return c.status === "فعال";
  }).length;

  const activeCases = legalCases.filter(function (c) {
    return c.case_status === "جاری";
  }).length;

  const closedCases = legalCases.filter(function (c) {
    return c.case_status === "مختومه";
  }).length;

  const contractsByStatus = [
    { name: "فعال", value: contracts.filter(function (c) { return c.status === "فعال"; }).length },
    { name: "در حال اجرا", value: contracts.filter(function (c) { return c.status === "در حال اجرا"; }).length },
    { name: "منقضی", value: contracts.filter(function (c) { return c.status === "منقضی"; }).length },
    { name: "خاتمه‌یافته", value: contracts.filter(function (c) { return c.status === "خاتمه‌یافته"; }).length },
  ].filter(function (item) { return item.value > 0; });

  const propertiesByType = [
    { name: "اداری", value: properties.filter(function (p) { return p.property_type === "اداری"; }).length },
    { name: "تجاری", value: properties.filter(function (p) { return p.property_type === "تجاری"; }).length },
    { name: "مسکونی", value: properties.filter(function (p) { return p.property_type === "مسکونی"; }).length },
    { name: "انبار", value: properties.filter(function (p) { return p.property_type === "انبار"; }).length },
    { name: "ورزشی", value: properties.filter(function (p) { return p.property_type === "ورزشی"; }).length },
    { name: "پارکینگ", value: properties.filter(function (p) { return p.property_type === "پارکینگ"; }).length },
  ].filter(function (item) { return item.value > 0; });

  const legalByStage = [
    { name: "در حال رسیدگی", value: legalCases.filter(function (c) { return c.case_stage === "در حال رسیدگی"; }).length },
    { name: "تجدیدنظر", value: legalCases.filter(function (c) { return c.case_stage === "تجدیدنظر"; }).length },
    { name: "مختومه", value: legalCases.filter(function (c) { return c.case_stage === "مختومه"; }).length },
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

const recentContracts = [...contracts]
  .sort(function (a, b) { return b.id - a.id; })
  .slice(0, 5);
const recentCases = [...legalCases]
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
  if (loading) {
    return (
      <div dir="rtl" className="p-8 max-w-7xl mx-auto text-center">
        <h3 className="text-xl font-bold">در حال بارگذاری داشبورد...</h3>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">داشبورد مدیریتی</h1>
        <p className="text-zinc-600">نمای کلی سامانه در یک نگاه</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg  from-blue-500 to-blue-700 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 mb-1">{contracts.length}</div>
          <div className="text-sm text-zinc-600 mb-2">کل قراردادها</div>
          <div className="text-xs text-emerald-600">
            {activeContracts} قرارداد فعال
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg  from-amber-500 to-amber-700 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 mb-1">{properties.length}</div>
          <div className="text-sm text-zinc-600 mb-2">کل املاک</div>
          <div className="text-xs text-emerald-600">
            {properties.filter(function (p) { return p.status === "فعال"; }).length} ملک فعال
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg  from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-zinc-900 mb-1">{legalCases.length}</div>
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
              <li>• {contracts.filter(function (c) { return c.status === "فعال"; }).length} قرارداد فعال در حال پیگیری</li>
              <li>• {activeCases} پرونده حقوقی جاری نیاز به پیگیری دارد</li>
              <li>• {properties.filter(function (p) { return p.status === "در حال تعمیر"; }).length} ملک در حال تعمیر</li>
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