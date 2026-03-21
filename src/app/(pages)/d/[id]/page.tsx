import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { documentQueryOptions, documentVersionQueryOptions } from "@/entities";
import { DocumentRecorder, DocumentView } from "@/features";

export default async function Document({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v?: string }>;
}) {
  const { id } = await params;
  const { v } = await searchParams;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    v !== undefined
      ? documentVersionQueryOptions(id, v)
      : documentQueryOptions(id),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {!v && <DocumentRecorder primaryTitle={id} />}
      <DocumentView id={id} v={v} />
    </HydrationBoundary>
  );
}
