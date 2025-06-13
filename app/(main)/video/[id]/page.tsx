import { AppHeader } from "@/components/app-header";
import EncryptedVideoPlayer from "@/components/encrypted-video-player";
import { VideoDeleteButton } from "@/components/video-delete-button";
import VideoPlayer from "@/components/video-player";
import { getVideoById } from "@/utils/db";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return (
      <div className="p-6 text-center">ID de vidéo invalide</div>
    );
  }

  const video = await getVideoById(Number(id));

  if (!video) {
    return (
      <div className="p-6 text-center">Vidéo introuvable</div>
    );
  }

  const videoSrc =
    video.source === "LOCAL" ? `/api/videos/local/${video.id}` : video.url;

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "Vidéos", href: "/video" },
          { label: video.title },
        ]}
        actionsSlot={<VideoDeleteButton id={video.id} />}
      />
      <div className="p-6 flex flex-col items-center">
        {video.encrypted ? (
          <EncryptedVideoPlayer src={videoSrc} />
        ) : (
          <VideoPlayer src={videoSrc} />
        )}
      </div>
    </>
  );
}
