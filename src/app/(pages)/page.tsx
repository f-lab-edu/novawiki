'use client'

import { useUserStore } from "@/shared/lIb/store/useUserStore";

export default function Home() {
  const user = useUserStore(state => state.user);
  console.log(user)
  return (
    <div>
      메인 페이지
    </div>
  );
}
