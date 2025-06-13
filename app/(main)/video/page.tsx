"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "@/components/ui/card";
import { useInfiniteVideos } from "@/hooks/use-infinite-videos";
import { VideoFilterCarousel } from "@/components/video-filter-carousel";

export default function VideoPage() {
  const [filter, setFilter] = useState("all");

  const source =
    filter === "local" || filter === "encrypted"
      ? "LOCAL"
      : filter === "bunkr" || filter === "direct"
      ? "REMOTE"
      : undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteVideos(source);

  const { ref, inView } = useInView({ threshold: 0 });

  // Auto-fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const videos = (data?.pages || []).flat();

  // filtre secondaire côté client (ex: bunkr, encrypted, direct)
  const filtered = videos.filter((video) => {
    if (filter === "encrypted")
      return video.source === "LOCAL" && video.encrypted;
    if (filter === "bunkr") return !!video.bunkrId;
    if (filter === "direct") return video.source === "REMOTE" && !video.bunkrId;
    return true;
  });

  return (
    <main className="p-6">
      <VideoFilterCarousel selected={filter} onSelect={setFilter} />
      {error && <p className="text-red-600">Erreur chargement</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filtered.map((video) => (
          <Link key={video.id} href={`/video/${video.id}`}>
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-medium">{video.title}</h2>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div ref={ref} className="h-12 flex items-center justify-center">
        {isFetchingNextPage && <p>Chargement...</p>}
        {!hasNextPage && (
          <p className="text-muted-foreground">Fin des résultats</p>
        )}
      </div>
    </main>
  );
}
