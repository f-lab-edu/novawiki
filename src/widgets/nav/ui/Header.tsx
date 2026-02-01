import Link from "next/link";

export function Header() {
  return (
    <header className="flex justify-center">
      <div className="flex justify-between w-full lg:w-[1200px] h-[60px]">
        <div className="flex items-center">
          <div>
            <Link href="/">NOVAWIKI</Link>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex">
            <input type="text" placeholder="검색어를 입력하세요." />
          </div>
          <div>
            <Link href="/login">로그인</Link>
            <Link href="/signup">회원가입</Link>
            <button type="button">로그아웃</button>
          </div>
        </div>
      </div>
    </header>
  );
}
