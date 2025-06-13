import { NextRequest } from "next/server";
import { getVideoById } from "@/utils/db";
import { auth } from "@/app/(auth)/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id || isNaN(Number(id))) {
    return new Response("Missing or invalid ID", { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const video = await getVideoById(Number(id));
  if (!video || video.userId !== Number(session.user.id)) {
    return new Response("Forbidden", { status: 403 });
  }

  const range = req.headers.get("range");
  const ifRange = req.headers.get("if-range");

  const headers: Record<string, string> = {
    Referer: `https://bunkr.cr/f/${video.bunkrId}`,
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    Accept: "*/*",
    "Accept-Encoding": "identity;q=1, *;q=0",
  };

  if (range) headers["Range"] = range;
  if (ifRange) headers["If-Range"] = ifRange;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const bunkrRes = await fetch(video.url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!bunkrRes.ok || !bunkrRes.body) {
      console.error("Upstream error", bunkrRes.status, video.url);
      return new Response("Bunkr upstream failed", { status: 502 });
    }

    const allowedHeaders = [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
      "etag",
      "last-modified",
    ];

    const streamHeaders = new Headers();
    for (const [key, value] of bunkrRes.headers.entries()) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        streamHeaders.set(key, value);
      }
    }

    streamHeaders.set("Cache-Control", "no-store");

    return new Response(bunkrRes.body, {
      status: bunkrRes.status,
      headers: streamHeaders,
    });
  } catch (err) {
    clearTimeout(timeout);
    console.error("Proxy error:", err);
    return new Response("Proxy timeout or fetch failed", { status: 500 });
  }
}
