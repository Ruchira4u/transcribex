import React from 'react';
import { Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EngineBadgeProps {
  className?: string;
  label?: string;
}

export const EngineBadge: React.FC<EngineBadgeProps> = ({
  className = '',
  label
}) => {
  const { t } = useLanguage();
  const displayLabel = label || t('engineBadge', 'GEMINI 3.5 MULTILINGUAL TRANSCRIBER ENGINE');

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md bg-gradient-to-r from-cyan-950/40 via-slate-900/70 to-purple-950/40 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,255,204,0.25)] hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(0,255,204,0.45)] transition-all duration-300 group ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <span className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400/40 animate-ping" />
        <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0 drop-shadow-[0_0_8px_rgba(0,255,204,0.8)] group-hover:scale-110 transition-transform" />
      </div>

      <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-cyan-300 drop-shadow-[0_0_6px_rgba(0,255,204,0.5)] select-none uppercase">
        {displayLabel}
      </span>
    </div>
  );
};
