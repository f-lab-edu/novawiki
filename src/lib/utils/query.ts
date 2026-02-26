import type { QueryKey } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import type { ApiResponse, DocumentType } from "@/entities";
import { fetcher } from "./fetcher";

export const defaultQueryKey = (key: QueryKey) => key;

export const defaultQueryOptions = <T>(key: QueryKey, path: string) =>
  queryOptions({
    queryKey: key,
    queryFn: (): Promise<ApiResponse<T>> => fetcher(path),
  });

// Document Version
export const documentVersionQueryKey = (id: string, version: string) =>
  defaultQueryKey(["document", id, version]);

export const documentVersionQueryOptions = (id: string, version: string) =>
  defaultQueryOptions<DocumentType>(
    documentVersionQueryKey(id, version),
    `/api/document/version?id=${id}&v=${version}`,
  );

// Document
export const docmentQueryKey = (id: string) =>
  defaultQueryKey(["document", id]);

export const documentQueryOptions = (id: string) =>
  defaultQueryOptions<DocumentType>(
    docmentQueryKey(id),
    `/api/document/doc?id=${id}`,
  );
