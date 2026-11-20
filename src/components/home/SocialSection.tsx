import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";

/** "Follow Al-Dafwa": every account and link from the restaurant's Linktree. */
export function SocialSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="border-t border-line bg-ink-2 py-20 sm:py-24">
      <div className="container-x">
        <SectionHeading script={t.social.script} title={t.social.title}>
          <p>{t.social.text}</p>
        </SectionHeading>
        <SocialLinks locale={locale} variant="cards" className="mx-auto mt-12 max-w-6xl" />
      </div>
    </section>
  );
}
