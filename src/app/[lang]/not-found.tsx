import Link from "next/link";

// Rendered inside the [lang] layout; locale is unknown here, so it is bilingual.
export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center px-4 pt-[var(--header-h)] text-center">
      <div>
        <p className="t-script text-[34px] text-gold">404</p>
        <h1 className="t-title mt-3 text-[28px] sm:text-[36px]">
          <span className="block">الصفحة غير موجودة</span>
          <span className="mt-2 block" lang="en">Page not found</span>
        </h1>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/ar" className="btn btn-primary t-action">الرئيسية</Link>
          <Link href="/en" className="btn btn-outline t-action" lang="en">Home</Link>
        </div>
      </div>
    </section>
  );
}
