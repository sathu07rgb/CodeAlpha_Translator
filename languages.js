// Language codes and names for the translator
// Based on Google Translate supported languages

const LANGUAGES = {
    'auto': 'Detect Language',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh': 'Chinese',
    'zh-cn': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'he': 'Hebrew',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'or': 'Odia',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'ug': 'Uyghur',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
};

// Popular languages for quick access
const POPULAR_LANGUAGES = [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh-cn', 'zh-tw', 'ar', 'hi', 'th', 'vi', 'tr'
];

// Language groups for better organization
const LANGUAGE_GROUPS = {
    'Popular': ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh-cn', 'ar', 'hi'],
    'European': ['bg', 'hr', 'cs', 'da', 'nl', 'et', 'fi', 'el', 'hu', 'is', 'ga', 'lv', 'lt', 'mt', 'no', 'pl', 'ro', 'sk', 'sl', 'sv', 'uk'],
    'Asian': ['bn', 'my', 'km', 'gu', 'he', 'id', 'jw', 'kn', 'kk', 'ky', 'lo', 'ms', 'ml', 'mr', 'mn', 'ne', 'or', 'pa', 'fa', 'sd', 'si', 'ta', 'te', 'th', 'tr', 'ur', 'ug', 'uz', 'vi'],
    'African': ['af', 'am', 'ha', 'ig', 'mg', 'sm', 'sn', 'so', 'st', 'sw', 'xh', 'yo', 'zu'],
    'Other': ['sq', 'hy', 'az', 'eu', 'be', 'bs', 'ca', 'ceb', 'ny', 'co', 'eo', 'tl', 'fy', 'gl', 'ka', 'ht', 'haw', 'hmn', 'ku', 'la', 'lb', 'mk', 'mi', 'gd', 'sr', 'su', 'tg', 'cy', 'yi']
};

// Get language name by code
function getLanguageName(code) {
    return LANGUAGES[code] || code;
}

// Get all languages as array for dropdowns
function getLanguageOptions() {
    return Object.entries(LANGUAGES).map(([code, name]) => ({
        code,
        name,
        display: `${name} (${code})`
    }));
}

// Get popular languages
function getPopularLanguages() {
    return POPULAR_LANGUAGES.map(code => ({
        code,
        name: LANGUAGES[code],
        display: `${LANGUAGES[code]} (${code})`
    }));
}

// Check if language is supported
function isLanguageSupported(code) {
    return code in LANGUAGES;
}

// Get language group
function getLanguageGroup(code) {
    for (const [group, languages] of Object.entries(LANGUAGE_GROUPS)) {
        if (languages.includes(code)) {
            return group;
        }
    }
    return 'Other';
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LANGUAGES,
        POPULAR_LANGUAGES,
        LANGUAGE_GROUPS,
        getLanguageName,
        getLanguageOptions,
        getPopularLanguages,
        isLanguageSupported,
        getLanguageGroup
    };
}