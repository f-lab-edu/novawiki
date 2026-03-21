"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { chatQueryOptions } from "@/entities";
import { createClient } from "@/lib/supabase/client";
import { ChatPanel } from "./ChatPanel";

type ChatButtonProps = {
  id: string;
  documentId: number;
};

export function ChatButton({ id, documentId }: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const isOpenRef = useRef(isOpen);
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`chat:document:${String(documentId)}`, {
        config: { broadcast: { self: true } },
      })
      .on("broadcast", { event: "message" }, () => {
        queryClient.invalidateQueries({
          queryKey: chatQueryOptions(documentId).queryKey,
        });
        if (!isOpenRef.current) {
          setUnreadCount((prev) => prev + 1);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [documentId, queryClient]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 채팅 패널 */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 h-120 rounded-xl border border-border shadow-2xl bg-background flex flex-col overflow-hidden animate-[slide-up_1s_ease-out_forwards]">
          <ChatPanel id={id} documentId={documentId} channelRef={channelRef} />
          <button
            type="button"
            onClick={handleClose}
            className="absolute cursor-pointer top-3 right-3 text-white/80 hover:text-white transition-colors"
            aria-label="채팅 닫기"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <title>채팅 아이콘</title>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        type="button"
        onClick={handleOpen}
        className="fixed cursor-pointer bottom-5 right-4 z-50 w-12 h-12 bg-gray-800 hover:bg-black text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="채팅 열기"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <title>채팅 아이콘</title>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </>
  );
}
