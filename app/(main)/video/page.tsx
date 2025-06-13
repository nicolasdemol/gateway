"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { useVideos } from "@/hooks/use-videos";
import { Lock, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { data: videos, isLoading, error } = useVideos();

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
      <main className="p-6">
        {isLoading && <p>Chargement...</p>}
        {error && (
          <p className="text-red-600">Erreur lors du chargement des vidéos</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos?.map((video) => (
            <Link key={video.id} href={`/video/${video.id}`}>
              <Card className="hover:shadow-md">
                <CardContent className="px-4 max-h-12 flex flex-col justify-center">
                  <span className="block text-sm text-muted-foreground">
                    {video.encrypted ? (
                      <span className="flex items-center gap-1">
                        <Lock className="size-4" />
                        {"Encrypted"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Play className="size-4" />
                        {"Video"}
                      </span>
                    )}
                  </span>
                  <h2 className="text-lg font-semibold truncate">
                    {video.title}
                  </h2>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
