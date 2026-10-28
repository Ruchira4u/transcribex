import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AudioUploader } from './components/AudioUploader';
import { TranscriptionOptions, TaskMode } from './components/TranscriptionOptions';
import { AudioPlayer } from './components/AudioPlayer';
import { TranscriptViewer } from './components/TranscriptViewer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ApiConfigModal } from './components/ApiConfigModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import {
  fileToBase64,
  getSavedTranscriptions,
  saveTranscription,
  downloadTranscription,
  SavedTranscription
} from './utils/audioHelpers';
import { LanguageSelector } from './components/LanguageSelector';
import { EngineBadge } from './components/EngineBadge';
import { AlertTriangle } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function MainAppContent() {
  const { t } = useLanguage();

  // Audio state
  const [activeFile, setActiveFile] = useState<{
    blob: Blob;
    name: string;
    size: number;
    duration?: number;
    url: string;
  } | null>(null);

  // Options state
  const [taskMode, setTaskMode] = useState<TaskMode>('verbatim');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Sinhala', 'English']);
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customApiKey, setCustomApiKey] = useState('');

  // Execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [resultData, setResultData] = useState<{
    transcription: string;
    detectedLanguage: string;
    languageCode?: string;
    confidenceScore?: number;
    wordCount?: number;
    summary?: string;
    keyTopics?: string[];
    actionItems?: string[];
    speakersDetected?: string[];
  } | null>(null);

  // History & Modals state
  const [history, setHistory] = useState<SavedTranscription[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isKeyConfigOpen, setIsKeyConfigOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    setHistory(getSavedTranscriptions());
  }, []);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag);

      // Escape key to close open modals or drawers
      if (e.key === 'Escape') {
        setIsHistoryOpen(false);
        setIsKeyConfigOpen(false);
        setIsShortcutsOpen(false);
        return;
      }

      // Ctrl + Enter or Cmd + Enter -> Trigger Transcription
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (activeFile && !isProcessing) {
          handleTranscribe();
        }
        return;
      }

      // Ctrl + S or Cmd + S -> Save / Download Transcript
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (resultData) {
          downloadTranscription(
            resultData.transcription,
            activeFile?.name || 'Audio_Transcript',
            'txt',
            resultData
          );
        }
        return;
      }

      // Ctrl + Shift + C or Cmd + Shift + C -> Copy Transcript
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (resultData?.transcription) {
          navigator.clipboard.writeText(resultData.transcription);
        }
        return;
      }

      // Shift + H -> Toggle History
      if (e.shiftKey && e.key.toUpperCase() === 'H' && !isInput) {
        e.preventDefault();
        setIsHistoryOpen((prev) => !prev);
        return;
      }

      // ? or Shift + / -> Toggle Keyboard Shortcuts Cheat Sheet
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, isProcessing, resultData]);

  const handleTranscribe = async () => {
    if (!activeFile) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const base64Audio = await fileToBase64(activeFile.blob);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audioBase64: base64Audio,
          mimeType: activeFile.blob.type || 'audio/mp3',
          taskMode,
          selectedLanguages,
          targetLanguage,
          customPrompt,
          customApiKey
        })
      });

      const contentType = response.headers.get('content-type') || '';
      let resJson: any = null;

      if (contentType.includes('application/json')) {
        resJson = await response.json();
      } else {
        const rawText = await response.text();
        throw new Error(`Server returned non-JSON response (${response.status} ${response.statusText}): ${rawText.slice(0, 150)}`);
      }

      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to process audio transcription.');
      }

      const data = resJson.data;
      setResultData(data);

      saveTranscription({
        title: activeFile.name,
        audioFileName: activeFile.name,
        audioDurationSeconds: activeFile.duration,
        detectedLanguage: data.detectedLanguage || 'Auto',
        taskMode,
        wordCount: data.wordCount || data.transcription.split(/\s+/).length,
        transcription: data.transcription,
        summary: data.summary,
        keyTopics: data.keyTopics,
        actionItems: data.actionItems,
        speakersDetected: data.speakersDetected
      });

      setHistory(getSavedTranscriptions());

    } catch (err: any) {
      console.error('Transcription error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during transcription.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectHistoryItem = (item: SavedTranscription) => {
    setResultData({
      transcription: item.transcription,
      detectedLanguage: item.detectedLanguage,
      wordCount: item.wordCount,
      summary: item.summary,
      keyTopics: item.keyTopics,
      actionItems: item.actionItems,
      speakersDetected: item.speakersDetected
    });
    setTaskMode((item.taskMode as TaskMode) || 'verbatim');
  };

  return (
    <div className="min-h-screen bg-[#080d1a] bg-grid-cyber text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* Cyber Ambient Lighting Effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 relative z-10">
        {/* Cyber Hero Title Lockup */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3.5">
          <EngineBadge />

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,255,204,0.6)] glow-cyan inline-block">
              {t('heroTitle', 'TranscribeX')}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-2xl font-normal">
            {t('heroTagline', 'Enterprise-grade AI audio transcription & intelligence engine. Convert voice notes, recordings, and live meetings into highly accurate text with multi-language detection, speaker diarization, and instant AI analytics.')}
          </p>
        </div>

        {/* Responsive Two-Column Grid Row for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
          {/* Left Column: Audio Uploader, Audio Player & Spoken Languages Detection Widget */}
          <div className="flex flex-col gap-4 w-full">
            <AudioUploader
              activeFile={activeFile}
              onAudioSelect={(fileData) => {
                setActiveFile(fileData);
                setErrorMsg(null);
              }}
              onClearAudio={() => {
                setActiveFile(null);
                setResultData(null);
                setErrorMsg(null);
              }}
            />

            {/* Audio Player for active file */}
            {activeFile && (
              <AudioPlayer audioUrl={activeFile.url} title={activeFile.name} />
            )}

            {/* Spoken Languages Detection Widget Card */}
            <LanguageSelector
              selectedLanguages={selectedLanguages}
              onLanguagesChange={setSelectedLanguages}
            />
          </div>

          {/* Right Column: Transcription Mode & AI Options */}
          <div className="flex flex-col gap-4 w-full">
            <TranscriptionOptions
              selectedMode={taskMode}
              onModeChange={setTaskMode}
              targetLanguage={targetLanguage}
              onTargetLanguageChange={setTargetLanguage}
              customPrompt={customPrompt}
              onCustomPromptChange={setCustomPrompt}
              onTranscribe={handleTranscribe}
              isProcessing={isProcessing}
              disabled={!activeFile}
            />
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="w-full p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 shadow-lg backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <p className="font-bold text-rose-200 mb-1">Transcription Failed</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Transcription Output & Intelligence View (Full Width Row) */}
        {resultData && (
          <section className="w-full animate-in fade-in duration-300">
            <TranscriptViewer
              data={resultData}
              audioFileName={activeFile?.name || 'Audio_Transcript'}
              taskMode={taskMode}
              audioUrl={activeFile?.url}
              customApiKey={customApiKey}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[11px] text-slate-400">
            {t('footerText', 'TranscribeX AI Engine · Cyberpunk Edition')}
          </span>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <button onClick={() => setIsHistoryOpen(true)} className="hover:text-cyan-400 transition-colors">
              {t('history', 'History')} ({history.length})
            </button>
          </div>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onHistoryUpdate={setHistory}
      />

      {/* API Config Modal */}
      <ApiConfigModal
        isOpen={isKeyConfigOpen}
        onClose={() => setIsKeyConfigOpen(false)}
        customApiKey={customApiKey}
        onSaveCustomKey={setCustomApiKey}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}
