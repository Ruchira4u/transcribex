import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../utils/translations';

export const GlobalLanguageSelector: React.FC = () => {
  const { language, setLanguage, supportedLanguages, currentLanguageOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Sleek Header Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,204,0.25)] transition-all duration-200 relative group"
        title="Change Interface Language"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
        <span className="hidden sm:inline font-mono text-[11px] font-bold text-cyan-300">
          {currentLanguageOption.nativeName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Cyber Glass Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-950/95 border border-cyan-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-800/80">
          <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold tracking-wider text-cyan-400/80 uppercase flex items-center justify-between">
            <span>INTERFACE LANGUAGE</span>
            <span className="text-slate-500">{supportedLanguages.length} LANGUAGES</span>
          </div>

          <div className="py-1 max-h-64 overflow-y-auto flex flex-col gap-0.5">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as LanguageCode);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all duration-150 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_10px_rgba(0,255,204,0.2)]'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-cyan-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs leading-tight">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
