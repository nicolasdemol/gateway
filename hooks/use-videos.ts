import { Video } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type UseVideosParams = {
  userId?: number;
  page?: number;
  limit?: number;
  source?: "LOCAL" | "REMOTE";
};

export function useVideos(params: UseVideosParams = {}) {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.source) queryParams.set("source", params.source);

  const queryKey = ["videos", params];

  return useQuery<Video[]>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`/api/videos?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Erreur lors du chargement des vidéos");
      return res.json();
    },
  });
}
