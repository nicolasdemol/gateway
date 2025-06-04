import fs from "fs";
import path from "path";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";

export default function Page() {
  const videos = fs
    .readdirSync(path.join(process.cwd(), "public", "videos"))
    .filter((f) => f.endsWith(".mp4"));

  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Vidéos", href: "/video" }]} />
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((name) => (
          <Link key={name} href={`/video/${name}`}>
            <Card className="hover:shadow-md">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold truncate">{name}</h2>
              </CardContent>
            </Card>
          </Link>
        ))}
      </main>
    </>
  );
}
