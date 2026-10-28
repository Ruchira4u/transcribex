import React from 'react';
import {
  FileText, Sparkles, Users, ListCheck, Languages, Subtitles, MessageSquare,
  ArrowRight, Loader2
} from 'lucide-react';
import { LANGUAGES_LIST } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export type TaskMode = 'verbatim' | 'cleaned' | 'diarized' | 'summary' | 'translate' | 'subtitles' | 'custom';

interface TranscriptionOptionsProps {
  selectedMode: TaskMode;
  onModeChange: (mode: TaskMode) => void;
  targetLanguage: string;
  onTargetLanguageChange: (lang: string) => void;
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  onTranscribe: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

export const TranscriptionOptions: React.FC<TranscriptionOptionsProps> = ({
  selectedMode,
  onModeChange,
  targetLanguage,
  onTargetLanguageChange,
  customPrompt,
  onCustomPromptChange,
  onTranscribe,
  isProcessing,
  disabled
}) => {
  const { t } = useLanguage();

  const modes: { id: TaskMode; labelKey: string; descKey: string; defaultLabel: string; defaultDesc: string; icon: React.ReactNode }[] = [
    {
      id: 'verbatim',
      labelKey: 'modeVerbatim',
      descKey: 'modeVerbatimDesc',
      defaultLabel: 'Verbatim Transcript',
      defaultDesc: 'Exact word-for-word transcript preserving all spoken words',
      icon: <FileText className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'cleaned',
      labelKey: 'modeCleaned',
      descKey: 'modeCleanedDesc',
      defaultLabel: 'Cleaned & Formatted',
      defaultDesc: 'Removes stuttering and filler words, formats paragraphs',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'diarized',
      labelKey: 'modeDiarized',
      descKey: 'modeDiarizedDesc',
      defaultLabel: 'Speaker Diarization',
      defaultDesc: 'Detects speakers with estimated timestamps',
      icon: <Users className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'summary',
      labelKey: 'modeSummary',
      descKey: 'modeSummaryDesc',
      defaultLabel: 'Executive Summary',
      defaultDesc: 'Extracts executive summary, key topics, and action items',
      icon: <ListCheck className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'translate',
      labelKey: 'modeTranslate',
      descKey: 'modeTranslateDesc',
      defaultLabel: 'Translate Audio',
      defaultDesc: 'Transcribes and translates audio into target language',
      icon: <Languages className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'subtitles',
      labelKey: 'modeSubtitles',
      descKey: 'modeSubtitlesDesc',
      defaultLabel: 'SRT Subtitles',
      defaultDesc: 'Outputs timecoded SRT caption blocks',
      icon: <Subtitles className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'custom',
      labelKey: 'modeCustom',
      descKey: 'modeCustomDesc',
      defaultLabel: 'Custom Instruction',
      defaultDesc: 'Specify your own custom transcription rules',
      icon: <MessageSquare className="w-4 h-4 text-cyan-400" />
    }
  ];

  return (
    <div className="w-full flex flex-col gap-5 p-6 rounded-2xl bg-slate-900/70 border border-cyan-500/20 glass-panel">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{t('optionsTitle', 'Transcription Mode & AI Options')}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Select how Gemini 3.5 Transcribe engine should process and structure your audio
        </p>
      </div>

      {/* Grid of Task Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {modes.map((mode) => {
          const label = t(mode.labelKey, mode.defaultLabel);
          const desc = t(mode.descKey, mode.defaultDesc);
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                selectedMode === mode.id
                  ? 'bg-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/30 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 shrink-0">
                  {mode.icon}
                </div>
                <span className={`text-xs font-bold ${selectedMode === mode.id ? 'text-cyan-300' : 'text-slate-200'}`}>
                  {label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Sub-options for Translation Mode */}
      {selectedMode === 'translate' && (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex flex-col sm:flex-row items-center gap-3">
          <label className="text-xs font-semibold text-slate-300 shrink-0">
            {t('targetLanguageLabel', 'Target Output Language')}:
          </label>
          <select
            value={targetLanguage}
            onChange={(e) => onTargetLanguageChange(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-cyan-300 focus:outline-none focus:border-cyan-400"
          >
            {LANGUAGES_LIST.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Custom Prompt Textarea */}
      {selectedMode === 'custom' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300">
            {t('customPromptLabel', 'Custom AI Prompt')}:
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => onCustomPromptChange(e.target.value)}
            placeholder={t('customPromptPlaceholder', 'e.g. Extract key technical terms, format transcript into Q&A style...')}
            rows={3}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>
      )}

      {/* Transcribe Button */}
      <button
        onClick={onTranscribe}
        disabled={disabled || isProcessing}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl ${
          disabled
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            : isProcessing
            ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 cursor-wait'
            : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 shadow-cyan-500/25 hover:scale-[1.01] active:scale-[0.99]'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            <span>{t('processingAudio', 'Transcribing Audio...')}</span>
          </>
        ) : (
          <>
            <span>{t('startTranscribing', 'Start Transcribing Audio')}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
