import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-[1200px] flex flex-col items-center ms-auto">
      <div className="">
        <div className="flex gap-3">
          <Link href="/info">회사소개</Link>
          <Link href="/terms">이용약관</Link>
          <Link href="/personal">개인정보처리방침</Link>
          <Link href="/service">고객센터</Link>
        </div>
      </div>
      <div>ⓒ 2025 NOVAWIKI. All rights reserved.</div>
    </footer>
  );
}
