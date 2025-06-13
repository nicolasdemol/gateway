import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { getVideoById } from "@/utils/db";
import { auth } from "@/app/(auth)/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const video = await getVideoById(Number(id));
  if (!video || video.userId !== Number(session.user.id)) {
    return new Response("Forbidden", { status: 403 });
  }

  const filePath = path.join(process.cwd(), "public", video?.url ?? "");
  if (!fs.existsSync(filePath))
    return new Response("Not found", { status: 404 });

  const stat = fs.statSync(filePath);
  const range = req.headers.get("range");

  if (!range) {
    return new Response(fs.readFileSync(filePath), {
      status: 200,
      headers: {
        "Content-Length": stat.size.toString(),
        "Content-Type": "video/mp4",
      },
    });
  }

  const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
  const start = parseInt(startStr ?? "0", 10);
  const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
  const chunkSize = end - start + 1;
  const nodeStream = fs.createReadStream(filePath, { start, end });

  // Convert Node.js ReadStream to a web ReadableStream
  const readableStream = new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => controller.enqueue(chunk));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err) => controller.error(err));
    },
    cancel() {
      nodeStream.destroy();
    },
  });

  return new Response(readableStream, {
    status: 206,
    headers: {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize.toString(),
      "Content-Type": "video/mp4",
    },
  });
}
