import { auth } from "@/app/(auth)/auth";
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

  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-6 text-center">Non autorisé</div>;
  }

  if (!id || isNaN(Number(id))) {
    return <div className="p-6 text-center">ID de vidéo invalide</div>;
  }

  const video = await getVideoById(Number(id), Number(session.user.id));
  if (!video) {
    return (
      <div className="p-6 text-center">Vidéo introuvable ou accès interdit</div>
    );
  }

  if (!video) {
    return <div className="p-6 text-center">Vidéo introuvable</div>;
  }

  const isBunkr = !!video.bunkrId;

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
      <div className="mt-4 px-6 flex flex-col items-center">
        {video.encrypted ? (
          <EncryptedVideoPlayer src={videoSrc} />
        ) : isBunkr ? (
          <VideoPlayer src={`/api/videos/bunkr/${video.id}`} />
        ) : (
          <VideoPlayer src={videoSrc} />
        )}
      </div>
    </>
  );
}
