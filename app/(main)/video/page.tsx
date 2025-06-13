"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { useVideos } from "@/hooks/use-videos";
import { Globe, Lock, Play, Plus, Vault } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoFilterCarousel } from "@/components/video-filter-carousel";

export default function Page() {
  const { data: videos, isLoading, error } = useVideos();
  const [filter, setFilter] = useState("all");

  const filtered =
    videos?.filter((video) => {
      if (filter === "local")
        return video.source === "LOCAL" && !video.encrypted;
      if (filter === "encrypted")
        return video.source === "LOCAL" && video.encrypted;
      if (filter === "direct")
        return video.source === "REMOTE" && !video.bunkrId;
      if (filter === "bunkr") return video.bunkrId != null;
      return true; // "all"
    }) ?? [];

  return (
    <>
      <AppHeader
        breadcrumbs={[{ label: "Vidéos", href: "/video" }]}
        actionsSlot={
          <Link href="/download">
            <Button size="icon">
              <Plus className="size-5" />
            </Button>
          </Link>
        }
      />
      <main className="mt-4 px-6">
        <VideoFilterCarousel selected={filter} onSelect={setFilter} />

        {isLoading && <p>Chargement...</p>}
        {error && <p className="text-red-600">Erreur de chargement</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filtered.map((video) => {
            const isEncrypted = video.encrypted;
            const isLocal = video.source === "LOCAL";
            const isBunkr = !!video.bunkrId;
            const isDirect = video.source === "REMOTE" && !isBunkr;

            let label = "";
            let Icon = Play;

            if (isEncrypted) {
              label = "Encryptée";
              Icon = Lock;
            } else if (isLocal) {
              label = "Locale";
              Icon = Play;
            } else if (isBunkr) {
              label = "Bunkr";
              Icon = Vault;
            } else if (isDirect) {
              label = "Web";
              Icon = Globe;
            }

            return (
              <Link key={video.id} href={`/video/${video.id}`}>
                <Card className="hover:shadow-md transition">
                  <CardContent className="px-4 py-3 flex flex-col gap-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icon className="size-4" />
                      <span>{label}</span>
                    </div>
                    <h2 className="text-base font-semibold truncate">
                      {video.title}
                    </h2>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
