import Image from "next/image";
import logoMark from "@/assets/brand/logo-mark.png";
import type { Locale } from "@/i18n/config";

/**
 * The official Al-Dafwa logo (supplied by the client; upscaled 4x with
 * Upscayl's digital-art model and given a transparent background so it sits
 * on the dark site). The tagline is rendered as text where it is shown, since
 * it is too small to read inside the image at header size.
 */
export function Logo({
  locale,
  className = "",
  size = "header",
  priority = false,
}: {
  locale: Locale;
  className?: string;
  size?: "header" | "footer";
  priority?: boolean;
}) {
  const alt = locale === "ar" ? "مطاعم الدفواء" : "Al-Dafwa Restaurant";
  const sizing =
    size === "header"
      ? "h-[40px] min-[380px]:h-[46px] sm:h-[52px]"
      : "h-[64px] sm:h-[72px]";
  return (
    <Image
      src={logoMark}
      alt={alt}
      preload={priority}
      sizes={size === "header" ? "170px" : "230px"}
      quality={90}
      className={`w-auto ${sizing} ${className}`}
    />
  );
}

export const TAGLINE = {
  ar: "عراقة الطعم الأصيل منذ 1990",
  en: "The heritage of authentic taste since 1990",
} as const;
