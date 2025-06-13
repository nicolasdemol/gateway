import { NextRequest, NextResponse } from "next/server";
import { deleteVideo, getVideoById } from "@/utils/db";
import { auth } from "@/app/(auth)/auth";
import { unlink } from "fs/promises";
import { join } from "path";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const videoId = Number(id);
  const video = await getVideoById(videoId);

  if (!video || video.userId !== Number(session.user.id)) {
    return NextResponse.json(
      { error: "Vidéo introuvable ou accès interdit" },
      { status: 403 }
    );
  }

  if (video.source === "LOCAL") {
    const filePath = join(process.cwd(), "public", video.url);
    try {
      await unlink(filePath);
    } catch {
      console.warn("Fichier déjà supprimé ou introuvable :", filePath);
    }
  }

  await deleteVideo(videoId);

  return NextResponse.json({ success: true });
}
