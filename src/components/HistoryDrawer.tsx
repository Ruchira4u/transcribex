import React from 'react';
import { History, X, Trash2, ArrowRight, FileText, Globe, Clock } from 'lucide-react';
import { SavedTranscription, deleteSavedTranscription, clearTranscriptionHistory } from '../utils/audioHelpers';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedTranscription[];
  onSelectHistoryItem: (item: SavedTranscription) => void;
  onHistoryUpdate: (updated: SavedTranscription[]) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onHistoryUpdate
}) => {
  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteSavedTranscription(id);
    onHistoryUpdate(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all transcription history?')) {
      clearTranscriptionHistory();
      onHistoryUpdate([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-cyan-500/30 p-6 flex flex-col justify-between shadow-2xl glass-panel animate-in slide-in-from-right duration-200">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Transcription History</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* History List */}
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 gap-2">
              <FileText className="w-10 h-10 text-slate-700" />
              <p className="text-xs">No saved transcriptions yet.</p>
              <p className="text-[11px] text-slate-600">
                Transcribe any audio file or microphone recording to save history.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200 truncate max-w-[240px]">
                      {item.title}
                    </h3>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 font-mono">
                    {item.transcription}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-2">
                    <span className="flex items-center gap-1 text-cyan-400/80">
                      <Globe className="w-3 h-3" />
                      {item.detectedLanguage}
                    </span>
                    <span>{item.wordCount} words</span>
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Clear All */}
        {history.length > 0 && (
          <div className="border-t border-slate-800 pt-4 mt-2 flex justify-between items-center">
            <span className="text-xs text-slate-500">{history.length} saved transcripts</span>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium hover:bg-rose-500/20 transition-colors"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
