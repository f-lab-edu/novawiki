"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components";
import { simpleMessageToast } from "@/lib/utils/common";
import { HistoryTableBody } from "./ui/HistoryTableBody";
import { HistoryTableHead } from "./ui/HistoryTableHead";

type HistoryListProps = {
  title: string;
};

export function HistoryView({ title }: HistoryListProps) {
  const router = useRouter();
  const [prev, setPrev] = useState<number | null>(null);
  const [next, setNext] = useState<number | null>(null);

  const handleCompare = () => {
    if (prev !== null && next !== null) {
      router.push(`/c/${title}?prev=${prev}&next=${next}`);
      return;
    }
    simpleMessageToast("선택 오류", "비교할 버전을 선택해 주세요.");
  };

  return (
    <div className="px-4 sm:px-0 w-full max-w-300 mx-auto flex flex-col gap-4">
      {/* 상단 제목 및 버튼 */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">
          &apos;{title}&apos;의 이력 결과
        </h1>
        <div className="flex justify-end sm:items-center gap-2 mb-4! sm:mb-0!">
          <Link href={`/e/${title}`}>
            <Button variant="outline" className="cursor-pointer" size="sm">
              수정
            </Button>
          </Link>
          <Button size="sm" className="cursor-pointer" onClick={handleCompare}>
            비교
          </Button>
        </div>
      </div>

      {/* 이력 테이블 */}
      <div className="rounded-lg border overflow-x-auto">
        <div className="min-w-max">
          {/* 테이블 헤더 */}
          <HistoryTableHead />

          {/* 이력 목록 */}
          <HistoryTableBody
            title={title}
            prev={prev}
            next={next}
            setPrev={setPrev}
            setNext={setNext}
          />
        </div>
      </div>
    </div>
  );
}
