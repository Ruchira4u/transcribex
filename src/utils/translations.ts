export type LanguageCode = 'en' | 'si' | 'ta' | 'es' | 'fr' | 'ja' | 'de' | 'zh';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Header
    headerTitle: "TranscribeX",
    headerSubtitle: "Multilingual Audio Intelligence & Transcription Engine",
    shortcuts: "Shortcuts",
    history: "History",

    // Hero Lockup
    engineBadge: "GEMINI 3.5 MULTILINGUAL TRANSCRIBER ENGINE",
    heroTitle: "TranscribeX",
    heroTagline: "Enterprise-grade AI audio transcription & intelligence engine. Convert voice notes, recordings, and live meetings into highly accurate text with multi-language detection, speaker diarization, and instant AI analytics.",

    // Audio Uploader
    uploaderTitle: "Drag & Drop any Audio File",
    uploaderSubtitle: "Supports MP3, WAV, M4A, FLAC, OGG, AAC (Max 100MB)",
    browseFiles: "Browse Audio Files",
    orRecordLive: "OR RECORD LIVE MICROPHONE",
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",
    recordingActive: "Recording audio live...",
    trySampleAudio: "Try Demo Sample Audio",
    sampleSinhalaEnglish: "Sinhala + English Demo",
    sampleMeeting: "Team Sync Meeting Demo",
    selectedAudio: "Selected Audio File",
    removeFile: "Remove Audio",

    // Spoken Languages Card
    spokenLanguagesTitle: "Spoken Languages for Detection",
    spokenLanguagesDesc: "Specify expected audio languages to assist auto-detection precision",
    searchLanguages: "Search languages...",
    addLanguage: "Add Language",
    selectedLanguagesLabel: "Active Detection Targets",

    // Transcription Options
    optionsTitle: "Transcription Mode & AI Options",
    modeVerbatim: "Verbatim",
    modeVerbatimDesc: "Exact transcript including filler words and stutters",
    modeCleaned: "Cleaned",
    modeCleanedDesc: "Polished transcript with fillers removed & fixed grammar",
    modeDiarized: "Speaker Diarization",
    modeDiarizedDesc: "Transcribe with speaker identification & timestamp tags",
    modeSummary: "Executive Summary",
    modeSummaryDesc: "Key topics, bullet summary & action items",
    modeTranslate: "Translation",
    modeTranslateDesc: "Transcribe & translate directly into target language",
    modeSubtitles: "Subtitles (SRT)",
    modeSubtitlesDesc: "Generate timestamped SRT/VTT caption files",
    modeCustom: "Custom Prompt",
    modeCustomDesc: "Provide your own custom AI instruction",
    targetLanguageLabel: "Target Output Language",
    customPromptLabel: "Custom AI Prompt",
    customPromptPlaceholder: "e.g., Transcribe in French and highlight key sales questions...",
    startTranscribing: "Transcribe Audio with Gemini 3.5",
    processingAudio: "Transcribing Audio...",

    // Transcript Viewer
    tabTranscript: "Full Transcript",
    tabSummary: "Executive Summary",
    tabAnalytics: "Analytics & Charts",
    tabAskAI: "Ask AI Assistant",
    copyText: "Copy Text",
    copied: "Copied!",
    export: "Export",
    searchText: "Search in transcript...",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    wordCount: "Words",
    detectedLang: "Detected Language",
    confidence: "Confidence",
    keyTopics: "Key Topics",
    actionItems: "Action Items",

    // Dashboard Statistics
    analyticsTitle: "Transcript Visual Analytics & Statistics",
    analyticsSubtitle: "Interactive distribution charts, keyword frequency, and speaker timeline insights",
    totalWords: "Total Words",
    uniqueVocab: "Unique Vocab",
    vocabRichness: "Vocab Richness",
    activeSpeakers: "Active Speakers",
    timelineTitle: "Speaker Segment Timeline Distribution",
    keywordTitle: "Keyword Frequency Distribution",
    speakerShareTitle: "Speaker Turn Share",

    // Footer
    footerText: "TranscribeX AI Engine · Cyberpunk Edition"
  },

  si: {
    // Header
    headerTitle: "TranscribeX",
    headerSubtitle: "බහු-භාෂා ශ්‍රව්‍ය පිටපත් කිරීම සහ AI විශ්ලේෂණ එන්ජිම",
    shortcuts: "කෙටිමං",
    history: "ඉතිහාසය",

    // Hero Lockup
    engineBadge: "ජෙමිනි 3.5 බහු-භාෂා පිටපත් කිරීමේ එන්ජිම",
    heroTitle: "TranscribeX",
    heroTagline: "ව්‍යවසාය මට්ටමේ AI ශ්‍රව්‍ය පිටපත් කිරීම සහ බුද්ධිමය එන්ජිම. හඬ සටහන්, පටිගත කිරීම් සහ රැස්වීම් බහු-භාෂා හඳුනාගැනීම සහ ස්පීකර් ලේබල් සමඟ නිවැරදි පෙළ බවට පරිවර්තනය කරන්න.",

    // Audio Uploader
    uploaderTitle: "ඕනෑම ශ්‍රව්‍ය ගොනුවක් මෙතැනට ඇද දමන්න",
    uploaderSubtitle: "MP3, WAV, M4A, FLAC, OGG, AAC සඳහා සහය දක්වයි (උපරිම 100MB)",
    browseFiles: "ශ්‍රව්‍ය ගොනු තෝරන්න",
    orRecordLive: "නැතහොත් සජීවී මයික්‍රෆෝනයෙන් පටිගත කරන්න",
    startRecording: "පටිගත කිරීම අරඹන්න",
    stopRecording: "පටිගත කිරීම නවත්වන්න",
    recordingActive: "සජීවී ශ්‍රව්‍ය පටිගත වෙමින් පවතී...",
    trySampleAudio: "ආදර්ශ ශ්‍රව්‍ය ගොනුවක් අත්හදා බලන්න",
    sampleSinhalaEnglish: "සිංහල + ඉංග්‍රීසි ආදර්ශය",
    sampleMeeting: "කණ්ඩායම් රැස්වීම් ආදර්ශය",
    selectedAudio: "තෝරාගත් ශ්‍රව්‍ය ගොනුව",
    removeFile: "ගොනුව ඉවත් කරන්න",

    // Spoken Languages Card
    spokenLanguagesTitle: "හඳුනාගැනීම සඳහා කතා කරන භාෂා",
    spokenLanguagesDesc: "ස්වයංක්‍රීය හඳුනාගැනීමේ නිවැරදිභාවය වැඩි දියුණු කිරීමට භාෂා තෝරන්න",
    searchLanguages: "භාෂා සොයන්න...",
    addLanguage: "භාෂාවක් එකතු කරන්න",
    selectedLanguagesLabel: "සක්‍රීය හඳුනාගැනීමේ භාෂා",

    // Transcription Options
    optionsTitle: "පිටපත් කිරීමේ ආකාරය සහ AI විකල්ප",
    modeVerbatim: "වචනයෙන් වචනය (Verbatim)",
    modeVerbatimDesc: "සියලු වචන සහ ශබ්ද සහිත සෘජු පිටපත",
    modeCleaned: "පිරිසිදු කළ පිටපත (Cleaned)",
    modeCleanedDesc: "ව්‍යාකරණ නිවැරදි කළ, පිරිසිදු පෙළ පිටපත",
    modeDiarized: "කතාබස් කරන්නන් වෙන්කිරීම (Diarized)",
    modeDiarizedDesc: "කතා කරන පුද්ගලයා සහ වේලාව සමඟ පිටපත් කිරීම",
    modeSummary: "විධායක සාරාංශය (Summary)",
    modeSummaryDesc: "ප්‍රධාන මාතෘකා සහ ක්‍රියාකාරී පියවරයන්ගේ සාරාංශය",
    modeTranslate: "පරිවර්තනය (Translate)",
    modeTranslateDesc: "තෝරාගත් භාෂාවට කෙලින්ම පරිවර්තනය කරන්න",
    modeSubtitles: "උපසිරැසි (SRT)",
    modeSubtitlesDesc: "SRT / VTT උපසිරැසි ගොනු සාදන්න",
    modeCustom: "අභිරුචි විධානය (Custom Prompt)",
    modeCustomDesc: "ඔබේම AI උපදෙස් ලබා දෙන්න",
    targetLanguageLabel: "ප්‍රතිදාන භාෂාව",
    customPromptLabel: "අභිරුචි AI උපදෙස",
    customPromptPlaceholder: "උදා: සිංහලෙන් පිටපත් කර ප්‍රධාන ප්‍රශ්න ඉස්මතු කරන්න...",
    startTranscribing: "ජෙමිනි 3.5 හරහා පිටපත් කිරීම අරඹන්න",
    processingAudio: "ශ්‍රව්‍ය පිටපත් වෙමින් පවතී...",

    // Transcript Viewer
    tabTranscript: "සම්පූර්ණ පිටපත",
    tabSummary: "විධායක සාරාංශය",
    tabAnalytics: "විශ්ලේෂණ සහ ප්‍රස්තාර",
    tabAskAI: "AI සහායකගෙන් අසන්න",
    copyText: "පෙළ පිටපත් කරන්න",
    copied: "පිටපත් විය!",
    export: "බාගන්න (Export)",
    searchText: "පිටපත තුළ සොයන්න...",
    edit: "සංස්කරණය",
    save: "සුරකින්න",
    cancel: "අවලංගු කරන්න",
    wordCount: "වචන ගණන",
    detectedLang: "හඳුනාගත් භාෂාව",
    confidence: "විශ්වාසනීයත්වය",
    keyTopics: "ප්‍රධාන මාතෘකා",
    actionItems: "ක්‍රියාකාරී පියවර",

    // Dashboard Statistics
    analyticsTitle: "දෘශ්‍ය විශ්ලේෂණ සහ සංඛ්‍යාලේඛන",
    analyticsSubtitle: "වචන සංඛ්‍යාතය සහ කතාබස් කාලරේඛා ප්‍රස්තාර",
    totalWords: "මුළු වචන",
    uniqueVocab: "අද්විතීය වචන",
    vocabRichness: "වචන සප්‍රමාණතාව",
    activeSpeakers: "සක්‍රීය කතාබස්කරන්නන්",
    timelineTitle: "කතාබස් කාලරේඛා බෙදාහැරීම",
    keywordTitle: "ප්‍රධාන වචන සංඛ්‍යාතය",
    speakerShareTitle: "කතාබස් පංගුව",

    // Footer
    footerText: "TranscribeX AI එන්ජිම · සයිබර්පන්ක් සංස්කරණය"
  },

  ta: {
    // Header
    headerTitle: "TranscribeX",
    headerSubtitle: "பல்மொழி ஆடியோ உரைபெயர்ப்பு மற்றும் AI பகுப்பாய்வு இயந்திரம்",
    shortcuts: "குறுக்குவழிகள்",
    history: "வரலாறு",

    // Hero Lockup
    engineBadge: "ஜெமினி 3.5 பல்மொழி உரைபெயர்ப்பு இயந்திரம்",
    heroTitle: "TranscribeX",
    heroTagline: "மேம்பட்ட AI ஆடியோ உரைபெயர்ப்பு இயந்திரம். குரல் குறிப்புகள் மற்றும் சந்திப்புகளை துல்லியமான உரையாக மாற்றவும்.",

    // Audio Uploader
    uploaderTitle: "ஆடியோ கோப்பை இங்கே இழுத்து இடவும்",
    uploaderSubtitle: "MP3, WAV, M4A, FLAC, OGG, AAC ஆதரவு (அதிகபட்சம் 100MB)",
    browseFiles: "ஆடியோ கோப்புகளைத் தேர்ந்தெடுக்கவும்",
    orRecordLive: "அல்லது நேரடி மைக்ரோஃபோனை பதிவு செய்யவும்",
    startRecording: "பதிவைத் தொடங்கு",
    stopRecording: "பதிவை நிறுத்து",
    recordingActive: "நேரலை ஆடியோ பதிவு செய்யப்படுகிறது...",
    trySampleAudio: "மாதிரி ஆடியோவை முயற்சிக்கவும்",
    sampleSinhalaEnglish: "சிங்களம் + ஆங்கில மாதிரி",
    sampleMeeting: "குழு கூட்ட மாதிரி",
    selectedAudio: "தேர்ந்தெடுக்கப்பட்ட ஆடியோ கோப்பு",
    removeFile: "கோப்பை நீக்கு",

    // Spoken Languages Card
    spokenLanguagesTitle: "கண்டறிதலுக்கான மொழிகள்",
    spokenLanguagesDesc: "துல்லியமான கண்டறிதலுக்கு எதிர்பார்க்கப்படும் மொழிகளைக் குறிப்பிடவும்",
    searchLanguages: "மொழிகளைத் தேடுங்கள்...",
    addLanguage: "மொழியைச் சேர்",
    selectedLanguagesLabel: "செயலில் உள்ள மொழிகள்",

    // Transcription Options
    optionsTitle: "உரைபெயர்ப்பு முறை & AI விருப்பங்கள்",
    modeVerbatim: "அப்படியே (Verbatim)",
    modeVerbatimDesc: "அனைத்து சொற்களையும் உள்ளடக்கிய நேரடி உரை",
    modeCleaned: "சுத்திகரிக்கப்பட்ட (Cleaned)",
    modeCleanedDesc: "இலக்கண பிழைகள் சரிசெய்யப்பட்ட உரை",
    modeDiarized: "பேச்சாளர் அடையாளம் (Diarized)",
    modeDiarizedDesc: "பேச்சாளர்கள் மற்றும் நேரக் குறியீடுகளுடன்",
    modeSummary: "நிர்வாக சுருக்கம் (Summary)",
    modeSummaryDesc: "முக்கிய தலைப்புகள் மற்றும் சுருக்கம்",
    modeTranslate: "மொழிபெயர்ப்பு (Translate)",
    modeTranslateDesc: "இலக்கு மொழிக்கு நேரடியாக மொழிபெயர்க்கவும்",
    modeSubtitles: "துணைத்தலைப்புகள் (SRT)",
    modeSubtitlesDesc: "SRT / VTT வசனக் கோப்புகளை உருவாக்குங்கள்",
    modeCustom: "தனிப்பயன் கட்டளை",
    modeCustomDesc: "உங்கள் சொந்த AI வழிமுறையை வழங்கவும்",
    targetLanguageLabel: "வெளியீட்டு மொழி",
    customPromptLabel: "தனிப்பயன் AI கட்டளை",
    customPromptPlaceholder: "எ.கா. தமிழில் உரைபெயர்த்து முக்கிய புள்ளிகளை முன்னிலைப்படுத்தவும்...",
    startTranscribing: "ஜெமினி 3.5 உடன் உரைபெயர்ப்பைத் தொடங்குங்கள்",
    processingAudio: "ஆடியோ உரைபெயர்க்கப்படுகிறது...",

    // Transcript Viewer
    tabTranscript: "முழு உரை",
    tabSummary: "நிர்வாக சுருக்கம்",
    tabAnalytics: "பகுப்பாய்வு & வரைபடங்கள்",
    tabAskAI: "AI உதவியாளரிடம் கேளுங்கள்",
    copyText: "உரையை நகலெடு",
    copied: "நகலெடுக்கப்பட்டது!",
    export: "பதிவிறக்கு (Export)",
    searchText: "உரையில் தேடுங்கள்...",
    edit: "திருத்து",
    save: "சேமி",
    cancel: "ரத்து செய்",
    wordCount: "சொற்களின் எண்ணிக்கை",
    detectedLang: "கண்டறியப்பட்ட மொழி",
    confidence: "நம்பகத்தன்மை",
    keyTopics: "முக்கிய தலைப்புகள்",
    actionItems: "செயல்பாடுகள்",

    // Dashboard Statistics
    analyticsTitle: "காட்சி பகுப்பாய்வு & புள்ளிவிவரங்கள்",
    analyticsSubtitle: "சொல் அதிர்வெண் மற்றும் பேச்சாளர் காலவரிசை வரைபடங்கள்",
    totalWords: "மொத்த சொற்கள்",
    uniqueVocab: "தனித்துவ சொற்கள்",
    vocabRichness: "சொல் வளம்",
    activeSpeakers: "செயலில் உள்ள பேச்சாளர்கள்",
    timelineTitle: "பேச்சாளர் காலவரிசை விநியோகம்",
    keywordTitle: "முக்கிய சொல் அதிர்வெண்",
    speakerShareTitle: "பேச்சாளர் பங்கு",

    // Footer
    footerText: "TranscribeX AI இயந்திரம் · சைபர்பங்க் பதிப்பு"
  },

  es: {
    // Header
    headerTitle: "TranscribeX",
    headerSubtitle: "Motor de Transcripción e Inteligencia de Audio Multilingüe",
    shortcuts: "Atajos",
    history: "Historial",

    // Hero Lockup
    engineBadge: "MOTOR TRANSCRIBIDOR MULTILINGÜE GEMINI 3.5",
    heroTitle: "TranscribeX",
    heroTagline: "Motor de transcripción e inteligencia de audio IA de nivel empresarial. Convierte notas de voz y reuniones en texto preciso con detección multilingüe.",

    // Audio Uploader
    uploaderTitle: "Arrastra y suelta cualquier archivo de audio",
    uploaderSubtitle: "Soporta MP3, WAV, M4A, FLAC, OGG, AAC (Máx 100MB)",
    browseFiles: "Buscar archivos de audio",
    orRecordLive: "O GRABA CON EL MICRÓFONO EN VIVO",
    startRecording: "Iniciar grabación",
    stopRecording: "Detener grabación",
    recordingActive: "Grabando audio en vivo...",
    trySampleAudio: "Probar audio de demostración",
    sampleSinhalaEnglish: "Demo Cingalés + Inglés",
    sampleMeeting: "Demo Reunión de Equipo",
    selectedAudio: "Archivo de audio seleccionado",
    removeFile: "Eliminar archivo",

    // Spoken Languages Card
    spokenLanguagesTitle: "Idiomas hablados para detección",
    spokenLanguagesDesc: "Especifica idiomas previstos para mejorar la precisión",
    searchLanguages: "Buscar idiomas...",
    addLanguage: "Añadir idioma",
    selectedLanguagesLabel: "Objetivos de detección activos",

    // Transcription Options
    optionsTitle: "Modo de transcripción y opciones IA",
    modeVerbatim: "Literal (Verbatim)",
    modeVerbatimDesc: "Transcripción exacta incluyendo muletillas",
    modeCleaned: "Limpio (Cleaned)",
    modeCleanedDesc: "Texto pulido con muletillas eliminadas",
    modeDiarized: "Diarización de hablantes",
    modeDiarizedDesc: "Con identificación de hablantes y marcas de tiempo",
    modeSummary: "Resumen ejecutivo",
    modeSummaryDesc: "Puntos clave y lista de tareas",
    modeTranslate: "Traducción",
    modeTranslateDesc: "Traducir directamente al idioma de destino",
    modeSubtitles: "Subtítulos (SRT)",
    modeSubtitlesDesc: "Generar archivos SRT / VTT",
    modeCustom: "Indicación personalizada",
    modeCustomDesc: "Proporciona tus propias instrucciones IA",
    targetLanguageLabel: "Idioma de salida de destino",
    customPromptLabel: "Instrucción IA personalizada",
    customPromptPlaceholder: "Ej. Transcribe en español y destaca las preguntas clave...",
    startTranscribing: "Transcribir audio con Gemini 3.5",
    processingAudio: "Transcribiendo audio...",

    // Transcript Viewer
    tabTranscript: "Transcripción completa",
    tabSummary: "Resumen ejecutivo",
    tabAnalytics: "Análisis y gráficos",
    tabAskAI: "Preguntar al asistente IA",
    copyText: "Copiar texto",
    copied: "¡Copiado!",
    export: "Exportar",
    searchText: "Buscar en la transcripción...",
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
    wordCount: "Palabras",
    detectedLang: "Idioma detectado",
    confidence: "Confianza",
    keyTopics: "Temas clave",
    actionItems: "Acciones pendientes",

    // Dashboard Statistics
    analyticsTitle: "Análisis visual y estadísticas",
    analyticsSubtitle: "Gráficos de frecuencia de palabras y cronología de hablantes",
    totalWords: "Total de palabras",
    uniqueVocab: "Vocabulario único",
    vocabRichness: "Riqueza de vocabulario",
    activeSpeakers: "Hablantes activos",
    timelineTitle: "Distribución cronológica de hablantes",
    keywordTitle: "Frecuencia de palabras clave",
    speakerShareTitle: "Cuota de intervención",

    // Footer
    footerText: "TranscribeX AI Engine · Edición Cyberpunk"
  },

  fr: {
    // Header
    headerTitle: "TranscribeX",
    headerSubtitle: "Moteur de Transcription et d'Intelligence Audio Multilingue",
    shortcuts: "Raccourcis",
    history: "Historique",

    // Hero Lockup
    engineBadge: "MOTEUR DE TRANSCRIPTION MULTILINGUE GEMINI 3.5",
    heroTitle: "TranscribeX",
    heroTagline: "Moteur de transcription audio IA professionnel. Convertissez les enregistrements vocaux et réunions en texte précis.",

    // Audio Uploader
    uploaderTitle: "Glissez et déposez n'importe quel fichier audio",
    uploaderSubtitle: "Prend en charge MP3, WAV, M4A, FLAC, OGG, AAC (Max 100 Mo)",
    browseFiles: "Parcourir les fichiers audio",
    orRecordLive: "OU ENREGISTREZ AVEC LE MICROPHONE EN DIRECT",
    startRecording: "Démarrer l'enregistrement",
    stopRecording: "Arrêter l'enregistrement",
    recordingActive: "Enregistrement audio en cours...",
    trySampleAudio: "Essayer un fichier audio démo",
    sampleSinhalaEnglish: "Démo Cinghalais + Anglais",
    sampleMeeting: "Démo Réunion d'Équipe",
    selectedAudio: "Fichier audio sélectionné",
    removeFile: "Supprimer le fichier",

    // Spoken Languages Card
    spokenLanguagesTitle: "Langues parlées à détecter",
    spokenLanguagesDesc: "Spécifiez les langues attendues pour améliorer la précision",
    searchLanguages: "Rechercher des langues...",
    addLanguage: "Ajouter une langue",
    selectedLanguagesLabel: "Langues actives",

    // Transcription Options
    optionsTitle: "Mode de transcription & options IA",
    modeVerbatim: "Mot à mot (Verbatim)",
    modeVerbatimDesc: "Transcription exacte incluant les hésitations",
    modeCleaned: "Nettoyé (Cleaned)",
    modeCleanedDesc: "Texte fluide sans hésitations",
    modeDiarized: "Diarisation des intervenants",
    modeDiarizedDesc: "Avec identification des locuteurs et horodatage",
    modeSummary: "Résumé exécutif",
    modeSummaryDesc: "Points clés et actions à entreprendre",
    modeTranslate: "Traduction",
    modeTranslateDesc: "Traduire directement vers la langue cible",
    modeSubtitles: "Sous-titres (SRT)",
    modeSubtitlesDesc: "Générer des fichiers de sous-titres SRT / VTT",
    modeCustom: "Instruction personnalisée",
    modeCustomDesc: "Fournissez votre propre consigne IA",
    targetLanguageLabel: "Langue de sortie",
    customPromptLabel: "Consigne IA personnalisée",
    customPromptPlaceholder: "Ex: Transcrire en français et surligner les questions importantes...",
    startTranscribing: "Transcrire l'audio avec Gemini 3.5",
    processingAudio: "Transcription en cours...",

    // Transcript Viewer
    tabTranscript: "Transcription complète",
    tabSummary: "Résumé exécutif",
    tabAnalytics: "Analyses & Graphiques",
    tabAskAI: "Demander à l'assistant IA",
    copyText: "Copier le texte",
    copied: "Copié !",
    export: "Exporter",
    searchText: "Rechercher dans la transcription...",
    edit: "Modifier",
    save: "Enregistrer",
    cancel: "Annuler",
    wordCount: "Mots",
    detectedLang: "Langue détectée",
    confidence: "Confiance",
    keyTopics: "Sujets clés",
    actionItems: "Actions à réaliser",

    // Dashboard Statistics
    analyticsTitle: "Analyses visuelles et statistiques",
    analyticsSubtitle: "Graphiques de fréquence des mots et chronologie des locuteurs",
    totalWords: "Total des mots",
    uniqueVocab: "Vocabulaire unique",
    vocabRichness: "Richesse du vocabulaire",
    activeSpeakers: "Locuteurs actifs",
    timelineTitle: "Chronologie des intervenants",
    keywordTitle: "Fréquence des mots clés",
    speakerShareTitle: "Répartition du temps de parole",

    // Footer
    footerText: "TranscribeX AI Engine · Édition Cyberpunk"
  },

  ja: {
    // Header
    headerTitle: "TranscribeX",
    headerSubtitle: "多言語音声文字起こし＆AIインテリジェンスエンジン",
    shortcuts: "ショートカット",
    history: "履歴",

    // Hero Lockup
    engineBadge: "GEMINI 3.5 多言語文字起こしエンジン",
    heroTitle: "TranscribeX",
    heroTagline: "エンタープライズグレードのAI音声文字起こしエンジン。音声メモや会議を高精度なテキストに変換します。",

    // Audio Uploader
    uploaderTitle: "音声ファイルをドラッグ＆ドロップ",
    uploaderSubtitle: "MP3, WAV, M4A, FLAC, OGG, AAC 対応（最大100MB）",
    browseFiles: "音声ファイルを選択",
    orRecordLive: "またはマイクでリアルタイム録音",
    startRecording: "録音開始",
    stopRecording: "録音停止",
    recordingActive: "リアルタイム録音中...",
    trySampleAudio: "デモ用音声を試す",
    sampleSinhalaEnglish: "シンハラ語＋英語デモ",
    sampleMeeting: "チームミーティングデモ",
    selectedAudio: "選択された音声ファイル",
    removeFile: "ファイルを削除",

    // Spoken Languages Card
    spokenLanguagesTitle: "検出対象言語",
    spokenLanguagesDesc: "自動検出精度向上のための言語選択",
    searchLanguages: "言語を検索...",
    addLanguage: "言語を追加",
    selectedLanguagesLabel: "アクティブな検出言語",

    // Transcription Options
    optionsTitle: "文字起こしモード＆AIオプション",
    modeVerbatim: "逐語的（Verbatim）",
    modeVerbatimDesc: "言い淀みを含む正確な全文字起こし",
    modeCleaned: "整文（Cleaned）",
    modeCleanedDesc: "フィラーを除去した読みやすい文章",
    modeDiarized: "話者分離（Diarized）",
    modeDiarizedDesc: "話者識別とタイムスタンプ付き",
    modeSummary: "要約（Summary）",
    modeSummaryDesc: "要点とアクションアイテムの抽出し要約",
    modeTranslate: "翻訳（Translate）",
    modeTranslateDesc: "指定したターゲット言語へ直接翻訳",
    modeSubtitles: "字幕（SRT）",
    modeSubtitlesDesc: "SRT / VTT字幕ファイルを生成",
    modeCustom: "カスタムプロンプト",
    modeCustomDesc: "独自のAI指示を入力",
    targetLanguageLabel: "出力言語",
    customPromptLabel: "カスタムAIプロンプト",
    customPromptPlaceholder: "例：日本語で文字起こしし、重要質問を強調...",
    startTranscribing: "Gemini 3.5で文字起こし開始",
    processingAudio: "文字起こし処理中...",

    // Transcript Viewer
    tabTranscript: "全文テキスト",
    tabSummary: "要約サマリー",
    tabAnalytics: "分析＆グラフ",
    tabAskAI: "AIアシスタントに質問",
    copyText: "テキストをコピー",
    copied: "コピー完了！",
    export: "エクスポート",
    searchText: "文字起こし内を検索...",
    edit: "編集",
    save: "保存",
    cancel: "キャンセル",
    wordCount: "単語数",
    detectedLang: "検出言語",
    confidence: "信頼度",
    keyTopics: "主要トピック",
    actionItems: "アクションアイテム",

    // Dashboard Statistics
    analyticsTitle: "ビジュアル分析＆統計",
    analyticsSubtitle: "単語頻度分布と話者タイムライン",
    totalWords: "総単語数",
    uniqueVocab: "語彙数",
    vocabRichness: "語彙の豊富さ",
    activeSpeakers: "話者数",
    timelineTitle: "話者タイムライン分布",
    keywordTitle: "キーワード頻度分布",
    speakerShareTitle: "話者発言割合",

    // Footer
    footerText: "TranscribeX AI エンジン · サイバーパンク版"
  },

  de: {
    // Header
    headerTitle: "TranscribeX",
    headerSubtitle: "Mehrsprachige KI-Audiotranskriptions-Engine",
    shortcuts: "Tastenkürzel",
    history: "Verlauf",

    // Hero Lockup
    engineBadge: "GEMINI 3.5 MEHRSPRACHIGE TRANSKRIPTIONS-ENGINE",
    heroTitle: "TranscribeX",
    heroTagline: "Professionelle KI-Engine für Audiotranskription. Verwandeln Sie Sprachnotizen und Meetings in präzisen Text.",

    // Audio Uploader
    uploaderTitle: "Audiodatei hierher ziehen",
    uploaderSubtitle: "Unterstützt MP3, WAV, M4A, FLAC, OGG, AAC (Max 100MB)",
    browseFiles: "Audiodateien durchsuchen",
    orRecordLive: "ODER LIVE-MIKROFON AUFNEHMEN",
    startRecording: "Aufnahme starten",
    stopRecording: "Aufnahme stoppen",
    recordingActive: "Live-Audio wird aufgenommen...",
    trySampleAudio: "Demosignal testen",
    sampleSinhalaEnglish: "Demo Singhalesisch + Englisch",
    sampleMeeting: "Demo Team-Meeting",
    selectedAudio: "Ausgewählte Audiodatei",
    removeFile: "Datei entfernen",

    // Spoken Languages Card
    spokenLanguagesTitle: "Gesprochene Sprachen zur Erkennung",
    spokenLanguagesDesc: "Sprachen festlegen für präzisere Erkennung",
    searchLanguages: "Sprachen suchen...",
    addLanguage: "Sprache hinzufügen",
    selectedLanguagesLabel: "Aktive Erkennungssprachen",

    // Transcription Options
    optionsTitle: "Transkriptionsmodus & KI-Optionen",
    modeVerbatim: "Wortgetreu (Verbatim)",
    modeVerbatimDesc: "Exakte Transkription inklusive Füllwörter",
    modeCleaned: "Bereinigt (Cleaned)",
    modeCleanedDesc: "Optimierter Text ohne Füllwörter",
    modeDiarized: "Sprechererkennung",
    modeDiarizedDesc: "Mit Sprecherzuordnung und Zeitstempeln",
    modeSummary: "Zusammenfassung",
    modeSummaryDesc: "Wichtigste Themen & Aufgabenliste",
    modeTranslate: "Übersetzung",
    modeTranslateDesc: "Direkt in die Zielsprache übersetzen",
    modeSubtitles: "Untertitel (SRT)",
    modeSubtitlesDesc: "SRT / VTT Untertiteldateien erstellen",
    modeCustom: "Benutzerdefiniert",
    modeCustomDesc: "Eigene KI-Anweisungen angeben",
    targetLanguageLabel: "Zielsprache",
    customPromptLabel: "Eigene KI-Anweisung",
    customPromptPlaceholder: "z.B. Auf Deutsch transkribieren und Wichtiges hervorheben...",
    startTranscribing: "Mit Gemini 3.5 transkribieren",
    processingAudio: "Audio wird transkribiert...",

    // Transcript Viewer
    tabTranscript: "Gesamtes Transkript",
    tabSummary: "Zusammenfassung",
    tabAnalytics: "Analysen & Diagramme",
    tabAskAI: "KI-Assistent fragen",
    copyText: "Text kopieren",
    copied: "Kopiert!",
    export: "Exportieren",
    searchText: "Im Transkript suchen...",
    edit: "Bearbeiten",
    save: "Speichern",
    cancel: "Abbrechen",
    wordCount: "Wörter",
    detectedLang: "Erkannte Sprache",
    confidence: "Genauigkeit",
    keyTopics: "Hauptthemen",
    actionItems: "Aufgaben",

    // Dashboard Statistics
    analyticsTitle: "Visuelle Analysen & Statistiken",
    analyticsSubtitle: "Wortfrequenz und Sprecher-Zeitleiste",
    totalWords: "Gesamtwörter",
    uniqueVocab: "Eindeutige Wörter",
    vocabRichness: "Wortschatzreichtum",
    activeSpeakers: "Aktive Sprecher",
    timelineTitle: "Sprecher-Zeitleiste",
    keywordTitle: "Schlüsselwortfrequenz",
    speakerShareTitle: "Sprechanteil",

    // Footer
    footerText: "TranscribeX AI Engine · Cyberpunk Edition"
  },

  zh: {
    // Header
    headerTitle: "TranscribeX",
    headerSubtitle: "多语言语音转文字与AI智能分析引擎",
    shortcuts: "快捷键",
    history: "历史记录",

    // Hero Lockup
    engineBadge: "GEMINI 3.5 多语言转录引擎",
    heroTitle: "TranscribeX",
    heroTagline: "企业级AI语音转文字与智能分析引擎。将语音备忘录、会议录音高精度转换为文本，支持多语言自动检测与说话人辨识。",

    // Audio Uploader
    uploaderTitle: "拖放音频文件至此处",
    uploaderSubtitle: "支持 MP3, WAV, M4A, FLAC, OGG, AAC（最大 100MB）",
    browseFiles: "浏览音频文件",
    orRecordLive: "或使用麦克风实时录音",
    startRecording: "开始录音",
    stopRecording: "停止录音",
    recordingActive: "正在实时录音...",
    trySampleAudio: "尝试示例音频",
    sampleSinhalaEnglish: "僧伽罗语 + 英语示例",
    sampleMeeting: "团队会议示例",
    selectedAudio: "已选择的音频文件",
    removeFile: "移除文件",

    // Spoken Languages Card
    spokenLanguagesTitle: "检测语种设置",
    spokenLanguagesDesc: "指定预期语言以提高自动识别精度",
    searchLanguages: "搜索语言...",
    addLanguage: "添加语言",
    selectedLanguagesLabel: "已启用的检测语言",

    // Transcription Options
    optionsTitle: "转录模式与AI选项",
    modeVerbatim: "逐字转录 (Verbatim)",
    modeVerbatimDesc: "保留所有语气词与原话的完整转录",
    modeCleaned: "润色整理 (Cleaned)",
    modeCleanedDesc: "去除语气词并修正语法的流畅文本",
    modeDiarized: "说话人识别 (Diarized)",
    modeDiarizedDesc: "带时间戳与说话人身份标记",
    modeSummary: "执行摘要 (Summary)",
    modeSummaryDesc: "提炼核心议题、摘要与待办事项",
    modeTranslate: "语言翻译 (Translate)",
    modeTranslateDesc: "直接转录并翻译为目标语言",
    modeSubtitles: "字幕生成 (SRT)",
    modeSubtitlesDesc: "生成带时间轴的 SRT / VTT 字幕文件",
    modeCustom: "自定义提示词",
    modeCustomDesc: "输入您自定义的 AI 处理指令",
    targetLanguageLabel: "目标输出语言",
    customPromptLabel: "自定义 AI 指令",
    customPromptPlaceholder: "例如：用中文转录并重点标记关键提问...",
    startTranscribing: "使用 Gemini 3.5 开始转录",
    processingAudio: "正在转录音频...",

    // Transcript Viewer
    tabTranscript: "完整转录文本",
    tabSummary: "执行摘要",
    tabAnalytics: "图表与数据分析",
    tabAskAI: "咨询 AI 助手",
    copyText: "复制文本",
    copied: "已复制！",
    export: "导出文件",
    searchText: "在转录文本中搜索...",
    edit: "编辑",
    save: "保存",
    cancel: "取消",
    wordCount: "总字数",
    detectedLang: "检测到的语言",
    confidence: "置信度",
    keyTopics: "核心议题",
    actionItems: "待办事项",

    // Dashboard Statistics
    analyticsTitle: "可视化数据分析与统计",
    analyticsSubtitle: "词频分布图表与说话人时间轴",
    totalWords: "总词数",
    uniqueVocab: "独立词汇数",
    vocabRichness: "词汇丰富度",
    activeSpeakers: "说话人数量",
    timelineTitle: "说话人时间轴分布",
    keywordTitle: "高频关键词分布",
    speakerShareTitle: "说话人发言占比",

    // Footer
    footerText: "TranscribeX AI 引擎 · 赛博朋克版"
  }
};
