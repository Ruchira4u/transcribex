export interface SavedTranscription {
  id: string;
  title: string;
  timestamp: string;
  audioFileName: string;
  audioDurationSeconds?: number;
  detectedLanguage: string;
  taskMode: string;
  wordCount: number;
  transcription: string;
  summary?: string;
  keyTopics?: string[];
  actionItems?: string[];
  speakersDetected?: string[];
}

// Convert File or Blob to base64
export const fileToBase64 = (file: Blob | File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Strip out the data URL prefix (e.g. "data:audio/mp3;base64,")
      const base64Data = result.split(',')[1] || result;
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Format seconds to mm:ss or hh:mm:ss
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');

  if (hrs > 0) {
    const formattedHrs = String(hrs).padStart(2, '0');
    return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
  }
  return `${formattedMins}:${formattedSecs}`;
};

// Format bytes to readable string (e.g. "4.2 MB")
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Download text in chosen format
export const downloadTranscription = (
  text: string,
  filename: string,
  format: 'txt' | 'pdf' | 'json' | 'srt' | 'vtt' | 'md' = 'txt',
  metadata?: Partial<SavedTranscription>
) => {
  if (format === 'pdf') {
    downloadPdfReport(text, filename, metadata);
    return;
  }

  let content = text;
  let mimeType = 'text/plain;charset=utf-8';
  let ext = format;

  if (format === 'json') {
    content = JSON.stringify({
      title: filename,
      exportedAt: new Date().toISOString(),
      metadata,
      transcription: text
    }, null, 2);
    mimeType = 'application/json';
  } else if (format === 'md') {
    content = `# ${filename}\n\n` +
      `**Exported Date:** ${new Date().toLocaleDateString()}\n` +
      `**Detected Language:** ${metadata?.detectedLanguage || 'Auto'}\n` +
      `**Word Count:** ${metadata?.wordCount || text.split(/\s+/).length}\n\n` +
      (metadata?.summary ? `## Summary\n${metadata.summary}\n\n` : '') +
      (metadata?.keyTopics && metadata.keyTopics.length > 0 ? `## Key Topics\n${metadata.keyTopics.map(t => `- ${t}`).join('\n')}\n\n` : '') +
      (metadata?.actionItems && metadata.actionItems.length > 0 ? `## Action Items\n${metadata.actionItems.map(a => `- [ ] ${a}`).join('\n')}\n\n` : '') +
      `## Full Transcript\n\n${text}`;
    mimeType = 'text/markdown;charset=utf-8';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename.replace(/[^a-z0-9_-]/gi, '_')}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Generate styled printable PDF report
export const downloadPdfReport = (
  text: string,
  filename: string,
  metadata?: Partial<SavedTranscription>
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to open the PDF print report.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename} - PDF Transcript Report</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0f172a;
            line-height: 1.6;
            margin: 32px;
            background: #ffffff;
          }
          .header {
            border-bottom: 2px solid #0284c7;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 4px 0;
          }
          .subtitle {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .meta-grid {
            display: flex;
            gap: 24px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 12px;
          }
          .meta-item {
            display: flex;
            flex-direction: column;
          }
          .meta-label {
            font-size: 10px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: bold;
          }
          .meta-value {
            font-weight: 700;
            color: #0f172a;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #0284c7;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .transcript-box {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            white-space: pre-wrap;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 16px;
            border-radius: 8px;
            color: #1e293b;
          }
          @media print {
            body { margin: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${filename}</h1>
          <div class="subtitle">Audio2Text AI Transcriber Report · Exported ${new Date().toLocaleDateString()}</div>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">Detected Language</span>
            <span class="meta-value">${metadata?.detectedLanguage || 'Auto Detected'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Word Count</span>
            <span class="meta-value">${metadata?.wordCount || text.split(/\s+/).length} words</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Generated Date</span>
            <span class="meta-value">${new Date().toLocaleDateString()}</span>
          </div>
        </div>

        ${metadata?.summary ? `
          <div class="section">
            <div class="section-title">Executive Summary</div>
            <div style="font-size: 13px; color: #334155;">${metadata.summary}</div>
          </div>
        ` : ''}

        ${metadata?.keyTopics && metadata.keyTopics.length > 0 ? `
          <div class="section">
            <div class="section-title">Key Topics</div>
            <ul style="font-size: 13px; color: #334155; margin: 0; padding-left: 20px;">
              ${metadata.keyTopics.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${metadata?.actionItems && metadata.actionItems.length > 0 ? `
          <div class="section">
            <div class="section-title">Action Items</div>
            <ul style="font-size: 13px; color: #334155; margin: 0; padding-left: 20px;">
              ${metadata.actionItems.map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Full Transcription</div>
          <div class="transcript-box">${text}</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// LocalStorage Persistence
const STORAGE_KEY = 'audio2text_transcription_history';

export const getSavedTranscriptions = (): SavedTranscription[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading transcription history:', e);
    return [];
  }
};

export const saveTranscription = (item: Omit<SavedTranscription, 'id' | 'timestamp'>): SavedTranscription => {
  const history = getSavedTranscriptions();
  const newItem: SavedTranscription = {
    ...item,
    id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString()
  };
  const updated = [newItem, ...history].slice(0, 50); // Keep last 50
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving transcription:', e);
  }
  return newItem;
};

export const deleteSavedTranscription = (id: string): SavedTranscription[] => {
  const history = getSavedTranscriptions();
  const updated = history.filter(h => h.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting transcription:', e);
  }
  return updated;
};

export const clearTranscriptionHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing history:', e);
  }
};

// Generate Synthetic Sample Audio for immediate testing
export const createSampleAudioBlob = (type: 'multilingual' | 'speech' | 'meeting' = 'speech'): Promise<{ blob: Blob; url: string; name: string }> => {
  return new Promise((resolve) => {
    // Generate a 4-second WAV tone with harmonic acoustic patterns representing speech simulation
    const sampleRate = 22050;
    const duration = 4;
    const numSamples = sampleRate * duration;
    const buffer = new Float32Array(numSamples);

    // Synthesize human-like pitch changes
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const pitch1 = 220 + Math.sin(t * 8) * 40;
      const pitch2 = 440 + Math.cos(t * 12) * 60;
      const envelope = Math.sin((i / numSamples) * Math.PI); // Smooth fade in/out
      const speechSim = (Math.sin(2 * Math.PI * pitch1 * t) * 0.6 + Math.sin(2 * Math.PI * pitch2 * t) * 0.3) * envelope;
      buffer[i] = speechSim;
    }

    // Convert Float32Array to 16-bit PCM WAV Blob
    const wavBuffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(wavBuffer);

    /* RIFF identifier */
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat PCM
    view.setUint16(22, 1, true); // NumChannels Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // ByteRate
    view.setUint16(32, 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }

    const blob = new Blob([wavBuffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    let sampleName = 'Sample_Voice_Note_Sinhala_English.wav';
    if (type === 'meeting') sampleName = 'Sample_Team_Sync_Meeting.wav';
    if (type === 'speech') sampleName = 'Sample_Keynote_Speech.wav';

    resolve({ blob, url, name: sampleName });
  });
};
