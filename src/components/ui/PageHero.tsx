import Image, { type StaticImageData } from "next/image";

/** Shorter photo banner for inner pages, same language as the home hero. */
export function PageHero({ image, script, title, text }: { image: StaticImageData; script: string; title: string; text?: string }) {
  return (
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden pb-14 pt-[calc(var(--header-h)+48px)] sm:min-h-[480px] sm:items-center sm:pb-0">
      <Image src={image} alt="" fill preload sizes="100vw" quality={85} placeholder="blur" className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/50" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink to-transparent" />
      <div className="container-x text-center">
        <p className="t-script on-photo text-[28px] sm:text-[34px]">{script}</p>
        <h1 className="t-title on-photo mt-2 text-[34px] sm:text-[52px]">{title}</h1>
        {text ? <p className="on-photo mx-auto mt-5 max-w-xl text-[16px] text-bone/90 sm:text-[17px]">{text}</p> : null}
      </div>
    </section>
  );
}
