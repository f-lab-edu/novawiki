"use client";

type SearchResultSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function SearchResultSection({
  children,
  title,
}: SearchResultSectionProps) {
  return (
    <section className="flex flex-col gap-2 sm:gap-4">
      <h2 className="text-base sm:text-xl font-semibold">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
