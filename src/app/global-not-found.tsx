import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: "404 | Al-Dafwa Restaurant",
  description: "Page not found.",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={fontVariables}>
      <body>
        <main className="grid min-h-svh place-items-center px-4 text-center">
          <div>
            <p className="t-script text-[34px] text-gold">404</p>
            <h1 className="t-title mt-3 text-[28px] sm:text-[36px]">
              <span className="block">الصفحة غير موجودة</span>
              <span className="mt-2 block" lang="en" dir="ltr">Page not found</span>
            </h1>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/ar" className="btn btn-primary t-action">الرئيسية</Link>
              <Link href="/en" className="btn btn-outline t-action" lang="en">Home</Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
