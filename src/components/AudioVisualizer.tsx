import React, { useRef, useEffect, useState } from 'react';
import { Activity, BarChart2, Radio } from 'lucide-react';

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

export type VisualizerMode = 'bars' | 'waveform' | 'radial';

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioElement,
  isPlaying
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [mode, setMode] = useState<VisualizerMode>('bars');

  useEffect(() => {
    if (!audioElement) return;

    // Initialize Web Audio API node only once per audioElement
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtxClass();
        audioCtxRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyserRef.current = analyser;

        // Cross-origin & element source setup
        audioElement.crossOrigin = 'anonymous';
        const source = audioCtx.createMediaElementSource(audioElement);
        sourceNodeRef.current = source;

        source.connect(analyser);
        analyser.connect(audioCtx.destination);
      }
    } catch (e) {
      console.warn('Web Audio API source setup notice:', e);
    }

    return () => {
      // Cleanup visualizer loop on unmount
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [audioElement]);

  useEffect(() => {
    // Resume AudioContext if suspended when play starts
    if (isPlaying && audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (!analyser || !isPlaying) {
        // Render idle resting wave when audio is paused
        ctx.fillStyle = 'rgba(0, 255, 204, 0.15)';
        const bars = 28;
        const barWidth = (width / bars) * 0.7;
        for (let i = 0; i < bars; i++) {
          const barHeight = Math.sin((i + Date.now() / 800) * 0.5) * 6 + 10;
          ctx.fillRect(i * (width / bars) + 4, height / 2 - barHeight / 2, barWidth, barHeight);
        }
        return;
      }

      if (mode === 'bars') {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 1.4;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.9;

          // Cyberpunk Cyan to Purple gradient
          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, '#00ffcc');
          gradient.addColorStop(0.6, '#38bdf8');
          gradient.addColorStop(1, '#a855f7');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight, barWidth - 3, barHeight);

          // Top glowing cap
          if (barHeight > 4) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, height - barHeight - 2, barWidth - 3, 2);
          }

          x += barWidth;
        }
      } else if (mode === 'waveform') {
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2.5;
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#00ffcc');
        gradient.addColorStop(0.5, '#38bdf8');
        gradient.addColorStop(1, '#a855f7');
        ctx.strokeStyle = gradient;

        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else if (mode === 'radial') {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.25;

        for (let i = 0; i < bufferLength; i++) {
          const value = dataArray[i];
          const barHeight = (value / 255) * radius * 1.2;
          const angle = (i / bufferLength) * Math.PI * 2;

          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius + barHeight);
          const y2 = centerY + Math.sin(angle) * (radius + barHeight);

          ctx.strokeStyle = i % 2 === 0 ? '#00ffcc' : '#a855f7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, mode, audioElement]);

  return (
    <div className="w-full bg-slate-950/90 rounded-xl border border-cyan-500/30 p-3 flex flex-col gap-2 relative overflow-hidden">
      {/* Visualizer Mode Controls Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-cyan-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>REAL-TIME AUDIO FREQUENCY SPECTROGRAM</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setMode('bars')}
            className={`p-1 rounded text-[10px] font-mono flex items-center gap-1 transition-colors ${
              mode === 'bars' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Frequency Bars"
          >
            <BarChart2 className="w-3 h-3" />
            <span className="hidden sm:inline">Bars</span>
          </button>

          <button
            onClick={() => setMode('waveform')}
            className={`p-1 rounded text-[10px] font-mono flex items-center gap-1 transition-colors ${
              mode === 'waveform' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Oscilloscope Waveform"
          >
            <Activity className="w-3 h-3" />
            <span className="hidden sm:inline">Wave</span>
          </button>

          <button
            onClick={() => setMode('radial')}
            className={`p-1 rounded text-[10px] font-mono flex items-center gap-1 transition-colors ${
              mode === 'radial' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Radial Pulse"
          >
            <Radio className="w-3 h-3" />
            <span className="hidden sm:inline">Pulse</span>
          </button>
        </div>
      </div>

      {/* HTML5 Canvas Visualizer Frame */}
      <div className="w-full h-20 bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center relative">
        <canvas ref={canvasRef} width={480} height={80} className="w-full h-full" />
      </div>
    </div>
  );
};
