import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '../utils/audioHelpers';
import { AudioVisualizer } from './AudioVisualizer';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, [audioRef]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  return (
    <div className="w-full p-4.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 glass-panel flex flex-col gap-3 shadow-xl glow-box-cyan">
      <audio
        ref={(el) => {
          audioRef.current = el;
          if (el && !audioElement) setAudioElement(el);
        }}
        src={audioUrl}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Real-time Reactive Frequency Spectrogram Visualizer */}
      <AudioVisualizer audioElement={audioElement} isPlaying={isPlaying} />

      {/* Progress timeline bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-cyan-300 font-bold w-12 text-right">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 cyber-slider accent-cyan-400 cursor-pointer"
        />
        <span className="text-xs font-mono text-slate-400 w-12">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Play/Pause/Skip Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => skipSeconds(-5)}
            className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-all hover:scale-105"
            title="Skip 5s backward"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 flex items-center justify-center font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30 glow-box-cyan"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => skipSeconds(5)}
            className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-all hover:scale-105"
            title="Skip 5s forward"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Title / Filename */}
        <div className="hidden sm:block text-xs text-slate-200 font-mono font-semibold truncate max-w-xs text-center px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800">
          {title}
        </div>

        {/* Right: Speed & Volume */}
        <div className="flex items-center gap-3">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[0.75, 1, 1.25, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => changeSpeed(s)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  playbackSpeed === s
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleMute} className="text-slate-400 hover:text-cyan-400 transition-colors">
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 cyber-slider accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
