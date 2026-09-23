import Link from "next/link";

export default function PropertyDetailPage() {
  return (
    <div dir="rtl" className="p-8 max-w-7xl mx-auto">
      <Link href="/properties" className="text-zinc-600 hover:text-blue-600 mb-6 inline-block text-sm font-medium">
        ← بازگشت به لیست املاک
      </Link>

      <div className="bg-white rounded-2xl border border-zinc-200 p-8 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-3 py-1 rounded">MLK-001</span>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">فعال</span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">ساختمان اداری مرکزی</h1>
        <p className="text-zinc-600">تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">اطلاعات ثبتی</h2>
          <p className="text-sm text-zinc-600">شماره سند: ۱۲۳/۴۵۶</p>
          <p className="text-sm text-zinc-600 mt-2">مالک: سازمان</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">مشخصات فیزیکی</h2>
          <p className="text-sm text-zinc-600">متراژ: ۴۵۰ متر</p>
          <p className="text-sm text-zinc-600 mt-2">کاربری: اداری</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">سال ساخت</h2>
          <p className="text-3xl font-bold text-blue-600 text-center py-4">۱۳۹۵</p>
        </div>
      </div>
    </div>
  );
}