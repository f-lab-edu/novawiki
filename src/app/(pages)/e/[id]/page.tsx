import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { EditForm } from "@/features";
import { documentQueryOptions } from "@/lib/utils/query";

export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(documentQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditForm id={id} />
    </HydrationBoundary>
  );
}
