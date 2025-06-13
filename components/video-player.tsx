"use client";

import { useEffect, useRef } from "react";
import "plyr/dist/plyr.css";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  type?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
}

export default function VideoPlayer({
  src,
  poster,
  type = "video/mp4",
  autoplay = false,
  muted = false,
  loop = false,
  className = "",
}: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const isIOS =
      typeof window !== "undefined" &&
      /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (!isIOS && ref.current) {
      import("plyr").then(({ default: Plyr }) => {
        new Plyr(ref.current!, {
          controls: [
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "fullscreen",
          ],
        });
      });
    }
  }, [src]);

  if (!src) return <p className="text-red-500">Aucune source vidéo fournie.</p>;

  return (
    <div
      className={`relative w-full h-full max-w-xl rounded-xl overflow-hidden shadow-lg border ${className}`}
    >
      <video
        ref={ref}
        className="w-full h-full"
        playsInline
        controls
        preload="metadata"
        poster={poster}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
      >
        <source src={src} type={type} />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
  );
}
