import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["ar", "en"];
const DEFAULT = "ar";
const COOKIE = "aldafwa-lang";

/** Picks a locale: saved choice, then the browser's preference, then Arabic. */
function pickLocale(req: NextRequest): string {
  const saved = req.cookies.get(COOKIE)?.value;
  if (saved && LOCALES.includes(saved)) return saved;
  const header = req.headers.get("accept-language") ?? "";
  const prefs = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  const hit = prefs.find((p) => LOCALES.includes(p.lang));
  return hit?.lang ?? DEFAULT;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;
  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip Next internals, metadata files and anything with a file extension.
  matcher: ["/((?!_next|api|sitemap.xml|robots.txt|icon|apple-icon|opengraph-image|.*\\..*).*)"],
};
