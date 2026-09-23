import Link from "next/link";

export default function ContractDetailPage() {
  const contract = {
    code: "CTR-001",
    title: "قرارداد نگهداری آسانسور",
    status: "فعال",
    party: "شرکت آسانسور نمونه",
    property: "ساختمان اداری مرکزی",
    amount: 250000000,
    startDate: "۱۴۰۵/۰۱/۱۵",
    endDate: "۱۴۰۵/۱۲/۲۹",
    description: "قرارداد نگهداری و تعمیرات دوره‌ای آسانسورهای ساختمان اداری مرکزی",
  };

  const guarantees = [
    { id: 1, type: "ضمانت‌نامه حسن انجام کار", amount: 25000000, expiry: "۱۴۰۵/۱۲/۲۹", status: "فعال" },
    { id: 2, type: "ضمانت‌نامه پیش‌پرداخت", amount: 50000000, expiry: "۱۴۰۵/۰۶/۱۵", status: "منقضی" },
  ];

  const payments = [
    { id: 1, title: "پیش‌پرداخت", amount: 50000000, date: "۱۴۰۵/۰۱/۲۰", status: "پرداخت شده" },
    { id: 2, title: "صورت‌وضعیت شماره ۱", amount: 75000000, date: "۱۴۰۵/۰۴/۱۵", status: "پرداخت شده" },
    { id: 3, title: "صورت‌وضعیت شماره ۲", amount: 75000000, date: "۱۴۰۵/۰۷/۱۰", status: "در انتظار تأیید" },
  ];

  const documents = [
    { id: 1, name: "متن قرارداد.pdf", size: "2.5 MB", date: "۱۴۰۵/۰۱/۱۵" },
    { id: 2, name: "ضمانت‌نامه.pdf", size: "1.2 MB", date: "۱۴۰۵/۰۱/۱۵" },
    { id: 3, name: "صورتجلسه تحویل.pdf", size: "850 KB", date: "۱۴۰۵/۰۱/۲۰" },
  ];

  const history = [
    { id: 1, action: "قرارداد ثبت شد", user: "مهدیه رستمی", date: "۱۴۰۵/۰۱/۱۵ - ۱۰:۳۰" },
    { id: 2, action: "قرارداد تأیید شد", user: "مدیر واحد", date: "۱۴۰۵/۰۱/۱۷ - ۱۴:۲۰" },
    { id: 3, action: "پیش‌پرداخت پرداخت شد", user: "واحد مالی", date: "۱۴۰۵/۰۱/۲۰ - ۰۹:۱۵" },
  ];

  return (
    <div dir="rtl" className="p-6 md:p-8 max-w-7xl mx-auto">

      <Link href="/contracts" className="inline-flex items-center gap-2 text-zinc-600 hover:text-blue-600 mb-6 text-sm font-medium">
        ← بازگشت به لیست قراردادها
      </Link>

      <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs text-zinc-500 font-mono bg-zinc-100 px-3 py-1 rounded">{contract.code}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">{contract.status}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">{contract.title}</h1>
            <p className="text-zinc-600 leading-relaxed">{contract.description}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              ویرایش
            </button>
            <button className="bg-zinc-100 text-zinc-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200">
              چاپ
            </button>
            <button className="bg-rose-50 text-rose-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-100">
              حذف
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">اطلاعات طرف قرارداد</h2>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">نام</span>
            <span className="font-medium text-zinc-900">{contract.party}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">ملک مرتبط</h2>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">نام ملک</span>
            <span className="font-medium text-zinc-900">{contract.property}</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
        <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">اطلاعات مالی</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">مبلغ کل</span>
            <span className="font-bold text-zinc-900">{contract.amount.toLocaleString("fa-IR")} ریال</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">پرداخت شده</span>
            <span className="font-medium text-emerald-700">۱۲۵,۰۰۰,۰۰۰ ریال</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">مانده</span>
            <span className="font-medium text-rose-700">۱۲۵,۰۰۰,۰۰۰ ریال</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
        <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">اطلاعات زمانی</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">شروع</span>
            <span className="font-medium text-zinc-900">{contract.startDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">پایان</span>
            <span className="font-medium text-zinc-900">{contract.endDate}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
        <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">ضمانت‌نامه‌ها</h2>
        <div className="space-y-3">
          {guarantees.map(function (g) {
            return (
              <div key={g.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 bg-zinc-50 rounded-lg text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-zinc-900">{g.type}</span>
                  <span className={g.status === "فعال" ? "text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700" : "text-xs px-2 py-1 rounded bg-zinc-200 text-zinc-600"}>
                    {g.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-zinc-600">
                  <span>{g.amount.toLocaleString("fa-IR")} ریال</span>
                  <span>انقضا: {g.expiry}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
        <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">پرداخت‌ها</h2>
        <div className="space-y-3">
          {payments.map(function (p) {
            return (
              <div key={p.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 bg-zinc-50 rounded-lg text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-zinc-900">{p.title}</span>
                  <span className={p.status === "پرداخت شده" ? "text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700" : "text-xs px-2 py-1 rounded bg-amber-100 text-amber-700"}>
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-zinc-600">
                  <span className="font-medium">{p.amount.toLocaleString("fa-IR")} ریال</span>
                  <span>{p.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
        <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">اسناد و مکاتبات</h2>
        <div className="space-y-2">
          {documents.map(function (d) {
            return (
              <div key={d.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg text-sm hover:bg-zinc-100">
                <div className="flex items-center gap-3">
                  <span>📄</span>
                  <span className="font-medium text-zinc-900">{d.name}</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-500 text-xs">
                  <span>{d.size}</span>
                  <span>{d.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">تاریخچه تغییرات</h2>
        <div className="space-y-3">
          {history.map(function (h) {
            return (
              <div key={h.id} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-medium text-zinc-900">{h.action}</div>
                  <div className="text-xs text-zinc-500 mt-1">{h.user} — {h.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}