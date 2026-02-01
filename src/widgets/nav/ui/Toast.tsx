"use client";

import { useToastStore } from "@/store/useToastStore";

const typeStyles: Record<string, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  warning: "bg-yellow-500 text-black",
};

export function Toast() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${
            typeStyles[toast.type]
          } min-w-64 rounded-lg px-4 py-3 text-white shadow-lg animate-[slideIn_0.3s_ease-out]`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 cursor-pointer text-lg leading-none opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
