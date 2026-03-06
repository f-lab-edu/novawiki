import type { DocumentType } from "@/types";

export type SearchResponse = {
  docs: DocumentType[];
  total: number;
};
