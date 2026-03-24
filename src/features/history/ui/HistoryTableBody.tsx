"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { restoreDocument } from "@/app/actions/document";
import { Button } from "@/components";
import { historyQueryOptions } from "@/entities";
import { getRelativeTime, simpleMessageToast } from "@/lib/utils/common";
import { useUserStore } from "@/store/useUserStore";

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

  const router = useRouter();
  const { user } = useUserStore();

  const handleClickRestore = async (id: string, version: number) => {
    if (!user) {
      simpleMessageToast(
        "되돌리기 불가",
        "로그인한 유저만 실행할 수 있습니다.",
      );
      return;
    }

    if (!window.confirm(`'${version}' 해당 버전으로 문서를 되돌리시겠습니까?`))
      return;

    const { error } = await restoreDocument(id, version);
    if (error) {
      simpleMessageToast("되돌리기 실패", error);
      return;
    }

    router.push(`/d/${id}`);
  };

  return (
    // 이력 목록
    <div className="divide-y">
      {history.map((item) => (
        <div
          key={item.id}
          className="text-xs sm:text-sm grid grid-cols-[25px_25px_25px_50px_50px_1fr_30px_50px] sm:grid-cols-[60px_60px_60px_120px_120px_1fr_80px_120px] gap-4 px-3 sm:px-4 py-3 hover:bg-muted/30 transition-colors"
        >
          {/* 이전 */}
          <div className="flex justify-center w-6.25 sm:w-15">
            <input
              type="radio"
              name="prevVersion"
              checked={prev === item.version}
              onChange={() => setPrev(item.version)}
              className="size-4 cursor-pointer"
            />
          </div>
          {/* 다음 */}
          <div className="flex justify-center w-6.25 sm:w-15">
            <input
              type="radio"
              name="nextVersion"
              checked={next === item.version}
              onChange={() => setNext(item.version)}
              className="size-4 cursor-pointer"
            />
          </div>
          {/* 버전 */}
          <div className="font-medium text-center w-6.25 sm:w-15">
            v{item.version}
          </div>
          {/* 수정시간 */}
          <div className="text-muted-foreground text-center w-13 sm:w-30">
            {getRelativeTime(item.created_at)}
          </div>
          {/* 닉네임 */}
          <div className="text-center w-13 sm:w-30">{item.profile?.nick}</div>
          {/* 코멘트(작업내용) */}
          <div className="text-muted-foreground text-center min-w-30 max-w-30 sm:max-w-max sm:min-w-30">
            {item.comment}
          </div>
          {/* 보기 */}
          <div className="flex justify-center w-7.5 sm:w-20">
            <Link href={`/d/${title}?v=${item.version}`}>
              <Button size="xs" className="cursor-pointer">
                보기
              </Button>
            </Link>
          </div>
          {/* 되돌리기 */}
          <div className="flex justify-center w-13 sm:w-30">
            {item.comment === "되돌리기" || item.comment === "삭제" ? (
              <></>
            ) : (
              <Button
                size="xs"
                className="cursor-pointer"
                onClick={() => handleClickRestore(title, item.version)}
              >
                되돌리기
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
