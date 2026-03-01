import type { HistoryType } from "@/entities";
import { defaultQueryKey, defaultQueryOptions } from "@/lib/utils/query";

// Compare
export const compareQueryKey = (id: string, prev: string, next: string) =>
  defaultQueryKey(["document", id, "compare", prev, next]);

export const compareQueryOptions = (id: string, prev: string, next: string) =>
  defaultQueryOptions<HistoryType[]>(
    compareQueryKey(id, prev, next),
    `/api/document/compare?prev=${prev}&next=${next}&id=${id}`,
  );
