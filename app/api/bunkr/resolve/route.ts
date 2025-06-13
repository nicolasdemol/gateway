import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    const res = await fetch("https://bunkr.cr/api/vs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `https://bunkr.cr/f/${slug}`,
        Origin: "https://bunkr.cr",
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
      },
      body: JSON.stringify({ slug }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Bunkr request failed" },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Bunkr proxy error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
