"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { decryptVideo } from "@/utils/encryption";
import { toast } from "@/components/toast";
import { Lock } from "lucide-react";
import VideoPlayer from "@/components/video-player"; // <- Ton composant avec Plyr

export default function EncryptedVideoPlayer({ src }: { src: string }) {
  const [password, setPassword] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDecrypt = async () => {
    setLoading(true);
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error("Téléchargement impossible");
      const encryptedBlob = await res.blob();

      const decryptedBlob = await decryptVideo(encryptedBlob, password);
      const url = URL.createObjectURL(decryptedBlob);
      setVideoUrl(url);
    } catch {
      toast({
        type: "error",
        description: "Mot de passe incorrect ou erreur de déchiffrement",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      {videoUrl ? (
        <VideoPlayer src={videoUrl} />
      ) : (
        <div className="w-full pt-12 max-w-md grid gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Lock className="size-5" />
            <h2 className="text-lg font-semibold">
              Contenu protégé par chiffrement
            </h2>
          </div>
          <Input
            placeholder="Mot de passe de la vidéo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={handleDecrypt}
            disabled={loading || !password}
          >
            {loading ? "Déchiffrement..." : "Déchiffrer"}
          </Button>
        </div>
      )}
    </div>
  );
}
