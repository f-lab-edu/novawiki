import Link from "next/link";
import { parseHeads } from "@/lib/utils/common";

type DocumentIndexProps = {
  content: string;
};

export function DocumentIndex({ content }: DocumentIndexProps) {
  const indexList = parseHeads(content);

  return (
    <nav className="sm:w-50 shrink-0">
      <div className="sticky top-6 border rounded-lg p-4">
        <h3 className="font-semibold text-base mb-2!">목차</h3>
        <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
          {indexList.map((item, index) => (
            <li
              key={`${item.title}_${index}`}
              className={item.type === "sub" ? "pl-4" : ""}
            >
              <Link
                href={`#${item.title}`}
                className="hover:text-foreground transition-colors"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
