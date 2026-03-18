"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { homeQueryOptions } from "@/entities";
import { extractContentPreview, getRelativeTime } from "@/lib/utils/common";
import type { DocumentType } from "@/types";
import { HomeTitle } from "./HomeTitle";

type HomePopularCardProps = {
  index: number;
  doc: DocumentType;
};

const TITLE: string = "오늘의 인기 문서";

function HomeCard({ index, doc }: HomePopularCardProps) {
  return (
    <Link
      href={`/d/${doc.title}`}
      className="flex items-start gap-2 sm:gap-5 rounded-lg border p-3 sm:p-4 hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <span className="text-xl sm:text-2xl text-muted-foreground/40 w-8 text-center shrink-0">
        {index + 1}
      </span>
      <div className="flex flex-col min-w-0 gap-0.5">
        <div className="flex gap-2">
          <h3 className="font-medium text-base">{doc.title}</h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>·</span>
            <span>{getRelativeTime(doc.updated_at)}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1 truncate">
          {extractContentPreview(doc.content)}
        </p>
      </div>
    </Link>
  );
}

export function HomePopularList() {
  const { data } = useQuery(homeQueryOptions("popular"));

  if (!data) {
    return (
      <div className="col-span-1">
        <HomeTitle title={TITLE} />
      </div>
    );
  }

  const { data: popularList } = data;

  return (
    <div className="col-span-1 sm:col-span-2 flex flex-col">
      <HomeTitle title={TITLE} />
      <div className="flex flex-col gap-2 sm:gap-3 flex-1 justify-between">
        {popularList?.map((doc, i) => (
          <HomeCard key={`${i}${doc.title}pop`} index={i} doc={doc} />
        ))}
      </div>
    </div>
  );
}
