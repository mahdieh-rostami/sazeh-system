import Link from "next/link";
import { FileText, Scale, Building2, ArrowLeft, Users } from "lucide-react";

export default function Home() {
  return (
    <div dir="rtl" className="flex flex-col">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
            سامانه جامع مدیریت قراردادها،
            <br />
            امور حقوقی و املاک
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            بستر یکپارچه سازمانی برای مدیریت هوشمند قراردادها، پرونده‌های حقوقی، املاک و دارایی‌های سازمان
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md">
              ورود به سامانه
            </Link>
            <Link href="/properties" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50">
              مشاهده املاک
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">سه هسته اصلی سامانه</h2>
            <p className="text-zinc-600">یک سامانه یکپارچه برای همه فرآیندهای سازمان</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/contracts" className="group bg-white border border-zinc-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-200 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-5 shadow-md">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">مدیریت قراردادها</h3>
              <p className="text-zinc-600 leading-relaxed mb-4">مدیریت چرخه کامل قراردادها از درخواست تا خاتمه و بایگانی</p>
              <span className="text-blue-600 font-medium flex items-center gap-1">
                مشاهده
                <ArrowLeft className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/legal" className="group bg-white border border-zinc-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-200 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-5 shadow-md">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">امور حقوقی</h3>
              <p className="text-zinc-600 leading-relaxed mb-4">مدیریت پرونده‌های حقوقی، دعاوی، جلسات و مهلت‌های قانونی</p>
              <span className="text-blue-600 font-medium flex items-center gap-1">
                مشاهده
                <ArrowLeft className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/properties" className="group bg-white border border-zinc-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-200 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mb-5 shadow-md">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">مدیریت املاک</h3>
              <p className="text-zinc-600 leading-relaxed mb-4">بانک اطلاعاتی جامع املاک، اسناد مالکیت و وضعیت حقوقی</p>
              <span className="text-blue-600 font-medium flex items-center gap-1">
                مشاهده
                <ArrowLeft className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-white p-6 rounded-xl border border-zinc-200">
              <FileText className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <div className="text-3xl font-bold mb-2 text-blue-600">۰</div>
              <div className="text-zinc-600 text-sm">قرارداد فعال</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl border border-zinc-200">
              <Scale className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
              <div className="text-3xl font-bold mb-2 text-emerald-600">۰</div>
              <div className="text-zinc-600 text-sm">پرونده حقوقی</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl border border-zinc-200">
              <Building2 className="w-8 h-8 mx-auto mb-3 text-amber-600" />
              <div className="text-3xl font-bold mb-2 text-amber-600">۰</div>
              <div className="text-zinc-600 text-sm">ملک ثبت‌شده</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl border border-zinc-200">
              <Users className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <div className="text-3xl font-bold mb-2 text-purple-600">۰</div>
              <div className="text-zinc-600 text-sm">پیمانکار</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-zinc-900 text-zinc-400 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2 text-sm">سامانه جامع مدیریت قراردادها، امور حقوقی و املاک</p>
          <p className="text-xs">© ۱۴۰۵ — تمامی حقوق محفوظ است</p>
        </div>
      </footer>
    </div>
 );
}