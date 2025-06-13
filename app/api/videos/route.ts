import { NextRequest } from "next/server";
import { getVideos } from "@/utils/db";
import { auth } from "@/app/(auth)/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Non autorisé", { status: 401 });
  }

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const source = searchParams.get("source");

  try {
    const videos = await getVideos({
      userId: parseInt(session?.user?.id),
      page,
      limit,
      source: source as "LOCAL" | "REMOTE" | undefined,
    });

    return Response.json(videos);
  } catch {
    return new Response("Erreur lors du chargement des vidéos", {
      status: 500,
    });
  }
}
