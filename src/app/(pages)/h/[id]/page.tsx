import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { historyQueryOptions } from "@/entities";
import { HistoryView } from "@/features";

export default async function History({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const title = decodeURI(id);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(historyQueryOptions(title));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HistoryView title={title} />
    </HydrationBoundary>
  );
}
