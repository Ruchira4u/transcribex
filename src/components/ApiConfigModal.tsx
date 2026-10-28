import React, { useState } from 'react';
import { Key, X, Check, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  customApiKey: string;
  onSaveCustomKey: (key: string) => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({
  isOpen,
  onClose,
  customApiKey,
  onSaveCustomKey
}) => {
  const [keyInput, setKeyInput] = useState(customApiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCustomKey(keyInput.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl glass-panel relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Gemini API Status & Configuration</h2>
            <p className="text-xs text-slate-400">Audio2Text AI Transcriber Engine Settings</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 mb-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <p className="font-semibold text-emerald-300 mb-1">Environment Secrets Connected</p>
            <p>
              Your app automatically uses the server-injected <code className="text-cyan-300 bg-slate-900 px-1 rounded">process.env.GEMINI_API_KEY</code>. You can manage server keys in <span className="font-semibold text-white">Settings &gt; Secrets</span>.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Optional Custom API Key Override
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Paste custom Gemini API Key if desired..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Leave blank to use default environment secret key.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
