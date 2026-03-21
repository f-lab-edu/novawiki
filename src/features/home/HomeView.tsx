import { HomeCarousel } from "./ui/HomeCarousel";
import { HomePopularList } from "./ui/HomePopularList";
import { HomeRecentList } from "./ui/HomeRecentList";

export function HomeView() {
  return (
    <div className="w-full max-w-300 px-4 xl:px-0 flex flex-col items-center gap-6 sm:gap-10">
      <div className="w-full">
        <HomeCarousel />
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* 오늘의 인기 문서 */}
        <HomePopularList />

        {/* 최근 수정 문서 */}
        <HomeRecentList />
      </div>
    </div>
  );
}
