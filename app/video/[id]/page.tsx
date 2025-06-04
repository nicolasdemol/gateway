import { AppHeader } from "@/components/app-header";
import VideoPlayer from "@/components/video-player";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <AppHeader
        breadcrumbs={[{ label: "Vidéos", href: "/video" }, { label: id }]}
      />
      <div className="p-6 flex flex-col items-center">
        <VideoPlayer id={id} />
      </div>
    </>
  );
}
