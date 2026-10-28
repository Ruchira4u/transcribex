import React, { useState } from 'react';
import {
  Copy, Download, Edit3, Eye, Search, Volume2, VolumeX, Sparkles, Check, MessageSquare,
  FileText, CheckSquare, Globe, Award, Clock, ArrowDownToLine, RefreshCw, Send, HelpCircle,
  BarChart3
} from 'lucide-react';
import { downloadTranscription, SavedTranscription } from '../utils/audioHelpers';
import { DashboardStatistics } from './DashboardStatistics';
import { useLanguage } from '../context/LanguageContext';

interface TranscriptViewerProps {
  data: {
    transcription: string;
    detectedLanguage: string;
    languageCode?: string;
    confidenceScore?: number;
    wordCount?: number;
    summary?: string;
    keyTopics?: string[];
    actionItems?: string[];
    speakersDetected?: string[];
  };
  audioFileName: string;
  taskMode: string;
  audioUrl?: string;
  customApiKey?: string;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  data,
  audioFileName,
  taskMode,
  audioUrl,
  customApiKey
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'analytics' | 'chat'>('transcript');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(data.transcription);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // AI Chat Assistant state
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I analyzed this recording. Ask me anything about what was said, key decisions, or specific topics!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Sync edited text if props change
  React.useEffect(() => {
    setEditedText(data.transcription);
  }, [data.transcription]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'txt' | 'pdf' | 'json' | 'srt' | 'vtt' | 'md') => {
    downloadTranscription(editedText, audioFileName, format, {
      detectedLanguage: data.detectedLanguage,
      wordCount: data.wordCount,
      summary: data.summary,
      keyTopics: data.keyTopics,
      actionItems: data.actionItems
    });
  };

  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(editedText.slice(0, 1000));
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isChatLoading) return;

    const userText = inputMessage.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat-transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: editedText,
          userQuery: userText,
          customApiKey
        })
      });

      const contentType = response.headers.get('content-type') || '';
      let resData: any = {};

      if (contentType.includes('application/json')) {
        resData = await response.json();
      } else {
        const rawErr = await response.text();
        resData = { error: `Server error (${response.status}): ${rawErr.slice(0, 100)}` };
      }

      if (resData.answer) {
        setChatMessages((prev) => [...prev, { sender: 'ai', text: resData.answer }]);
      } else {
        setChatMessages((prev) => [...prev, { sender: 'ai', text: resData.error || 'Could not answer query.' }]);
      }
    } catch (err) {
      setChatMessages((prev) => [...prev, { sender: 'ai', text: 'Error contacting AI assistant.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Render search highlighted text
  const renderHighlightedTranscript = () => {
    if (!searchQuery.trim()) {
      return editedText;
    }

    const parts = editedText.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={index} className="bg-cyan-400 text-slate-950 font-bold px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const estReadingTimeMinutes = Math.max(1, Math.ceil((data.wordCount || editedText.split(/\s+/).length) / 200));

  return (
    <div className="w-full flex flex-col gap-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 glass-panel p-5 shadow-2xl">
      {/* Top Metadata Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block">LANGUAGE</span>
              <span className="font-bold text-cyan-300 truncate block">
                {data.detectedLanguage || 'Auto Detected'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">CONFIDENCE</span>
              <span className="font-bold text-purple-300 block">
                {data.confidenceScore ?? 98}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">WORD COUNT</span>
              <span className="font-bold text-emerald-300 block">
                {data.wordCount || editedText.split(/\s+/).length} words
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">EST. READ TIME</span>
              <span className="font-bold text-amber-300 block">
                ~{estReadingTimeMinutes} min
              </span>
            </div>
          </div>
        </div>

        {/* Prominent Header Copy to Clipboard Button */}
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 ${
            copied
              ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/10'
              : 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-sm'
          }`}
          title="Copy full transcription text to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-cyan-400" />
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Tabs & Toolbar Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('transcript')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'transcript'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Transcript</span>
          </button>

          {(data.summary || (data.keyTopics && data.keyTopics.length > 0)) && (
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === 'summary'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Summary & Insights</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'analytics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Analytics & Charts</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'chat'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Ask AI Assistant</span>
          </button>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Read Out Loud TTS */}
          <button
            onClick={toggleSpeech}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 text-xs flex items-center gap-1.5 transition-colors"
            title="Read out loud"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
          </button>

          {/* Edit Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isEditing
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400'
            }`}
            title={isEditing ? 'View mode' : 'Edit mode'}
          >
            {isEditing ? <Eye className="w-4 h-4 text-amber-400" /> : <Edit3 className="w-4 h-4 text-cyan-400" />}
            <span className="hidden sm:inline">{isEditing ? 'View' : 'Edit'}</span>
          </button>

          {/* Copy Button in Toolbar */}
          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          {/* Export Downloads Dropdown */}
          <div className="relative group">
            <button className="px-3.5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm">
              <ArrowDownToLine className="w-4 h-4 text-cyan-400" />
              <span>Export</span>
            </button>
            <div className="absolute right-0 mt-1 w-48 rounded-xl bg-slate-950 border border-cyan-500/30 shadow-2xl hidden group-hover:flex flex-col p-1.5 z-30 divide-y divide-slate-800/60">
              <div className="py-1">
                <button
                  onClick={() => handleDownload('txt')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Text (.txt)</span>
                  <span className="text-[10px] font-mono text-slate-500">TXT</span>
                </button>
                <button
                  onClick={() => handleDownload('pdf')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-cyan-300">PDF Document (.pdf)</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-300">PDF</span>
                </button>
                <button
                  onClick={() => handleDownload('json')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-purple-300">JSON Data (.json)</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-purple-500/20 text-purple-300">JSON</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => handleDownload('srt')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Subtitles (.srt)</span>
                  <span className="text-[10px] font-mono text-slate-500">SRT</span>
                </button>
                <button
                  onClick={() => handleDownload('vtt')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>WebVTT Captions (.vtt)</span>
                  <span className="text-[10px] font-mono text-slate-500">VTT</span>
                </button>
                <button
                  onClick={() => handleDownload('md')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Markdown Report (.md)</span>
                  <span className="text-[10px] font-mono text-slate-500">MD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Body: 1. Transcript View */}
      {activeTab === 'transcript' && (
        <div className="flex flex-col gap-3">
          {/* Search bar & Font size adjustment */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search words in transcript..."
                className="bg-transparent text-xs text-white focus:outline-none w-full"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-[11px]">Font:</span>
              {(['sm', 'base', 'lg'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                    fontSize === sz ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:text-slate-200'
                  }`}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Transcript Content Box */}
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={14}
              className="w-full bg-slate-950 border border-amber-500/40 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
            />
          ) : (
            <div
              className={`w-full bg-slate-950/90 border border-slate-800 rounded-xl p-5 text-slate-200 font-mono leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto selection:bg-cyan-500 selection:text-slate-950 ${
                fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
              }`}
            >
              {renderHighlightedTranscript()}
            </div>
          )}
        </div>
      )}

      {/* Tab Body: 2. Executive Summary & Action Items */}
      {activeTab === 'summary' && (
        <div className="flex flex-col gap-4">
          {data.summary && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30">
              <h3 className="text-xs font-bold uppercase text-cyan-400 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Executive Summary</span>
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {data.summary}
              </p>
            </div>
          )}

          {data.keyTopics && data.keyTopics.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-purple-500/30">
              <h3 className="text-xs font-bold uppercase text-purple-400 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Key Discussion Topics</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.keyTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.actionItems && data.actionItems.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30">
              <h3 className="text-xs font-bold uppercase text-emerald-400 mb-2 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                <span>Action Items & Tasks</span>
              </h3>
              <ul className="flex flex-col gap-2">
                {data.actionItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab Body: 3. Analytics & Charts */}
      {activeTab === 'analytics' && (
        <DashboardStatistics
          transcriptionText={editedText}
          speakersDetected={data.speakersDetected}
        />
      )}

      {/* Tab Body: 3. Ask AI Assistant */}
      {activeTab === 'chat' && (
        <div className="flex flex-col gap-3 min-h-[350px] justify-between">
          <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto p-3 rounded-xl bg-slate-950/90 border border-slate-800">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gradient-to-br from-cyan-400 to-purple-600 text-slate-950'
                  }`}
                >
                  {msg.sender === 'user' ? 'YOU' : 'AI'}
                </div>
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600/30 border border-blue-500/40 text-blue-100'
                      : 'bg-slate-900 border border-cyan-500/20 text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about this recording..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isChatLoading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
