import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div>
        <div>
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
