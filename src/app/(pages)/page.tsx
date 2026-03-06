import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { homeQueryOptions } from "@/entities";
import { HomeView } from "@/features";

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(homeQueryOptions("popular")),
    queryClient.prefetchQuery(homeQueryOptions("recent")),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView />
    </HydrationBoundary>
  );
}
