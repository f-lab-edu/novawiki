"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components";
import { historyQueryOptions } from "@/entities";
import { getRelativeTime } from "@/lib/utils/common";

type HistoryTableBodyProps = {
  title: string;
  prev: number | null;
  next: number | null;
  setPrev: (version: number) => void;
  setNext: (version: number) => void;
};

export function HistoryTableBody({
  title,
  prev,
  next,
  setPrev,
  setNext,
}: HistoryTableBodyProps) {
  const { data: response } = useQuery(historyQueryOptions(title));
  const history = response?.data ?? [];

  return (
    // 이력 목록
    <div className="divide-y">
      {history.map((item) => (
        <div
          key={item.id}
          className="text-xs sm:text-sm grid grid-cols-[25px_25px_25px_50px_50px_30px_1fr_30px] sm:grid-cols-[60px_60px_60px_120px_120px_100px_1fr_80px] gap-4 px-3 sm:px-4 py-3 hover:bg-muted/30 transition-colors"
        >
          <div className="flex justify-center">
            <input
              type="radio"
              name="prevVersion"
              checked={prev === item.version}
              onChange={() => setPrev(item.version)}
              className="size-4 cursor-pointer"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="radio"
              name="nextVersion"
              checked={next === item.version}
              onChange={() => setNext(item.version)}
              className="size-4 cursor-pointer"
            />
          </div>
          <div className="font-medium text-center">v{item.version}</div>
          <div className="text-muted-foreground text-center">
            {getRelativeTime(item.created_at)}
          </div>
          <div className="text-center">{item.profile?.nick}</div>
          <div className="text-muted-foreground text-center">
            {/* {item.action} */}
          </div>
          <div className="text-muted-foreground text-center">
            {item.comment}
          </div>
          <div className="flex justify-center">
            <Link href={`/d/${title}?v=${item.version}`}>
              <Button size="xs" className="cursor-pointer">
                보기
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
