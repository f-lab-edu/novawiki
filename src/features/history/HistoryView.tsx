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
    <div className="w-full max-w-300 mx-auto flex flex-col gap-6">
      {/* 상단 제목 및 버튼 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">&apos;{title}&apos;의 이력 결과</h1>
        <div className="flex items-center gap-2">
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
      <div className="rounded-lg border overflow-hidden">
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
  );
}
