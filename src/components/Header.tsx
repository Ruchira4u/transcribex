import React from 'react';
import { Mic, History, Keyboard } from 'lucide-react';
import { GlobalLanguageSelector } from './GlobalLanguageSelector';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenShortcuts: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenShortcuts,
  historyCount
}) => {
  const { t } = useLanguage();

  return (
    <header className="w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Mic className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 glow-cyan">
                {t('headerTitle', 'TranscribeX')}
              </span>
              <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                GEMINI 3.5
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block font-medium">
              {t('headerSubtitle', 'Multilingual Audio Intelligence & Transcription Engine')}
            </p>
          </div>
        </div>

        {/* Quick Nav, Global Language Selector & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Sleek Global Language Selector Dropdown */}
          <GlobalLanguageSelector />

          <button
            onClick={onOpenShortcuts}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">{t('shortcuts', 'Shortcuts')}</span>
            <kbd className="hidden lg:inline-block text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">?</kbd>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors relative"
            title="Transcription History"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{t('history', 'History')}</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/40">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
