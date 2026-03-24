"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import Link from "next/link";
import { type RefObject, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/useUserStore";

type ChatInputProps = {
  documentId: number;
  isAuthenticated: boolean;
  channelRef: RefObject<RealtimeChannel | null>;
};

export function ChatInput({
  documentId,
  isAuthenticated,
  channelRef,
}: ChatInputProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUserStore();

  if (!isAuthenticated) {
    return (
      <div className="p-3 border-t border-border bg-muted/30 text-center">
        <p className="text-xs text-muted-foreground">
          채팅에 참여하려면&nbsp;
          <Link href="/login" className="underline">
            로그인
          </Link>
          이 필요합니다
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading || !user) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: message } = await supabase
        .from("chat_messages")
        .insert({
          document_id: documentId,
          profile_id: user.id,
          content: content.trim(),
        })
        .select("id")
        .single();

      if (message) {
        await channelRef.current?.send({
          type: "broadcast",
          event: "message",
          payload: { id: message.id },
        });
      }

      setContent("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-border bg-background flex gap-2 items-stretch"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요"
        rows={1}
        className="flex-1 resize-none text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black max-h-24"
      />
      <button
        type="submit"
        disabled={!content.trim() || isLoading}
        className="h-full aspect-square cursor-pointer bg-gray-800 hover:bg-black disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-colors shrink-0"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </form>
  );
}
