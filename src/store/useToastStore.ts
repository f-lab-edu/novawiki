import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  nextId: number;
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  nextId: 0,
  addToast: (message, type = "info") => {
    let id: number;
    set((state) => {
      id = state.nextId + 1;
      return { nextId: id, toasts: [...state.toasts, { id, message, type }] };
    });
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
