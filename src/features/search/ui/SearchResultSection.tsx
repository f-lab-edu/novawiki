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
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
