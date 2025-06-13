// components/video-card.tsx
"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Lock, Play, Vault } from "lucide-react";
import { Video } from "@prisma/client";

export function VideoCard({ video }: { video: Video }) {
  const isEncrypted = video.encrypted;
  const isLocal = video.source === "LOCAL" && !video.encrypted;
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
    <Link href={`/video/${video.id}`}>
      <Card className="hover:shadow-md transition overflow-hidden p-0 gap-0">
        <CardContent className="flex flex-col gap-1 py-4">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Icon className="size-4" />
            <span>{label}</span>
          </div>
          <h2 className="text-base font-semibold truncate">{video.title}</h2>
        </CardContent>
      </Card>
    </Link>
  );
}
