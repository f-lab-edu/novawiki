import { HomeCard, HomeCarousel, HomeRecentCard } from "@/features";

const mockPopular = [
  {
    title: "React",
    preview:
      "React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리로, Meta에서 개발하였다.",
    author: "wiki_master",
    time: "2시간 전",
  },
  {
    title: "Next.js",
    preview:
      "Next.js는 Vercel에서 만든 React 프레임워크로, 서버 사이드 렌더링과 정적 사이트 생성을 지원한다.",
    author: "dev_user",
    time: "3시간 전",
  },
  {
    title: "TypeScript",
    preview:
      "TypeScript는 JavaScript에 정적 타입 시스템을 추가한 프로그래밍 언어로, Microsoft에서 개발하였다.",
    author: "ts_lover",
    time: "5시간 전",
  },
  {
    title: "Supabase",
    preview:
      "Supabase는 오픈소스 Firebase 대안으로, PostgreSQL 기반의 백엔드 서비스를 제공한다.",
    author: "backend_dev",
    time: "6시간 전",
  },
];

const mockRecent = [
  { title: "아이폰", time: "10분 전" },
  { title: "챔피언스 리그", time: "25분 전" },
  { title: "토트넘 홋스퍼", time: "1시간 전" },
  { title: "RB 라이프치히", time: "2시간 전" },
  { title: "대한민국", time: "3시간 전" },
  { title: "인공지능", time: "4시간 전" },
  { title: "위키백과", time: "5시간 전" },
  { title: "서울특별시", time: "6시간 전" },
];

async function getPopDocs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/document/popular`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch popular docs");
  return res.json();
}

async function getRecentDocs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/document/recent`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch popular docs");
  return res.json();
}

export default async function Home() {

  const [popDocs, recentDocs] = await Promise.all([
    getPopDocs(),
    getRecentDocs(),
  ]);

  return (
    <div className="w-300 flex flex-col items-center gap-10">
      <div className="w-full">
        <HomeCarousel />
      </div>
      <div className="w-full grid grid-cols-3 gap-6">
        {/* 오늘의 인기 문서 */}
        <div className="col-span-2">
          <h2 className="text-xl font-bold mb-4!">오늘의 인기 문서</h2>
          <div className="flex flex-col gap-3">
            {popDocs.map((doc, i) => (
              <HomeCard key={`${i}${doc.title}pop`} index={i} doc={doc} />
            ))}
          </div>
        </div>

        {/* 최근 수정 문서 */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4!">최근 수정 문서</h2>
          <div className="rounded-lg border divide-y">
            {recentDocs.map((doc, i) => (
              <HomeRecentCard key={`${i}${doc.title}rec`} index={i} doc={doc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
