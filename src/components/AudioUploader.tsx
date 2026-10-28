import React, { useState, useRef } from 'react';
import { Upload, Mic, Disc, Music, FileAudio, Trash2, Play, Pause, Sparkles } from 'lucide-react';
import { MicRecorder } from './MicRecorder';
import { createSampleAudioBlob, formatFileSize, formatTime } from '../utils/audioHelpers';
import { useLanguage } from '../context/LanguageContext';

interface AudioUploaderProps {
  activeFile: { blob: Blob; name: string; size: number; duration?: number; url: string } | null;
  onAudioSelect: (audioData: { blob: Blob; name: string; size: number; duration?: number; url: string }) => void;
  onClearAudio: () => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  activeFile,
  onAudioSelect,
  onClearAudio
}) => {
  const { t } = useLanguage();
  const [inputTab, setInputTab] = useState<'upload' | 'mic' | 'sample'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const audioObj = new Audio(url);

    audioObj.onloadedmetadata = () => {
      onAudioSelect({
        blob: file,
        name: file.name,
        size: file.size,
        duration: audioObj.duration || 0,
        url
      });
    };

    audioObj.onerror = () => {
      onAudioSelect({
        blob: file,
        name: file.name,
        size: file.size,
        duration: 0,
        url
      });
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      processSelectedFile(file);
    }
  };

  const handleMicComplete = (blob: Blob, durationSeconds: number) => {
    const fileName = `Voice_Recording_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '_')}.webm`;
    const url = URL.createObjectURL(blob);
    onAudioSelect({
      blob,
      name: fileName,
      size: blob.size,
      duration: durationSeconds,
      url
    });
  };

  const loadSample = async (type: 'multilingual' | 'speech' | 'meeting') => {
    setLoadingSample(true);
    try {
      const sample = await createSampleAudioBlob(type);
      onAudioSelect({
        blob: sample.blob,
        name: sample.name,
        size: sample.blob.size,
        duration: 4,
        url: sample.url
      });
    } catch (err) {
      console.error('Failed to create sample audio:', err);
    } finally {
      setLoadingSample(false);
    }
  };

  const togglePreviewPlay = () => {
    if (!audioPreviewRef.current || !activeFile) return;
    if (isPreviewPlaying) {
      audioPreviewRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      audioPreviewRef.current.play();
      setIsPreviewPlaying(true);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Source Selection Segmented Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-cyan-500/20 max-w-xl mx-auto w-full">
        <button
          onClick={() => setInputTab('upload')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
            inputTab === 'upload'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="truncate">{t('browseFiles', 'Browse File')}</span>
        </button>

        <button
          onClick={() => setInputTab('mic')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
            inputTab === 'mic'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Mic className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="truncate">{t('startRecording', 'Record Mic')}</span>
        </button>

        <button
          onClick={() => setInputTab('sample')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
            inputTab === 'sample'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Disc className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="truncate">{t('trySampleAudio', 'Try Samples')}</span>
        </button>
      </div>

      {/* Active Selected Audio Preview Card (if file is loaded) */}
      {activeFile ? (
        <div className="w-full p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 glass-panel flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-cyan-500/10">
          <audio
            ref={audioPreviewRef}
            src={activeFile.url}
            onEnded={() => setIsPreviewPlaying(false)}
            className="hidden"
          />

          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={togglePreviewPlay}
              className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center transition-transform hover:scale-105 shrink-0"
              title={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
            >
              {isPreviewPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-cyan-400 shrink-0" />
                <h3 className="text-sm font-semibold text-white truncate max-w-[280px]">
                  {activeFile.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                <span>{formatFileSize(activeFile.size)}</span>
                <span>·</span>
                <span>{formatTime(activeFile.duration || 0)}</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 text-[10px]">
                  READY
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
            >
              {t('browseFiles', 'Change File')}
            </button>
            <button
              onClick={onClearAudio}
              className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-colors"
              title={t('removeFile', 'Remove file')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Tab Body Content when no file is selected */
        <div className="w-full">
          {inputTab === 'upload' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full p-8 md:p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center glass-panel ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-xl shadow-cyan-500/20 scale-[1.01]'
                  : 'border-slate-700 hover:border-cyan-500/50 hover:bg-slate-900/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.webm,.opus"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                {t('uploaderTitle', 'Drag & Drop any Audio File')}
              </h3>
              <p className="text-xs text-slate-400 max-w-lg mb-4 leading-relaxed">
                {t('uploaderSubtitle', 'Supports MP3, WAV, M4A, FLAC, OGG, AAC (Max 100MB)')}
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold text-xs hover:bg-cyan-500/20 transition-colors">
                <span>{t('browseFiles', 'Browse Audio Files')}</span>
              </div>
            </div>
          )}

          {inputTab === 'mic' && (
            <MicRecorder onRecordingComplete={(blob, duration) => handleMicComplete(blob, duration)} />
          )}

          {inputTab === 'sample' && (
            <div className="p-6 rounded-2xl border border-cyan-500/20 bg-slate-900/60 glass-panel flex flex-col gap-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase">
                <Sparkles className="w-4 h-4" />
                <span>{t('trySampleAudio', 'Try Demo Sample Audio')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => loadSample('multilingual')}
                  disabled={loadingSample}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400/50 hover:bg-slate-900 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                      {t('sampleSinhalaEnglish', 'Sinhala + English Demo')}
                    </span>
                    <Music className="w-4 h-4 text-cyan-400/60" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Multilingual audio sample
                  </p>
                </button>

                <button
                  onClick={() => loadSample('meeting')}
                  disabled={loadingSample}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400/50 hover:bg-slate-900 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                      {t('sampleMeeting', 'Team Sync Meeting Demo')}
                    </span>
                    <Music className="w-4 h-4 text-cyan-400/60" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Multi-speaker meeting sample
                  </p>
                </button>

                <button
                  onClick={() => loadSample('speech')}
                  disabled={loadingSample}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-400/50 hover:bg-slate-900 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                      Keynote Speech
                    </span>
                    <Music className="w-4 h-4 text-cyan-400/60" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Clear single-speaker speech
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
