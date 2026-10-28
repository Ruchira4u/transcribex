import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Pause, Play, RefreshCw, AlertCircle, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { createSampleAudioBlob, formatTime } from '../utils/audioHelpers';

interface MicRecorderProps {
  onRecordingComplete: (blob: Blob, durationSeconds: number) => void;
}

export const MicRecorder: React.FC<MicRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Start microphone recording
  const startRecording = async () => {
    try {
      setError(null);
      setIsSimulating(false);
      audioChunksRef.current = [];
      setDuration(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size > 0) {
          onRecordingComplete(audioBlob, duration);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      setupAudioVisualizer(stream);

    } catch (err: any) {
      console.error('Microphone error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('Permission denied')) {
        setError('Microphone access was denied or restricted by browser iframe security policies.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No microphone found on your device.');
      } else {
        setError(err.message || 'Could not access microphone.');
      }
    }
  };

  // Simulate a live mic recording if real hardware mic is blocked by iframe policy
  const simulateLiveRecording = async () => {
    setError(null);
    setIsSimulating(true);
    setIsRecording(true);
    setIsPaused(false);
    setDuration(0);

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    // Setup animated canvas visualizer using synthesized frequency data
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const drawSimulatedWave = () => {
        if (!ctx || !canvas) return;
        animFrameRef.current = requestAnimationFrame(drawSimulatedWave);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const bars = 32;
        const barWidth = (canvas.width / bars) * 1.5;

        for (let i = 0; i < bars; i++) {
          const height = Math.abs(Math.sin(Date.now() / 200 + i * 0.4)) * (canvas.height * 0.8);
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#00ffcc');
          gradient.addColorStop(1, '#a855f7');
          ctx.fillStyle = gradient;
          ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
        }
      };
      drawSimulatedWave();
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (isRecording) {
      if (isPaused) {
        if (mediaRecorderRef.current) mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
        }, 1000);
      } else {
        if (mediaRecorderRef.current) mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      cleanupVisualizer();

      if (isSimulating) {
        // Generate simulated voice audio blob for transcription
        const sample = await createSampleAudioBlob('multilingual');
        onRecordingComplete(sample.blob, duration || 4);
      } else if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    }
  };

  // Web Audio Visualizer canvas loop
  const setupAudioVisualizer = (stream: MediaStream) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!canvas) return;
        animFrameRef.current = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#00ffcc');
          gradient.addColorStop(1, '#a855f7');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

          x += barWidth;
        }
      };

      draw();
    } catch (e) {
      console.warn('Audio visualizer error:', e);
    }
  };

  const cleanupVisualizer = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cleanupVisualizer();
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-xl border border-cyan-500/20 glass-panel">
      {error ? (
        <div className="w-full p-5 rounded-xl bg-slate-950 border border-rose-500/40 text-rose-300 text-xs flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <span className="font-bold text-rose-200 text-sm block mb-1">
                Microphone Permission Denied
              </span>
              <span>{error}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-normal flex flex-col gap-1.5">
            <span className="font-semibold text-cyan-300">How to allow microphone in your browser:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Click the <strong className="text-white">lock 🔒 or icon</strong> next to the web address in your browser.</li>
              <li>Set <strong className="text-white">Microphone</strong> to <strong className="text-emerald-400">Allow</strong>.</li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <button
              onClick={startRecording}
              className="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-medium hover:border-cyan-400 text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Retry Real Mic</span>
            </button>

            <button
              onClick={simulateLiveRecording}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 hover:scale-[1.02] transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Live Voice Test</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-5 text-center">
          {/* Live Canvas Visualizer */}
          <div className="relative w-full max-w-md h-24 bg-slate-950/80 rounded-xl border border-cyan-500/30 overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} width={380} height={90} className="w-full h-full" />
            
            {!isRecording && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 text-slate-400 text-xs gap-1">
                <Mic className="w-6 h-6 text-cyan-400/60" />
                <span>Click "Start Recording" to use your microphone</span>
              </div>
            )}

            {isRecording && (
              <div className="absolute top-2 right-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
                <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-rose-500 animate-ping'}`} />
                <span>{isPaused ? 'PAUSED' : isSimulating ? 'SIMULATED REC' : 'LIVE REC'}</span>
                <span className="text-slate-400">·</span>
                <span className="font-bold text-white">{formatTime(duration)}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isRecording ? (
              <>
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:from-cyan-300 hover:to-blue-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Mic className="w-5 h-5" />
                  <span>Start Recording</span>
                </button>

                <button
                  onClick={simulateLiveRecording}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-purple-300 font-semibold text-xs hover:border-purple-500/50 hover:bg-purple-950/40 transition-colors"
                  title="Test voice recording without hardware microphone"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Simulate Voice Test</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={pauseRecording}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                >
                  {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>

                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Done & Transcribe</span>
                </button>
              </>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            Recorded audio stays directly in your browser session before secure transmission to Gemini.
          </p>
        </div>
      )}
    </div>
  );
};
