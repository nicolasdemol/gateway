"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/toast";
import VideoPlayer from "@/components/video-player";

export default function RegisterTab() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const handleRegister = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/videos/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title }),
      });
      if (!res.ok) throw new Error();
      toast({ type: "success", description: "Vidéo enregistrée avec succès" });
      setUrl("");
      setTitle("");
    } catch {
      toast({ type: "error", description: "Erreur lors de l’enregistrement" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <TabsContent value="register" className="space-y-4 mt-4">
      <Label htmlFor="title">Titre</Label>
      <Input
        id="title"
        placeholder="Nom de la vidéo"
        value={title}
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
        onClick={handleRegister}
        disabled={saving || !url || !title}
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </TabsContent>
  );
}
