// app/api/videos/download/route.ts
import { NextResponse } from "next/server";
import { createWriteStream } from "fs";
import { join } from "path";
import { pipeline } from "stream/promises";
import { createVideo } from "@/utils/db";
import { auth } from "@/app/(auth)/auth";
import type { ReadableStream as NodeReadableStream } from "stream/web";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, title } = await req.json();

  if (!url || !title) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const response = await fetch(url);
  if (!response.ok || !response.body) {
    return NextResponse.json(
      { error: "Téléchargement échoué" },
      { status: 400 }
    );
  }

  // Extraire le nom du fichier depuis l’URL
  const fileName =
    url.split("/").pop()?.split("?")[0] ?? `video-${Date.now()}.mp4`;
  const savePath = join(process.cwd(), "public", "videos", fileName);
  const fileStream = createWriteStream(savePath);

  const { Readable } = await import("stream");
  const nodeReadable = Readable.fromWeb(response.body as NodeReadableStream);

  await pipeline(nodeReadable, fileStream);
  await pipeline(nodeReadable, fileStream);

  await createVideo({
    title,
    url: `/videos/${fileName}`,
    userId: Number(session.user.id),
    source: "LOCAL",
  });

  return NextResponse.json({ success: true, fileName });
}
