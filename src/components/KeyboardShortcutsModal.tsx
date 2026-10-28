import React from 'react';
import { Command, X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keyCombo: 'Ctrl + Enter', desc: 'Trigger Audio Transcription', macCombo: '⌘ + Enter' },
    { keyCombo: 'Ctrl + S', desc: 'Save / Download Transcript', macCombo: '⌘ + S' },
    { keyCombo: 'Ctrl + Shift + C', desc: 'Copy Transcript to Clipboard', macCombo: '⌘ + Shift + C' },
    { keyCombo: 'Space', desc: 'Toggle Audio Play / Pause (when not typing)', macCombo: 'Space' },
    { keyCombo: 'Shift + H', desc: 'Toggle History Drawer', macCombo: 'Shift + H' },
    { keyCombo: '?', desc: 'Show Keyboard Shortcuts Help', macCombo: '?' }
  ];

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl glass-panel relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Keyboard Shortcuts</h2>
            <p className="text-xs text-slate-400">Workflow efficiency key bindings</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <span className="text-slate-300 font-medium">{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold shadow-sm">
                {isMac ? sc.macCombo : sc.keyCombo}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 text-center text-[11px] text-slate-500 font-mono">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">Esc</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">?</kbd> to dismiss
        </div>
      </div>
    </div>
  );
};
