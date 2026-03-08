import { defaultQueryKey, defaultQueryOptions } from "@/lib/utils/query";
import type { DocumentType } from "./types";

type HomeQueryType = "popular" | "recent";

// Home Document
const homeQueryKey = (type: HomeQueryType) =>
  defaultQueryKey(["home", "document", type]);

export const homeQueryOptions = (type: HomeQueryType) =>
  defaultQueryOptions<DocumentType[]>(
    homeQueryKey(type),
    `/api/document/${type}`,
  );

// Document
export const documentQueryKey = (id: string) =>
  defaultQueryKey(["document", id]);

export const documentQueryOptions = (id: string) =>
  defaultQueryOptions<DocumentType>(
    documentQueryKey(id),
    `/api/document/doc?id=${id}`,
  );

// Document Version
export const documentVersionQueryKey = (id: string, version: string) =>
  defaultQueryKey(["document", id, version]);

export const documentVersionQueryOptions = (id: string, version: string) =>
  defaultQueryOptions<DocumentType>(
    documentVersionQueryKey(id, version),
    `/api/document/version?id=${id}&v=${version}`,
  );
