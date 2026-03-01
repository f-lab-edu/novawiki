import { create } from "zustand";

interface HistoryState {
  prev: number | null;
  next: number | null;
  setPrev: (prev: HistoryState["prev"]) => void;
  setNext: (next: HistoryState["next"]) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  prev: null,
  next: null,
  setPrev: (prev) => set({ prev }),
  setNext: (next) => set({ next }),
}));
