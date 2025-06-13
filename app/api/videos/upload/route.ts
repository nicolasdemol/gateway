// app/api/videos/upload/route.ts
import { writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { createVideo } from "@/utils/db";
import { auth } from "@/app/(auth)/auth"; // ou ton wrapper auth NextAuth

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const isEncrypted = formData.get("encrypted") === "true";
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Fichier invalide." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = join(process.cwd(), "public", "videos");
  const savePath = join(uploadDir, file.name);

  await writeFile(savePath, buffer);

  const video = await createVideo({
    title: title || file.name,
    url: `/videos/${file.name}`,
    userId: Number(session.user.id),
    source: "LOCAL",
    encrypted: isEncrypted,
  });

  return NextResponse.json(
    { success: true, id: video.id, title: video.title, url: video.url },
    { status: 201 }
  );
}
