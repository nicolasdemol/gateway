"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/toast";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import VideoPlayer from "@/components/video-player";
import { decryptBunkrUrl } from "@/utils/encryption";

export default function RegisterTab() {
  const router = useRouter();
  const [source, setSource] = useState("direct"); // "direct" ou "bunkr"
  const [previewUrl, setPreviewUrl] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const handleRegister = async () => {
    setSaving(true);
    try {
      let finalUrl = url;
      let bunkrId = undefined;

      if (source === "bunkr") {
        const slug = url.trim().split("/").pop(); // extrait le slug
        const res = await fetch("/api/bunkr/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });

        if (!res.ok)
          throw new Error("Erreur lors de la récupération depuis Bunkr");

        const data = await res.json();
        if (!data.encrypted || !data.url || !data.timestamp) {
          throw new Error("Lien Bunkr invalide");
        }

        finalUrl = decryptBunkrUrl(data.url, data.timestamp);
        bunkrId = slug;
        setPreviewUrl(`/api/videos/bunkr/${data.id}`);
      }

      const saveRes = await fetch("/api/videos/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: finalUrl,
          title,
          ...(bunkrId && { bunkrId }),
        }),
      });

      if (!saveRes.ok) throw new Error();

      const newVideo = await saveRes.json();

      toast({ type: "success", description: "Vidéo enregistrée avec succès" });
      setUrl("");
      setTitle("");
      router.push(`/video/${newVideo.id}`);
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
      <div className="flex items-center space-x-2">
        <Input
          id="url"
          placeholder="https://ex.com/video.mp4"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-32" id="source">
            <SelectValue placeholder="Choisir une source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="direct">Direct</SelectItem>
            <SelectItem value="bunkr">Bunkr</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {previewUrl && <VideoPlayer src={previewUrl} />}

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
