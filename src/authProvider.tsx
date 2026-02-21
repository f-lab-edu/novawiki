"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/useUserStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser, setLoading } = useUserStore();

  useEffect(() => {
    const supabase = createClient();
    // 초기 세션 확인
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
        });
      }
      setLoading(false);
    };
    initSession();

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
        });
      } else {
        clearUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, clearUser, setLoading]);

  return <>{children}</>;
}
