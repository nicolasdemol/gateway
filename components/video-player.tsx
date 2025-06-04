"use client";

import { useEffect, useRef } from "react";
import "plyr/dist/plyr.css";

export default function VideoPlayerClient({ id }: { id: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    import("plyr").then((module) => {
      const Plyr = module.default;
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
  }, []);

  return (
    <div className="relative w-full max-w-3xl rounded-xl overflow-hidden shadow-lg border">
      <video
        ref={ref}
        className="w-full h-full"
        playsInline
        controls
        preload="metadata"
      >
        <source src={`/api/video/${id}`} type="video/mp4" />
      </video>
    </div>
  );
}
