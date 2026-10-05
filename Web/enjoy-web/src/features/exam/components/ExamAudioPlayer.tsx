import React, { useRef, useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';

interface AudioPlayerProps {
  src: string;
  label?: string;
  autoPlay?: boolean;
}

export const ExamAudioPlayer: React.FC<AudioPlayerProps> = ({ src, label, autoPlay = false }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setPlaying(false);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    if (autoPlay) { audio.play().catch(() => {}); setPlaying(true); }
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src, autoPlay]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().catch(() => {}); setPlaying(true); }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-border-main p-3 mb-6 shadow-sm">
      <audio ref={audioRef} src={src} preload="auto" />
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={toggle}
          className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/30 flex-shrink-0"
        >
          {playing ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5 ml-0.5" />}
        </button>

        {/* Label + Progress */}
        <div className="flex-1 min-w-0">
          {label && (
            <p className="text-xs text-text-muted font-medium mb-1 truncate flex items-center gap-1.5">
              <SpeakerWaveIcon className="w-3.5 h-3.5" />
              {label}
            </p>
          )}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={duration || 1}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 accent-primary cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--color-primary) ${progress}%, #e5e7eb ${progress}%)`
              }}
            />
            <span className="text-xs text-text-muted font-mono flex-shrink-0 min-w-[80px] text-right">
              {fmt(currentTime)} / {fmt(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
