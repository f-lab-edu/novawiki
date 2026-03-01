import { defaultQueryKey, defaultQueryOptions } from "@/lib/utils/query";
import type { HistoryType } from "./types";

// History
export const historyQueryKey = (id: string) =>
  defaultQueryKey(["document", id, "history"]);

export const historyQueryOptions = (id: string) =>
  defaultQueryOptions<HistoryType[]>(
    historyQueryKey(id),
    `/api/document/history?id=${id}`,
  );
