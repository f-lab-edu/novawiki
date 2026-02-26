import type { DocumentType } from "@/entities";
import { defaultQueryKey, defaultQueryOptions } from "@/lib/utils/query";

type HomeQueryType = "popular" | "recent";

const homeQueryKey = (type: HomeQueryType) =>
  defaultQueryKey(["home", "document", type]);

export const homeQueryOptions = (type: HomeQueryType) =>
  defaultQueryOptions<DocumentType[]>(
    homeQueryKey(type),
    `/api/document/${type}`,
  );
