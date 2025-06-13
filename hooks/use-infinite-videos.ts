// hooks/use-infinite-videos.ts
import { Video } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteVideos(source?: "LOCAL" | "REMOTE") {
  return useInfiniteQuery<Video[], Error>({
    queryKey: ["videos", source],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/videos?page=${pageParam}&limit=12${
          source ? `&source=${source}` : ""
        }`
      );
      if (!res.ok) throw new Error("Erreur chargement vidéos");
      return res.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < 12 ? undefined : allPages.length + 1,
  });
}
