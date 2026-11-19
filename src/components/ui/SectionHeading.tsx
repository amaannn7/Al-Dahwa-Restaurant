type Props = {
  script: string;
  title: string;
  as?: "h1" | "h2";
  align?: "center" | "start";
  className?: string;
  children?: React.ReactNode;
};

export function SectionHeading({ script, title, as: Tag = "h2", align = "center", className = "", children }: Props) {
  const center = align === "center";
  return (
    <div className={`${center ? "text-center mx-auto" : "text-start"} max-w-2xl ${className}`} data-reveal>
      <p className="t-script text-[26px] sm:text-[30px]">{script}</p>
      <Tag className="t-title mt-2 text-[28px] sm:text-[40px]">{title}</Tag>
      {children ? <div className="mt-5 text-[16px] sm:text-[17px]">{children}</div> : null}
    </div>
  );
}
