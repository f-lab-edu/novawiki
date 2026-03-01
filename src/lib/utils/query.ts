import type { QueryKey } from "@tanstack/react-query";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { ApiResponse } from "@/entities";
import { fetcher } from "./fetcher";

export const defaultQueryKey = (key: QueryKey) => key;

export const defaultQueryOptions = <T>(key: QueryKey, path: string) =>
  queryOptions({
    queryKey: key,
    queryFn: (): Promise<ApiResponse<T>> => fetcher(path, 0),
  });

export const defaultInfiniteQueryKey = (key: QueryKey) => key;

export const defaultInfiniteQueryOptions = <T>(key: QueryKey, path: string) =>
  infiniteQueryOptions({
    queryKey: key,
    queryFn: (): Promise<ApiResponse<T>> => fetcher(path, 0),
    initialPageParam: 0,
    getNextPageParam: () => undefined,
  });
