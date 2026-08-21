import { useEffect, useRef, useState } from 'react';

interface LessonVideoPlayerProps {
  src: string;
  poster?: string;
  initialTime?: number;
  onTimeUpdate?: (seconds: number) => void;
}

function formatTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;
  return `${minutes}:${String(remaining).padStart(2, '0')}`;
}

export function LessonVideoPlayer({
  src,
  poster,
  initialTime = 0,
  onTimeUpdate,
}: LessonVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, initialTime);
  }, [initialTime, src]);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value;
    setCurrentTime(value);
    onTimeUpdate?.(value);
  };

  const changeVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    setVolume(value);
  };

  return (
    <section className="overflow-hidden rounded-2xl border bg-black" aria-label="Lesson video player">
      <video
        ref={videoRef}
        className="aspect-video w-full bg-black object-contain"
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          setDuration(video.duration);
          video.currentTime = Math.min(Math.max(0, initialTime), video.duration || 0);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={(event) => {
          const time = event.currentTarget.currentTime;
          setCurrentTime(time);
          onTimeUpdate?.(time);
        }}
      />

      <div className="space-y-2 px-4 py-3 text-white">
        <input
          className="w-full accent-current"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || currentTime)}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Seek lesson video"
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlayback}
            className="rounded-md px-2 py-1 text-sm hover:bg-white/10"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <span className="min-w-24 text-xs tabular-nums text-white/80">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <label className="ml-auto flex items-center gap-2 text-xs text-white/80">
            <span className="sr-only">Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
              aria-label="Video volume"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
