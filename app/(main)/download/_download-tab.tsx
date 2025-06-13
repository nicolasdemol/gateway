"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/toast";
import { Progress } from "@/components/ui/progress";
import VideoPlayer from "@/components/video-player";

export default function DownloadTab() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    setProgress(0);
    try {
      const res = await fetch("/api/videos/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url, title: title }),
      });
      if (!res.ok) throw new Error();
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 100));
        setProgress(i);
      }
      toast({ type: "success", description: "Téléchargement terminé" });
    } catch {
      toast({
        type: "error",
        description: "Erreur pendant le téléchargement",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <TabsContent value="download" className="space-y-4 mt-4">
      <Label htmlFor="title">Titre</Label>
      <Input
        id="title"
        value={title}
        placeholder="Nom de la vidéo"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Label htmlFor="url">URL</Label>
      <Input
        id="url"
        placeholder="https://example.com/video.mp4"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {url && url.endsWith(".mp4") && <VideoPlayer src={url} />}

      <Button
        className="w-full"
        onClick={handleDownload}
        disabled={downloading || !url}
      >
        {downloading ? "Téléchargement..." : "Télécharger"}
      </Button>
      {downloading && <Progress value={progress} />}
    </TabsContent>
  );
}
