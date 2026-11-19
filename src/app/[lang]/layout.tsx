import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontVariables } from "../fonts";
import { restaurant } from "@/config/restaurant";
import { dirOf, isLocale, locales } from "@/i18n/config";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartToast } from "@/components/cart/CartToast";
import { MobileCartBar } from "@/components/cart/MobileCartBar";
import { ItemDialog } from "@/components/menu/ItemDialog";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { whatsappEnquiryHref } from "@/lib/links";
import { JsonLd, restaurantJsonLd, SEO } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "ar";
  return {
    metadataBase: new URL(restaurant.siteUrl),
    title: { default: SEO[locale].siteTitle, template: `%s` },
    description: SEO[locale].home,
    applicationName: restaurant.name[locale],
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b161a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang;

  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before paint so reveal styles only apply when they can be undone. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <JsonLd data={restaurantJsonLd(locale)} />
      </head>
      <body>
        <I18nProvider locale={locale}>
          <CartProvider>
            <Navbar />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer locale={locale} />
            <CartDrawer />
            <ItemDialog />
            <CartToast />
            <MobileCartBar />
            <WhatsAppFloatingButton href={whatsappEnquiryHref(locale)} />
            <MotionProvider />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
