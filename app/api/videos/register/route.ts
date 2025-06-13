import { NextResponse } from "next/server";
import { createVideo } from "@/utils/db";
import { auth } from "@/app/(auth)/auth"; // ou méthode perso si tu gères l'user différemment

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, title } = await req.json();

    if (!url || !title) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const video = await createVideo({
      title,
      url,
      userId: Number(session.user.id),
      source: "REMOTE",
    });

    return NextResponse.json(video, { status: 201 });
  } catch (err) {
    console.error("Register video error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
