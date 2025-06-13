"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/toast";
import { useRouter } from "next/navigation";
import { decryptBunkrUrl } from "@/utils/encryption";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function RegisterTab() {
  const router = useRouter();
  const [source, setSource] = useState<"direct" | "bunkr">("bunkr");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const handleRegister = async () => {
    setSaving(true);
    try {
      let finalUrl = url;
      let bunkrId = undefined;

      if (source === "bunkr") {
        const slug = url.trim().split("/").pop();
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
      <ToggleGroup
        type="single"
        value={source}
        onValueChange={(val) => val && setSource(val as "direct" | "bunkr")}
        className="flex gap-2 w-full"
      >
        <ToggleGroupItem value="bunkr" aria-label="Source Bunkr">
          Bunkr
        </ToggleGroupItem>
        <ToggleGroupItem value="direct" aria-label="Source directe">
          Direct
        </ToggleGroupItem>
      </ToggleGroup>
      <Input
        id="url"
        placeholder="https://ex.com/video.mp4"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

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
