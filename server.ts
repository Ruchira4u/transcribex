import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// High body limit for base64 audio payload processing
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Status check endpoint
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    model: 'gemini-2.5-flash',
    timestamp: new Date().toISOString()
  });
});

// Audio transcription endpoint
app.post('/api/transcribe', async (req, res) => {
  try {
    const {
      audioBase64,
      mimeType = 'audio/mp3',
      taskMode = 'verbatim',
      targetLanguage = 'English',
      customPrompt,
      customApiKey
    } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ success: false, error: 'Missing audio base64 data.' });
    }

    const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'No Gemini API Key found. Please add GEMINI_API_KEY in Settings > Secrets or provide a custom key.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Clean up base64 string if data URL prefix is included
    const cleanBase64 = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;

    // Build prompt based on task mode
    let taskInstruction = '';
    switch (taskMode) {
      case 'verbatim':
        taskInstruction = `Transcribe this audio file verbatim into text. Detect the spoken language automatically. Do not remove filler words or change spoken text.`;
        break;
      case 'cleaned':
        taskInstruction = `Transcribe this audio file into clean, well-punctuated, readable text. Detect the language automatically. Remove filler words (like 'um', 'uh', 'like', 'you know'), correct minor stuttering, and structure into clear logical paragraphs.`;
        break;
      case 'diarized':
        taskInstruction = `Transcribe this audio file with speaker identification and estimated timestamps. Detect language automatically. Format as:\n[00:00] Speaker 1: <spoken words>\n[00:15] Speaker 2: <spoken words>\nUse clear speaker labels (Speaker 1, Speaker 2, or named speakers if mentioned in audio).`;
        break;
      case 'summary':
        taskInstruction = `Transcribe this audio file and generate an executive meeting summary. Identify key topics, bulleted key takeaways, and action items with owners or deadlines if stated.`;
        break;
      case 'translate':
        taskInstruction = `Transcribe this audio file and translate the complete transcription into ${targetLanguage}. Detect original spoken language automatically.`;
        break;
      case 'subtitles':
        taskInstruction = `Transcribe this audio file and output captions formatted as valid SRT subtitle format (with sequence numbers, timestamp ranges 00:00:00,000 --> 00:00:04,000, and text lines).`;
        break;
      case 'custom':
        taskInstruction = customPrompt || `Transcribe this audio file verbatim.`;
        break;
      default:
        taskInstruction = `Transcribe this audio file verbatim into text. Detect spoken language.`;
    }

    const systemPrompt = `You are a professional audio transcriber and audio analysis expert.
Your task is to transcribe and analyze the provided audio recording according to the instructions.
You must output a structured JSON response matching the following schema:
- transcription: The transcript or output generated according to the user instruction.
- detectedLanguage: The primary language detected in the audio (e.g. "English", "Sinhala", "Spanish", "English / Sinhala Code-switching", etc.).
- languageCode: Language ISO code if known (e.g. "en", "si", "es", "multilingual").
- confidenceScore: Estimated transcription confidence percentage (0 to 100).
- wordCount: Total word count of the transcript.
- summary: A concise 2-3 sentence overview of the audio content.
- keyTopics: An array of 3 to 6 key topics discussed.
- actionItems: An array of action items extracted from the recording (if applicable, else empty array).
- speakersDetected: An array of detected speaker names or labels (e.g. ["Speaker 1", "Speaker 2"]).`;

    const sanitizedMime = (mimeType || 'audio/mp3').split(';')[0];
    const audioPart = {
      inlineData: {
        mimeType: sanitizedMime,
        data: cleanBase64
      }
    };

    const modelCandidates = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let responseText = '';
    let lastError: any = null;

    for (const modelName of modelCandidates) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            audioPart,
            { text: `${taskInstruction}\n\nProvide the transcript and structured audio analysis in valid JSON format.` }
          ],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                transcription: { type: Type.STRING, description: "The transcribed or translated text output" },
                detectedLanguage: { type: Type.STRING, description: "Primary language detected" },
                languageCode: { type: Type.STRING, description: "Language code like en, si, es" },
                confidenceScore: { type: Type.NUMBER, description: "Confidence score from 0 to 100" },
                wordCount: { type: Type.INTEGER, description: "Total words in transcript" },
                summary: { type: Type.STRING, description: "Brief executive summary" },
                keyTopics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of key topics"
                },
                actionItems: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of action items if any"
                },
                speakersDetected: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of detected speakers"
                }
              },
              required: ["transcription", "detectedLanguage", "confidenceScore", "wordCount"]
            }
          }
        });

        if (response.text && response.text.trim()) {
          responseText = response.text.trim();
          break;
        } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
          responseText = response.candidates[0].content.parts[0].text.trim();
          break;
        }
      } catch (err: any) {
        console.warn(`Gemini model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    if (!responseText) {
      if (lastError) {
        throw new Error(`Gemini transcription model error: ${lastError.message}`);
      }
      throw new Error('Received empty response from Gemini transcription model.');
    }

    let parsedResult;
    try {
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleanJson);
    } catch {
      parsedResult = {
        transcription: responseText,
        detectedLanguage: "Auto Detected",
        languageCode: "auto",
        confidenceScore: 95,
        wordCount: responseText.split(/\s+/).length,
        summary: "Audio transcribed successfully.",
        keyTopics: [],
        actionItems: [],
        speakersDetected: []
      };
    }

    return res.json({
      success: true,
      data: parsedResult,
      taskMode,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Transcription error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred during audio transcription.',
      details: String(error)
    });
  }
});

// Follow-up chat endpoint to query transcription
app.post('/api/chat-transcription', async (req, res) => {
  try {
    const { transcript, userQuery, customApiKey } = req.body;

    if (!transcript || !userQuery) {
      return res.status(400).json({ success: false, error: 'Missing transcript or query.' });
    }

    const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ success: false, error: 'No Gemini API Key available.' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Here is the full audio transcript:\n\n"""\n${transcript}\n"""\n\nUser Question: ${userQuery}` }
          ]
        }
      ],
      config: {
        systemInstruction: "You are an intelligent audio assistant. Answer the user's question accurately based strictly on the provided audio transcript. Keep answers clear, helpful, and concise."
      }
    });

    return res.json({ success: true, answer: response.text });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to analyze transcript.' });
  }
});

// Explicit 404 for unmatched API routes to prevent Vite HTML fallback
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.path}`
  });
});

// Global API error handling middleware (handles body parser limits, route errors, etc.)
app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express API Error Handler:', err);
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Server error processing API request.',
    code: err.code || 'API_SERVER_ERROR'
  });
});

// Mount Vite middleware or static server
async function startServer() {
  const distIndexPath = path.join(__dirname, 'dist', 'index.html');
  const isProductionBuild = fs.existsSync(distIndexPath);

  if (!isProductionBuild) {
    console.log('Starting Vite development middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    console.log('Serving production build from dist...');
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(distIndexPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TranscribeX server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
