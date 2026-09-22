import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "مدیریت قراردادها",
      description: "مدیریت چرخه کامل قراردادها از درخواست تا خاتمه و بایگانی",
      href: "/contracts",
      icon: "📄",
    },
    {
      title: "امور حقوقی",
      description: "مدیریت پرونده‌های حقوقی، دعاوی، جلسات و مهلت‌های قانونی",
      href: "/legal",
      icon: "⚖️",
    },
    {
      title: "مدیریت املاک",
      description: "بانک اطلاعاتی جامع املاک، اسناد مالکیت و وضعیت حقوقی",
      href: "/properties",
      icon: "🏢",
    },
  ];

  return (
    <div dir="rtl" className="flex flex-col">
      {/* بخش Hero */}
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
            <Link
              href="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              ورود به سامانه
            </Link>
            <Link
              href="/properties"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              مشاهده املاک
            </Link>
          </div>
        </div>
      </section>

      {/* بخش سه کارت اصلی */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">
              سه هسته اصلی سامانه
            </h2>
            <p className="text-zinc-600">
              یک سامانه یکپارچه برای همه فرآیندهای سازمان
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group bg-white border border-zinc-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-200 transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <span className="text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  مشاهده
                  <span>←</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* بخش آمار */}
      <section className="py-16 px-4 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-white p-6 rounded-xl border border-zinc-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">۰</div>
              <div className="text-zinc-600">قرارداد فعال</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl border border-zinc-200">
              <div className="text-3xl font-bold text-emerald-600 mb-2">۰</div>
              <div className="text-zinc-600">پرونده حقوقی</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl border border-zinc-200">
              <div className="text-3xl font-bold text-amber-600 mb-2">۰</div>
              <div className="text-zinc-600">ملک ثبت‌شده</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl border border-zinc-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">۰</div>
              <div className="text-zinc-600">پیمانکار</div>
            </div>
          </div>
        </div>
      </section>

      {/* فوتر */}
      <footer className="bg-zinc-900 text-zinc-400 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2">
            سامانه جامع مدیریت قراردادها، امور حقوقی و املاک
          </p>
          <p className="text-sm">
            © ۱۴۰۵ — تمامی حقوق محفوظ است
          </p>
        </div>
      </footer>
    </div>
  );
}
