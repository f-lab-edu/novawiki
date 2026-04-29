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

// 인기문서 없는 경우 임시 mock 데이터
const mockData: DocumentType[] = [
  {
    title: "노바위키",
    content: `# 개요
      노바위키는 기존 위키의 느리고 단절된 소통 구조를 개선하기 위해 시작된 플랫폼입니다.`,
    id: 59,
    isBlock: false,
    isDisplay: true,
    updated_at: "2026-04-20 13:35:56.586922+00",
    created_at: "2026-03-01 06:11:12.462153+00",
    version: 0,
    view: 1,
    star: 1,
  },
  {
    title: "이원노",
    content: `# 개요
    웹 기반 서비스를 중심으로 활동하는 개발자. 프론트엔드와 백엔드를 모두 다루는 풀스택 개발을 지향하며, React·Next.js 등의 프론트엔드 기술과 Nest.js·Django 등의 백엔드 기술을 활용해 웹 애플리케이션을 개발한다. 단순한 기능 구현에 그치지 않고 라이브러리의 동작 원리나 구조를 분석하고 직접 커스터마이징하는 개발 스타일을 갖고 있다.`,
    id: 68,
    isBlock: false,
    isDisplay: true,
    updated_at: "2026-03-19 01:58:11.038816+00",
    created_at: "2026-03-18 08:26:45.683633+00",
    version: 0,
    view: 1,
    star: 1,
  },
  {
    title: "테스트",
    content: `# 제목
    테스트 문서입니다.`,
    id: 76,
    isBlock: false,
    isDisplay: true,
    updated_at: "2026-03-23 16:53:55.737632+00",
    created_at: "2026-03-23 02:59:45.162692+00",
    version: 0,
    view: 1,
    star: 1,
  },
  {
    title: "NMIXX",
    content: `# 개요
> "둘, 셋! 안녕하세요, NMIXX입니다!"
2022년 2월 22일에 데뷔한 JYP엔터테인먼트 소속 6인조 다국적 걸그룹.`,
    id: 70,
    isBlock: false,
    isDisplay: true,
    updated_at: "2026-03-20 08:21:35.685586+00",
    created_at: "2026-03-19 01:56:46.259729+00",
    version: 0,
    view: 1,
    star: 1,
  },
  {
    title: "Claude",
    content: `# 개요
    미국의 AI 개발 기업 Anthropic(앤트로픽)이 개발한 생성형 인공지능 LLM, 그리고 이를 기반으로 하는 동명의 대화형 인공지능 서비스를 모두 가리킨다.`,
    id: 74,
    isBlock: false,
    isDisplay: true,
    updated_at: "2026-03-21 01:27:56.044968+00",
    created_at: "2026-03-21 01:27:56.044968+00",
    version: 0,
    view: 1,
    star: 1,
  },
];

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

  let popularList: DocumentType[] | null;

  if (!data || !data?.data || data?.data?.length < 1) {
    popularList = mockData;
  } else {
    popularList = data.data;
  }

  // if (!data) {
  //   return (
  //     <div className="col-span-1">
  //       <HomeTitle title={TITLE} />
  //     </div>
  //   );
  // }

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
