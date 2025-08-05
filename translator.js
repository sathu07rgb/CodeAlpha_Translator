// Translation functionality using Google Translate API
// This uses a free translation API service

class WebTranslator {
    constructor() {
        this.apiUrl = 'https://api.mymemory.translated.net/get';
        this.fallbackApiUrl = 'https://translate.googleapis.com/translate_a/single';
        this.isTranslating = false;
        this.translationHistory = [];

        // Initialize speech synthesis
        this.speechSynthesis = window.speechSynthesis;
        this.speechVoices = [];

        this.loadVoices();
    }

    // Load available speech voices
    loadVoices() {
        if (this.speechSynthesis) {
            this.speechVoices = this.speechSynthesis.getVoices();

            // Load voices when they become available
            this.speechSynthesis.onvoiceschanged = () => {
                this.speechVoices = this.speechSynthesis.getVoices();
            };
        }
    }

    // Detect language of text
    async detectLanguage(text) {
        if (!text || text.trim().length === 0) {
            return { language: 'auto', confidence: 0 };
        }

        try {
            // Simple language detection based on character patterns
            const detectedLang = this.simpleLanguageDetection(text);
            return { language: detectedLang, confidence: 0.8 };
        } catch (error) {
            console.error('Language detection failed:', error);
            return { language: 'auto', confidence: 0 };
        }
    }

    // Simple language detection based on character patterns
    simpleLanguageDetection(text) {
        const cleanText = text.toLowerCase().trim();

        // Chinese characters
        if (/[\u4e00-\u9fff]/.test(text)) return 'zh';

        // Japanese characters (Hiragana, Katakana, Kanji)
        if (/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/.test(text)) return 'ja';

        // Korean characters
        if (/[\uac00-\ud7af]/.test(text)) return 'ko';

        // Arabic characters
        if (/[\u0600-\u06ff]/.test(text)) return 'ar';

        // Russian/Cyrillic characters
        if (/[\u0400-\u04ff]/.test(text)) return 'ru';

        // Greek characters
        if (/[\u0370-\u03ff]/.test(text)) return 'el';

        // Common word patterns for European languages
        const patterns = {
            es: /\b(el|la|de|en|y|a|es|un|una|por|con|no|se|te|lo|le|da|su|ese|esta|como|pero|mas|todo|bien|mas|muy|tiempo|casa|vida|mundo|año|dia|hombre|vez)\b/g,
            fr: /\b(le|de|et|un|il|être|et|en|avoir|que|pour|dans|ce|son|une|sur|avec|ne|se|pas|tout|plus|pouvoir|par|je|son|que|qui|sa|faire|du|le)\b/g,
            de: /\b(der|die|und|in|den|von|zu|das|mit|sich|des|auf|für|ist|im|dem|nicht|ein|eine|als|auch|es|an|werden|aus|er|hat|dass)\b/g,
            it: /\b(il|di|che|e|la|per|un|in|con|del|da|a|al|le|si|dei|nel|della|alla|anche|come|lo|se|più|ma|tutti|dal|sul|essere|fare|dire)\b/g,
            pt: /\b(o|de|a|e|do|da|em|um|para|com|não|uma|os|no|se|na|por|mais|as|dos|como|mas|foi|ao|ele|das|tem|à|seu|sua|ou|ser|quando)\b/g
        };

        let maxMatches = 0;
        let detectedLang = 'en';

        for (const [lang, pattern] of Object.entries(patterns)) {
            const matches = (cleanText.match(pattern) || []).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedLang = lang;
            }
        }

        return maxMatches > 0 ? detectedLang : 'en';
    }

    // Translate text using MyMemory API (free tier)
    async translateText(text, sourceLang = 'auto', targetLang = 'en') {
        if (!text || text.trim().length === 0) {
            throw new Error('No text provided for translation');
        }

        if (sourceLang === targetLang && sourceLang !== 'auto') {
            return {
                translatedText: text,
                sourceLang: sourceLang,
                targetLang: targetLang,
                confidence: 1.0
            };
        }

        this.isTranslating = true;

        try {
            // First try MyMemory API
            const result = await this.translateWithMyMemory(text, sourceLang, targetLang);
            this.addToHistory(text, result.translatedText, sourceLang, targetLang);
            return result;
        } catch (error) {
            console.error('MyMemory API failed, trying fallback:', error);

            try {
                // Fallback to alternative translation method
                const result = await this.translateWithFallback(text, sourceLang, targetLang);
                this.addToHistory(text, result.translatedText, sourceLang, targetLang);
                return result;
            } catch (fallbackError) {
                console.error('All translation methods failed:', fallbackError);
                throw new Error('Translation service unavailable. Please try again later.');
            }
        } finally {
            this.isTranslating = false;
        }
    }

    // Translate using MyMemory API
    async translateWithMyMemory(text, sourceLang, targetLang) {
        const langPair = sourceLang === 'auto' ? `autodetect|${targetLang}` : `${sourceLang}|${targetLang}`;
        const url = `${this.apiUrl}?q=${encodeURIComponent(text)}&langpair=${langPair}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.responseStatus === 200) {
            return {
                translatedText: data.responseData.translatedText,
                sourceLang: data.responseData.match ? data.responseData.match.split('|')[0] : sourceLang,
                targetLang: targetLang,
                confidence: data.responseData.match ? parseFloat(data.responseData.match.split('|')[1]) : 0.8
            };
        } else {
            throw new Error('Translation failed: ' + (data.responseDetails || 'Unknown error'));
        }
    }

    // Fallback translation method using simple word replacement for demo
    async translateWithFallback(text, sourceLang, targetLang) {
        // This is a simple fallback for demonstration
        // In a real application, you would use another translation service

        const commonTranslations = {
            'hello': { es: 'hola', fr: 'bonjour', de: 'hallo', it: 'ciao', pt: 'olá', ru: 'привет', ja: 'こんにちは', ko: '안녕하세요', zh: '你好', ar: 'مرحبا' },
            'goodbye': { es: 'adiós', fr: 'au revoir', de: 'auf wiedersehen', it: 'addio', pt: 'tchau', ru: 'до свидания', ja: 'さようなら', ko: '안녕히 가세요', zh: '再见', ar: 'وداعا' },
            'thank you': { es: 'gracias', fr: 'merci', de: 'danke', it: 'grazie', pt: 'obrigado', ru: 'спасибо', ja: 'ありがとう', ko: '감사합니다', zh: '谢谢', ar: 'شكرا' },
            'please': { es: 'por favor', fr: 's\'il vous plaît', de: 'bitte', it: 'per favore', pt: 'por favor', ru: 'пожалуйста', ja: 'お願いします', ko: '제발', zh: '请', ar: 'من فضلك' },
            'yes': { es: 'sí', fr: 'oui', de: 'ja', it: 'sì', pt: 'sim', ru: 'да', ja: 'はい', ko: '네', zh: '是', ar: 'نعم' },
            'no': { es: 'no', fr: 'non', de: 'nein', it: 'no', pt: 'não', ru: 'нет', ja: 'いいえ', ko: '아니요', zh: '不', ar: 'لا' }
        };

        const lowerText = text.toLowerCase().trim();

        if (commonTranslations[lowerText] && commonTranslations[lowerText][targetLang]) {
            return {
                translatedText: commonTranslations[lowerText][targetLang],
                sourceLang: sourceLang === 'auto' ? 'en' : sourceLang,
                targetLang: targetLang,
                confidence: 0.9
            };
        }

        // If no translation found, return original with note
        return {
            translatedText: `[Translation not available] ${text}`,
            sourceLang: sourceLang === 'auto' ? 'en' : sourceLang,
            targetLang: targetLang,
            confidence: 0.1
        };
    }

    // Add translation to history
    addToHistory(originalText, translatedText, sourceLang, targetLang) {
        const historyItem = {
            id: Date.now(),
            originalText,
            translatedText,
            sourceLang,
            targetLang,
            timestamp: new Date().toISOString()
        };

        this.translationHistory.unshift(historyItem);

        // Keep only last 50 translations
        if (this.translationHistory.length > 50) {
            this.translationHistory = this.translationHistory.slice(0, 50);
        }

        // Save to localStorage
        try {
            localStorage.setItem('translationHistory', JSON.stringify(this.translationHistory));
        } catch (error) {
            console.warn('Could not save translation history:', error);
        }
    }

    // Load history from localStorage
    loadHistory() {
        try {
            const stored = localStorage.getItem('translationHistory');
            if (stored) {
                this.translationHistory = JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Could not load translation history:', error);
            this.translationHistory = [];
        }
    }

    // Get translation history
    getHistory() {
        return this.translationHistory;
    }

    // Clear translation history
    clearHistory() {
        this.translationHistory = [];
        try {
            localStorage.removeItem('translationHistory');
        } catch (error) {
            console.warn('Could not clear translation history:', error);
        }
    }

    // Text-to-speech functionality
    speak(text, lang = 'en') {
        if (!this.speechSynthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        this.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Find a voice for the specified language
        const voice = this.speechVoices.find(v => v.lang.startsWith(lang));
        if (voice) {
            utterance.voice = voice;
        }

        utterance.lang = lang;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Handle errors
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
        };

        this.speechSynthesis.speak(utterance);
    }

    // Stop speech
    stopSpeaking() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
    }

    // Check if currently translating
    isCurrentlyTranslating() {
        return this.isTranslating;
    }

    // Get supported languages (from our languages.js file)
    getSupportedLanguages() {
        return typeof LANGUAGES !== 'undefined' ? LANGUAGES : {};
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebTranslator;
}