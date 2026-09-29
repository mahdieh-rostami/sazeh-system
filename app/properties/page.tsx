"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("اداری");
  const [area, setArea] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [deedNumber, setDeedNumber] = useState("");
  const [ownerName, setOwnerName] = useState("سازمان");
  const [status, setStatus] = useState("فعال");

  useEffect(function () {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const result = await supabase.from("properties").select("*").order("id", { ascending: false });
    if (result.data) setProperties(result.data);
    setLoading(false);
  }

  const filtered = properties.filter(function (p) {
    return (
      p.title.includes(searchTerm) ||
      p.code.includes(searchTerm) ||
      (p.full_address && p.full_address.includes(searchTerm))
    );
  });

  function resetForm() {
    setCode("");
    setTitle("");
    setPropertyType("اداری");
    setArea("");
    setProvince("");
    setCity("");
    setFullAddress("");
    setDeedNumber("");
    setOwnerName("سازمان");
    setStatus("فعال");
    setEditingId(null);
  }

  function openAdd() {
    resetForm();
    setIsModalOpen(true);
  }

  function openEdit(p: any) {
    setEditingId(p.id);
    setCode(p.code || "");
    setTitle(p.title || "");
    setPropertyType(p.property_type || "اداری");
    setArea(String(p.area || ""));
    setProvince(p.province || "");
    setCity(p.city || "");
    setFullAddress(p.full_address || "");
    setDeedNumber(p.deed_number || "");
    setOwnerName(p.owner_name || "سازمان");
    setStatus(p.status || "فعال");
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) {
      alert("عنوان ملک را وارد کنید");
      return;
    }

    const data = {
      code: code || "MLK-" + String(properties.length + 1).padStart(3, "0"),
      title: title,
      property_type: propertyType,
      usage_type: propertyType,
      area: Number(area) || 0,
      province: province,
      city: city,
      full_address: fullAddress,
      deed_number: deedNumber,
      owner_name: ownerName,
      status: status,
    };

    if (editingId !== null) {
      const result = await supabase.from("properties").update(data).eq("id", editingId);
      if (result.error) {
        alert("خطا در ویرایش: " + result.error.message);
        return;
      }
    } else {
      const result = await supabase.from("properties").insert([data]);
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

    const result = await supabase.from("properties").delete().eq("id", id);
    if (result.error) {
      alert("خطا در حذف: " + result.error.message);
      return;
    }
    loadData();
  }

  function getStatusClass(st: string) {
    if (st === "فعال") return "text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700";
    if (st === "در حال اجاره") return "text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700";
    if (st === "در حال تعمیر") return "text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700";
    return "text-xs px-3 py-1 rounded-full bg-zinc-100 text-zinc-700";
  }
  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">مدیریت املاک</h1>
          <p className="text-zinc-600">اتصال به دیتابیس Supabase</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 whitespace-nowrap"
        >
          ثبت ملک جدید
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
          <h3 className="text-xl font-bold">در حال بارگذاری...</h3>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-zinc-600">
            نمایش {filtered.length} از {properties.length} ملک
          </div>

          <div className="space-y-4">
            {filtered.map(function (p) {
              return (
                <div key={p.id} className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-2 py-1 rounded">{p.code}</span>
                        <span className={getStatusClass(p.status)}>{p.status}</span>
                        <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded">{p.property_type}</span>
                      </div>
                      <Link href={"/properties/" + p.id} className="text-lg font-bold text-zinc-900 mb-3 block hover:text-blue-600">
                        {p.title}
                      </Link>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="text-zinc-600">آدرس: <span className="font-medium text-zinc-900">{p.full_address || "—"}</span></div>
                        <div className="text-zinc-600">مالک: <span className="font-medium text-zinc-900">{p.owner_name || "—"}</span></div>
                      </div>
                    </div>
                    <div className="md:min-w-[200px] border-t md:border-t-0 md:border-r border-zinc-100 pt-4 md:pt-0 md:pr-6 space-y-3">
                      <div>
                        <div className="text-xs text-zinc-500 mb-1">متراژ</div>
                        <div className="font-bold text-zinc-900">{Number(p.area || 0).toLocaleString("fa-IR")} متر</div>
                      </div>
                      <div className="text-xs text-zinc-500">
                        <div>شهر: {p.city || "—"}</div>
                        <div>سند: {p.deed_number || "—"}</div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={function () { openEdit(p); }} className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-100">
                          ویرایش
                        </button>
                        <button onClick={function () { handleDelete(p.id, p.title); }} className="flex-1 bg-rose-50 text-rose-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-rose-100">
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
              <h3 className="text-xl font-bold">ملکی پیدا نشد</h3>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-xl font-bold">{editingId !== null ? "ویرایش ملک" : "ثبت ملک جدید"}</h2>
              <button onClick={function () { setIsModalOpen(false); resetForm(); }} className="text-2xl text-zinc-500 hover:text-zinc-700 px-2">x</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">کد ملک</label>
                  <input type="text" value={code} onChange={function (e) { setCode(e.target.value); }} placeholder="MLK-007" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">نوع ملک</label>
                  <select value={propertyType} onChange={function (e) { setPropertyType(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="اداری">اداری</option>
                    <option value="تجاری">تجاری</option>
                    <option value="مسکونی">مسکونی</option>
                    <option value="انبار">انبار</option>
                    <option value="ورزشی">ورزشی</option>
                    <option value="پارکینگ">پارکینگ</option>
                    <option value="زمین">زمین</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">عنوان ملک *</label>
                <input type="text" value={title} onChange={function (e) { setTitle(e.target.value); }} placeholder="مثلاً: ساختمان اداری شماره ۵" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">آدرس کامل</label>
                <input type="text" value={fullAddress} onChange={function (e) { setFullAddress(e.target.value); }} placeholder="شهر، خیابان، پلاک" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">استان</label>
                  <input type="text" value={province} onChange={function (e) { setProvince(e.target.value); }} placeholder="تهران" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">شهر</label>
                  <input type="text" value={city} onChange={function (e) { setCity(e.target.value); }} placeholder="تهران" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">متراژ</label>
                  <input type="number" value={area} onChange={function (e) { setArea(e.target.value); }} placeholder="0" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">شماره سند</label>
                  <input type="text" value={deedNumber} onChange={function (e) { setDeedNumber(e.target.value); }} placeholder="123/456" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">مالک</label>
                  <input type="text" value={ownerName} onChange={function (e) { setOwnerName(e.target.value); }} placeholder="سازمان" className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">وضعیت</label>
                <select value={status} onChange={function (e) { setStatus(e.target.value); }} className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="فعال">فعال</option>
                  <option value="در حال اجاره">در حال اجاره</option>
                  <option value="در حال تعمیر">در حال تعمیر</option>
                  <option value="غیرفعال">غیرفعال</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-200">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
                  {editingId !== null ? "ذخیره تغییرات" : "ثبت ملک"}
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