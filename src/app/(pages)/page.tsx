import { HomeCarousel } from "@/features";

export default function Home() {
  return (
    <div className="w-[1200px] flex flex-col items-center gap-10">
      <div className="w-full">
        <HomeCarousel />
      </div>
      <div className="w-full grid grid-cols-3 gap-6">
        {/* 오늘의 인기 문서 */}
        <div className="col-span-2">
          <h2 className="text-lg font-bold mb-4">오늘의 인기 문서</h2>
          <div className="flex flex-col gap-3">
            {[
              { title: "React", preview: "React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리로, Meta에서 개발하였다.", author: "wiki_master", time: "2시간 전" },
              { title: "Next.js", preview: "Next.js는 Vercel에서 만든 React 프레임워크로, 서버 사이드 렌더링과 정적 사이트 생성을 지원한다.", author: "dev_user", time: "3시간 전" },
              { title: "TypeScript", preview: "TypeScript는 JavaScript에 정적 타입 시스템을 추가한 프로그래밍 언어로, Microsoft에서 개발하였다.", author: "ts_lover", time: "5시간 전" },
              { title: "Supabase", preview: "Supabase는 오픈소스 Firebase 대안으로, PostgreSQL 기반의 백엔드 서비스를 제공한다.", author: "backend_dev", time: "6시간 전" },
            ].map((doc, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <span className="text-2xl font-bold text-muted-foreground/40 w-8 text-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {doc.preview}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{doc.author}</span>
                    <span>·</span>
                    <span>{doc.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 수정 문서 */}
        <div className="col-span-1">
          <h2 className="text-lg font-bold mb-4">최근 수정 문서</h2>
          <div className="rounded-lg border divide-y">
            {[
              { title: "아이폰", time: "10분 전" },
              { title: "챔피언스 리그", time: "25분 전" },
              { title: "토트넘 홋스퍼", time: "1시간 전" },
              { title: "RB 라이프치히", time: "2시간 전" },
              { title: "대한민국", time: "3시간 전" },
              { title: "인공지능", time: "4시간 전" },
              { title: "위키백과", time: "5시간 전" },
              { title: "서울특별시", time: "6시간 전" },
            ].map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-5 text-center">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{doc.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{doc.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
