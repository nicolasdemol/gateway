"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/toast";
import { CloudUpload } from "lucide-react";
import { encryptVideo } from "@/utils/encryption";
import { useRouter } from "next/navigation";

export default function ImportTab() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/mp4": [".mp4"] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      toast({ type: "error", description: "Aucun fichier sélectionné" });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();

      if (password.trim() !== "") {
        const encryptedBlob = await encryptVideo(file, password);
        formData.append("file", new File([encryptedBlob], file.name));
        formData.append("encrypted", "true");
      } else {
        formData.append("file", file);
        formData.append("encrypted", "false");
      }

      formData.append("title", title);

      const res = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
      const result = await res.json();

      for (let i = 0; i <= 100; i += 20) {
        await new Promise((r) => setTimeout(r, 100));
        setProgress(i);
      }

      toast({ type: "success", description: "Importation réussie" });

      if (result?.id) {
        router.push(`/video/${result.id}`);
      } else {
        toast({ type: "error", description: "ID de la vidéo manquant" });
      }

      setFile(null);
      setPassword("");
    } catch (err) {
      console.error("[IMPORT ERROR]", err);
      toast({ type: "error", description: "Erreur pendant l'import" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <TabsContent value="import" className="space-y-4 mt-4">
      <div
        {...getRootProps()}
        className={`w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed p-6 rounded-xl transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-muted bg-muted/30"
        }`}
      >
        <input {...getInputProps()} />
        <CloudUpload className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {file
            ? `Fichier sélectionné : ${file.name}`
            : "Glissez-déposez une vidéo ici ou cliquez pour sélectionner"}
        </p>
      </div>
      <Label htmlFor="title">Titre</Label>
      <Input
        id="title"
        placeholder="Nom de la vidéo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoComplete="off"
      />
      <Label htmlFor="password-encryption">Mot de passe</Label>
      <Input
        id="password-encryption"
        value={password}
        placeholder="Mot de passe de chiffrement"
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="off"
      />
      <Button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="w-full"
      >
        {uploading ? "Importation en cours..." : "Importer"}
      </Button>
      {uploading && <Progress value={progress} />}
    </TabsContent>
  );
}
