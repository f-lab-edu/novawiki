"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getRelativeTime } from "@/lib/utils/common";
import { homeQueryOptions } from "../model/query";
import { HomeTitle } from "./HomeTitle";

type HomeRecentCardProps = {
  index: number;
  doc: {
    title: string;
    updated_at: string;
  };
};

const TITLE: string = "최근 수정 문서";

// 문서 카드
function HomeRecentCard({ index, doc }: HomeRecentCardProps) {
  return (
    <Link
      href={`/d/${doc.title}`}
      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground w-5 text-center">
          {index + 1}
        </span>
        <span className="text-sm font-medium">{doc.title}</span>
      </div>
      <span className="text-xs text-muted-foreground">
        {getRelativeTime(doc.updated_at)}
      </span>
    </Link>
  );
}

export function HomeRecentList() {
  const { data } = useQuery(homeQueryOptions("recent"));

  if (!data) {
    return (
      <div className="col-span-1">
        <HomeTitle title={TITLE} />
      </div>
    );
  }

  const { data: recentList } = data;

  return (
    <div className="col-span-1">
      <HomeTitle title={TITLE} />
      <div className="rounded-lg border divide-y">
        {recentList?.map((doc, i) => (
          <HomeRecentCard key={`${i}${doc.title}rec`} index={i} doc={doc} />
        ))}
      </div>
    </div>
  );
}
