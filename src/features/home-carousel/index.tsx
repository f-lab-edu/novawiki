import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components";

export function HomeCarousel() {
  return (
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
      <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer" />
      <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
    </Carousel>
  );
}
