import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex justify-center p-10 bg-white border-t">
      <div className="w-300 gap-1 flex flex-col">
        <div>
          <div className="flex gap-3">
            <Link href="/info">회사소개</Link>
            <Link href="/terms">이용약관</Link>
            <Link href="/personal">개인정보처리방침</Link>
            <Link href="/service">고객센터</Link>
          </div>
        </div>
        <div className="text-sm flex w-full">
          ⓒ 2026 NOVAWIKI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
