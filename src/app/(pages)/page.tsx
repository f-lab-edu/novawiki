import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/shadcn/carousel";

export default function Home() {
  return (
    <div className="w-[1200px] flex flex-col items-center">
      <div className="w-full">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem className="pl-0!">
              <div className="relative h-64 rounded-xl bg-linear-to-br from-slate-900 to-slate-700 flex items-center px-12 overflow-hidden">
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="180"
                    height="180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    <path d="M8 7h6" />
                    <path d="M8 11h8" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <p className="text-white/60 text-sm font-medium tracking-wider uppercase mb-2">
                    NovaWiki
                  </p>
                  <h2 className="text-white text-3xl font-bold mb-2">
                    지식의 바다에 오신 것을 환영합니다
                  </h2>
                  <p className="text-white/70 text-base">
                    누구나 참여하고, 함께 만들어가는 백과사전
                  </p>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="pl-0!">
              <div className="relative h-64 rounded-xl bg-linear-to-br from-blue-600 to-indigo-800 flex items-center px-12 overflow-hidden">
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="180"
                    height="180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <p className="text-white/60 text-sm font-medium tracking-wider uppercase mb-2">
                    Contribute
                  </p>
                  <h2 className="text-white text-3xl font-bold mb-2">
                    오늘의 문서를 작성해보세요
                  </h2>
                  <p className="text-white/70 text-base">
                    당신의 지식이 누군가에게 큰 도움이 됩니다
                  </p>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="pl-0!">
              <div className="relative h-64 rounded-xl bg-linear-to-br from-emerald-600 to-teal-800 flex items-center px-12 overflow-hidden">
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="180"
                    height="180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <p className="text-white/60 text-sm font-medium tracking-wider uppercase mb-2">
                    Community
                  </p>
                  <h2 className="text-white text-3xl font-bold mb-2">
                    함께 만드는 커뮤니티
                  </h2>
                  <p className="text-white/70 text-base">
                    토론하고, 수정하고, 더 나은 정보를 완성하세요
                  </p>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="pl-0!">
              <div className="relative h-64 rounded-xl bg-linear-to-br from-amber-500 to-orange-700 flex items-center px-12 overflow-hidden">
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="180"
                    height="180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <p className="text-white/60 text-sm font-medium tracking-wider uppercase mb-2">
                    Explore
                  </p>
                  <h2 className="text-white text-3xl font-bold mb-2">
                    궁금한 것을 검색해보세요
                  </h2>
                  <p className="text-white/70 text-base">
                    수천 개의 문서가 당신을 기다리고 있습니다
                  </p>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="pl-0!">
              <div className="relative h-64 rounded-xl bg-linear-to-br from-violet-600 to-purple-900 flex items-center px-12 overflow-hidden">
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="180"
                    height="180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v4" />
                    <path d="m6.34 6.34 2.83 2.83" />
                    <path d="M2 12h4" />
                    <path d="m17.66 6.34-2.83 2.83" />
                    <path d="M22 12h-4" />
                    <path d="M12 22v-4" />
                    <path d="m6.34 17.66 2.83-2.83" />
                    <path d="m17.66 17.66-2.83-2.83" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <p className="text-white/60 text-sm font-medium tracking-wider uppercase mb-2">
                    New
                  </p>
                  <h2 className="text-white text-3xl font-bold mb-2">
                    새로운 기능이 추가되었습니다
                  </h2>
                  <p className="text-white/70 text-base">
                    문서 비교, 편집 히스토리를 확인해보세요
                  </p>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
      <div className="w-full grid grid-cols-3 gap-6 mt-8">
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
