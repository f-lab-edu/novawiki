"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import type { DocumentType } from "@/entities";
import { homeQueryOptions } from "@/entities";
import { extractContentPreview, getRelativeTime } from "@/lib/utils/common";

type HomePopularCardProps = {
  index: number;
  doc: DocumentType;
};

function HomePopularTitle() {
  return <h2 className="text-xl font-bold mb-4!">오늘의 인기 문서</h2>;
}

function HomeCard({ index, doc }: HomePopularCardProps) {
  return (
    <Link
      href={`/d/${doc.title}`}
      className="flex items-start gap-5 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <span className="text-2xl font-bold text-muted-foreground/40 w-8 text-center shrink-0">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base">{doc.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 truncate">
          {extractContentPreview(doc.content)}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>{doc.profile?.nick}</span>
          <span>·</span>
          <span>{getRelativeTime(doc.updated_at)}</span>
        </div>
      </div>
    </Link>
  );
}

export function HomePopularList() {
  const { data } = useQuery(homeQueryOptions("popular"));

  if (!data) {
    return (
      <div className="col-span-1">
        <HomePopularTitle />
      </div>
    );
  }

  const { data: popularList } = data;

  return (
    <div className="col-span-2">
      <HomePopularTitle />
      <div className="flex flex-col gap-3">
        {popularList?.map((doc, i) => (
          <HomeCard key={`${i}${doc.title}pop`} index={i} doc={doc} />
        ))}
      </div>
    </div>
  );
}
