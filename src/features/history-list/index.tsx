"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components";
import { simpleMessageToast } from "@/lib/utils/common";

type HistoryItem = {
  version: number;
  date: string;
  user: string;
  action: string;
  comment: string;
};

type HistoryListProps = {
  documentId: string;
  documentTitle: string;
  history: HistoryItem[];
};

export function HistoryList({
  documentId,
  documentTitle,
  history,
}: HistoryListProps) {
  const router = useRouter();
  const [prevVersion, setPrevVersion] = useState<number | null>(null);
  const [nextVersion, setNextVersion] = useState<number | null>(null);

  const handleCompare = () => {
    if (prevVersion !== null && nextVersion !== null) {
      router.push(`/c/${documentId}?prev=${prevVersion}&next=${nextVersion}`);
      return;
    }
    simpleMessageToast("선택 오류", "비교할 버전을 선택해 주세요.");
  };

  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-6">
      {/* 상단 제목 및 버튼 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          &apos;{documentTitle}&apos;의 이력 결과
        </h1>
        <div className="flex items-center gap-2">
          <Link href={`/e/${documentId}`}>
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
        <div className="grid grid-cols-[60px_60px_60px_120px_120px_100px_1fr] gap-4 px-4 py-3 bg-muted/50 text-sm font-medium">
          <div className="text-center">이전</div>
          <div className="text-center">현재</div>
          <div className="text-center">버전</div>
          <div className="text-center">수정일시</div>
          <div className="text-center">사용자</div>
          <div className="text-center">작업내용</div>
          <div className="text-center">코멘트</div>
        </div>

        {/* 이력 목록 */}
        <div className="divide-y">
          {history.map((item) => (
            <div
              key={item.version}
              className="grid grid-cols-[60px_60px_60px_120px_120px_100px_1fr] gap-4 px-4 py-3 text-sm hover:bg-muted/30 transition-colors"
            >
              <div className="flex justify-center">
                <input
                  type="radio"
                  name="prevVersion"
                  checked={prevVersion === item.version}
                  onChange={() => setPrevVersion(item.version)}
                  className="size-4 cursor-pointer"
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="radio"
                  name="nextVersion"
                  checked={nextVersion === item.version}
                  onChange={() => setNextVersion(item.version)}
                  className="size-4 cursor-pointer"
                />
              </div>
              <div className="font-medium text-center">v{item.version}</div>
              <div className="text-muted-foreground text-center">
                {item.date}
              </div>
              <div className="text-center">{item.user}</div>
              <div className="text-muted-foreground text-center">
                {item.action}
              </div>
              <div className="text-muted-foreground text-center">
                {item.comment}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
