"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { documentQueryOptions, documentVersionQueryOptions } from "@/entities";
import { WikiViewer } from "@/features";
import { parseHeads } from "@/lib/utils/common";
import { DocumentHead } from "./ui/DocumentHead";
import { DocumentVersionBanner } from "./ui/DocumentVersionBanner";

type DocumentViewProps = {
  id: string;
  v?: string;
};

export function DocumentView({ id, v }: DocumentViewProps) {
  const isOld = !!v;

  const { data: response } = useQuery(
    isOld ? documentVersionQueryOptions(id, v) : documentQueryOptions(id),
  );

  const data = response?.data;

  if (!data) {
    return (
      <div>
        {isOld
          ? "존재하지 않는 문서이거나, 존재하지 않는 버전입니다."
          : "존재하지 않는 문서입니다."}
      </div>
    );
  }

  const indexList = parseHeads(data.content);

  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-6 relative">
      {isOld && <DocumentVersionBanner doc={data} id={id} />}

      <DocumentHead doc={data} isOld={isOld} />

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <WikiViewer content={data.content} />
        </div>

        <nav className="w-50 shrink-0 absolute -right-60">
          <div className="sticky top-6 rounded-lg border p-4">
            <h3 className="font-semibold mb-3">목차</h3>
            <ol className="flex flex-col gap-2 text-sm text-muted-foreground">
              {indexList.map((item, index) => (
                <li key={item.title}>
                  <Link
                    href={`#${item.title}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {index + 1}. {item.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      </div>
    </div>
  );
}
