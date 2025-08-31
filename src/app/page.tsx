
import { useTRPC } from "@/trpc/client";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Client from "./client";
import { Suspense } from "react";

export default async function Home() {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.hello.queryOptions({ text: "dffffffff hello" }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Client />
      </Suspense>

    </HydrationBoundary>
  );
}
