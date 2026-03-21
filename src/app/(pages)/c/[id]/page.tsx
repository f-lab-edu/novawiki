import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { compareQueryOptions } from "@/entities";
import { CompareView } from "@/features";
import { isNaNValue } from "@/lib/utils/common";

export default async function Compare({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ prev?: string; next?: string }>;
}) {
  const { id } = await params;
  const { prev, next } = await searchParams;

  // prev, next 숫자 변환 가능한지 확인
  const isNotNumber = isNaNValue(prev) || isNaNValue(next);

  if (!prev || !next || isNotNumber) {
    return <div>잘못된 접근 방법입니다.</div>;
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(compareQueryOptions(id, prev, next));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CompareView id={id} prev={prev} next={next} />
    </HydrationBoundary>
  );
}
