import React, { useState, useRef, useEffect } from 'react';
import { Globe, Search, Check, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LANGUAGES_LIST = [
  'Sinhala',
  'English',
  'Spanish',
  'French',
  'German',
  'Tamil',
  'Japanese',
  'Mandarin Chinese',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Italian',
  'Russian',
  'Korean',
  'Bengali',
  'Dutch',
  'Swedish',
  'Turkish',
  'Vietnamese',
  'Indonesian',
  'Greek',
  'Polish'
];

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  onLanguagesChange
}) => {
  const { t } = useLanguage();
  const [langSearch, setLangSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = LANGUAGES_LIST.filter((lang) =>
    lang.toLowerCase().includes(langSearch.toLowerCase())
  );

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      onLanguagesChange(selectedLanguages.filter((l) => l !== lang));
    } else {
      onLanguagesChange([...selectedLanguages, lang]);
    }
  };

  const removeLanguage = (lang: string) => {
    onLanguagesChange(selectedLanguages.filter((l) => l !== lang));
  };

  return (
    <div className="p-4.5 rounded-2xl bg-slate-900/70 border border-cyan-500/20 glass-panel flex flex-col gap-3.5 relative" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-cyan-300 flex items-center gap-2 uppercase tracking-wider">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>{t('spokenLanguagesTitle', 'Spoken Languages for Detection')}</span>
        </label>
        <span className="text-[11px] font-mono text-slate-400">
          {selectedLanguages.length === 0 ? 'Auto-Detect All' : `${selectedLanguages.length} Selected`}
        </span>
      </div>

      {/* Selected Language Tag Chips */}
      <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
        {selectedLanguages.length === 0 ? (
          <span className="text-xs text-slate-500 italic">
            Auto-Detect All Spoken Languages (Default)
          </span>
        ) : (
          selectedLanguages.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-sm"
            >
              <span>{lang}</span>
              <button
                type="button"
                onClick={() => removeLanguage(lang)}
                className="p-0.5 rounded hover:bg-cyan-500/30 text-cyan-400 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Searchable Input Trigger Box */}
      <div className="relative">
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-slate-950 border border-slate-700 hover:border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={langSearch}
              onChange={(e) => {
                setLangSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              placeholder={t('searchLanguages', 'Search languages (e.g. Sinhala, English, Tamil...)...')}
              className="bg-transparent text-xs text-white focus:outline-none w-full"
              onClick={(e) => e.stopPropagation()}
              onFocus={() => setIsDropdownOpen(true)}
            />
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
        </div>

        {/* Searchable Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 max-h-52 overflow-y-auto bg-slate-950 border border-cyan-500/40 rounded-xl shadow-2xl z-30 p-1.5 flex flex-col gap-1">
            {filteredLanguages.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-500">
                No matching language found
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <div
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>{lang}</span>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Quick Language Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-slate-500 font-mono">Quick Presets:</span>
        <button
          type="button"
          onClick={() => onLanguagesChange(['Sinhala', 'English'])}
          className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 transition-colors"
        >
          + Sinhala + English
        </button>
        <button
          type="button"
          onClick={() => onLanguagesChange(['Tamil', 'English'])}
          className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 transition-colors"
        >
          + Tamil + English
        </button>
        <button
          type="button"
          onClick={() => onLanguagesChange(['Spanish', 'English'])}
          className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 transition-colors"
        >
          + Spanish + English
        </button>
        <button
          type="button"
          onClick={() => onLanguagesChange([])}
          className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-rose-400 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
