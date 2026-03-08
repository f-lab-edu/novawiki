"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components";
import { compareQueryOptions } from "@/entities";
import { CompareDiffer } from "./ui/CompareDiffer";
import { CompareVersionButton } from "./ui/CompareVersionButton";

type CompareViewProps = {
  id: string;
  prev: string;
  next: string;
};

export function CompareView({ id, prev, next }: CompareViewProps) {
  const { data: response } = useQuery(compareQueryOptions(id, prev, next));
  const data = response?.data;

  if (!data) {
    return <div>존재하지 않는 문서입니다.</div>;
  }

  const title = decodeURI(id);
  const prevData = data[0];
  const nextData = data[1];

  if (!prevData || !nextData) {
    return <div>비교할 버전 데이터가 부족합니다.</div>;
  }

  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">&apos;{title}&apos; 문서 비교</h1>
        <Link href={`/d/${title}`}>
          <Button className="cursor-pointer">최신 문서로</Button>
        </Link>
      </div>

      <CompareDiffer
        oldText={prevData.content}
        newText={nextData.content}
        oldVersion={`v${prevData.version}`}
        newVersion={`v${nextData.version}`}
      />

      <div className="flex gap-4">
        <div className="flex-1">
          <Link href={`/d/${id}?v=${prevData.version}`}>
            <CompareVersionButton version={prevData.version} />
          </Link>
        </div>
        <div className="flex-1">
          <Link href={`/d/${id}?v=${nextData.version}`}>
            <CompareVersionButton version={nextData.version} />
          </Link>
        </div>
      </div>
    </div>
  );
}
