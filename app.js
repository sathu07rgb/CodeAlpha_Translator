// Main application logic for the Universal Language Translator

class TranslatorApp {
    constructor() {
        this.translator = new WebTranslator();
        this.currentSourceLang = 'auto';
        this.currentTargetLang = 'en';
        this.isInitialized = false;

        // DOM elements
        this.elements = {};

        // Initialize the application
        this.init();
    }

    // Initialize the application
    async init() {
        try {
            this.bindElements();
            this.populateLanguageSelects();
            this.bindEventListeners();
            this.loadUserPreferences();
            this.translator.loadHistory();

            this.isInitialized = true;
            console.log('Translator app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize translator app:', error);
            this.showToast('Failed to initialize translator', 'error');
        }
    }

    // Bind DOM elements
    bindElements() {
        this.elements = {
            // Language selectors
            sourceLang: document.getElementById('sourceLang'),
            targetLang: document.getElementById('targetLang'),
            swapBtn: document.getElementById('swapBtn'),

            // Translation interface
            inputText: document.getElementById('inputText'),
            outputText: document.getElementById('outputText'),
            translateBtn: document.getElementById('translateBtn'),

            // Headers and info
            detectedLang: document.getElementById('detectedLang'),
            targetLangDisplay: document.getElementById('targetLangDisplay'),
            charCount: document.getElementById('charCount'),
            translationInfo: document.getElementById('translationInfo'),

            // Action buttons
            clearBtn: document.getElementById('clearBtn'),
            pasteBtn: document.getElementById('pasteBtn'),
            copyBtn: document.getElementById('copyBtn'),
            speakBtn: document.getElementById('speakBtn'),

            // Quick actions
            quickActionBtns: document.querySelectorAll('.quick-action-btn'),

            // UI elements
            loadingOverlay: document.getElementById('loadingOverlay'),
            toast: document.getElementById('toast'),
            modal: document.getElementById('modal'),
            modalTitle: document.getElementById('modalTitle'),
            modalBody: document.getElementById('modalBody'),

            // Mobile menu
            mobileMenuBtn: document.getElementById('mobileMenuBtn')
        };
    }

    // Populate language select dropdowns
    populateLanguageSelects() {
        const languages = getLanguageOptions();

        // Clear existing options (except auto-detect for source)
        this.elements.sourceLang.innerHTML = '<option value="auto">Detect Language</option>';
        this.elements.targetLang.innerHTML = '';

        // Add all languages to both selects
        languages.forEach(lang => {
            if (lang.code !== 'auto') {
                // Add to source language (all languages)
                const sourceOption = document.createElement('option');
                sourceOption.value = lang.code;
                sourceOption.textContent = lang.name;
                this.elements.sourceLang.appendChild(sourceOption);

                // Add to target language (all languages)
                const targetOption = document.createElement('option');
                targetOption.value = lang.code;
                targetOption.textContent = lang.name;
                this.elements.targetLang.appendChild(targetOption);
            }
        });

        // Set default selections
        this.elements.sourceLang.value = 'auto';
        this.elements.targetLang.value = 'en';
        this.updateTargetLanguageDisplay();
    }

    // Bind event listeners
    bindEventListeners() {
        // Language selection
        this.elements.sourceLang.addEventListener('change', (e) => {
            this.currentSourceLang = e.target.value;
            this.saveUserPreferences();
            this.updateDetectedLanguageDisplay();
        });

        this.elements.targetLang.addEventListener('change', (e) => {
            this.currentTargetLang = e.target.value;
            this.updateTargetLanguageDisplay();
            this.saveUserPreferences();
        });

        // Swap languages
        this.elements.swapBtn.addEventListener('click', () => {
            this.swapLanguages();
        });

        // Text input
        this.elements.inputText.addEventListener('input', (e) => {
            this.updateCharCount();
            this.detectLanguageFromInput();
        });

        this.elements.inputText.addEventListener('paste', () => {
            setTimeout(() => {
                this.updateCharCount();
                this.detectLanguageFromInput();
            }, 10);
        });

        // Translation
        this.elements.translateBtn.addEventListener('click', () => {
            this.translateText();
        });

        // Enter key to translate
        this.elements.inputText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.translateText();
            }
        });

        // Action buttons
        this.elements.clearBtn.addEventListener('click', () => {
            this.clearText();
        });

        this.elements.pasteBtn.addEventListener('click', () => {
            this.pasteText();
        });

        this.elements.copyBtn.addEventListener('click', () => {
            this.copyTranslation();
        });

        this.elements.speakBtn.addEventListener('click', () => {
            this.speakTranslation();
        });

        // Quick action buttons
        this.elements.quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.dataset.text;
                if (text) {
                    this.elements.inputText.value = text;
                    this.updateCharCount();
                    this.translateText();
                }
            });
        });

        // Mobile menu
        if (this.elements.mobileMenuBtn) {
            this.elements.mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close modal on outside click
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        this.elements.inputText.focus();
                        break;
                    case 'Enter':
                        if (document.activeElement === this.elements.inputText) {
                            e.preventDefault();
                            this.translateText();
                        }
                        break;
                }
            }
        });
    }

    // Update character count
    updateCharCount() {
        const text = this.elements.inputText.value;
        const count = text.length;
        const maxCount = 5000;

        this.elements.charCount.textContent = `${count} / ${maxCount}`;

        // Update button state
        this.elements.translateBtn.disabled = count === 0 || count > maxCount;

        // Update char count color
        if (count > maxCount * 0.9) {
            this.elements.charCount.style.color = 'var(--accent-color)';
        } else if (count > maxCount * 0.8) {
            this.elements.charCount.style.color = 'var(--warning-color)';
        } else {
            this.elements.charCount.style.color = 'var(--text-muted)';
        }
    }

    // Detect language from input text
    async detectLanguageFromInput() {
        const text = this.elements.inputText.value.trim();

        if (text.length > 10 && this.currentSourceLang === 'auto') {
            try {
                const detection = await this.translator.detectLanguage(text);
                const langName = getLanguageName(detection.language);
                this.elements.detectedLang.textContent = `Detected: ${langName}`;
            } catch (error) {
                console.error('Language detection failed:', error);
            }
        } else if (this.currentSourceLang === 'auto') {
            this.elements.detectedLang.textContent = '';
        }
    }

    // Update detected language display
    updateDetectedLanguageDisplay() {
        if (this.currentSourceLang === 'auto') {
            this.elements.detectedLang.textContent = '';
        } else {
            const langName = getLanguageName(this.currentSourceLang);
            this.elements.detectedLang.textContent = langName;
        }
    }

    // Update target language display
    updateTargetLanguageDisplay() {
        const langName = getLanguageName(this.currentTargetLang);
        this.elements.targetLangDisplay.textContent = langName;
    }

    // Swap source and target languages
    swapLanguages() {
        if (this.currentSourceLang === 'auto') {
            this.showToast('Cannot swap when auto-detect is selected', 'warning');
            return;
        }

        // Swap the values
        const tempLang = this.currentSourceLang;
        this.currentSourceLang = this.currentTargetLang;
        this.currentTargetLang = tempLang;

        // Update the select elements
        this.elements.sourceLang.value = this.currentSourceLang;
        this.elements.targetLang.value = this.currentTargetLang;

        // Update displays
        this.updateDetectedLanguageDisplay();
        this.updateTargetLanguageDisplay();

        // Swap text content if both exist
        const inputText = this.elements.inputText.value;
        const outputText = this.elements.outputText.textContent;

        if (inputText && outputText && !outputText.includes('Translation will appear here')) {
            this.elements.inputText.value = outputText;
            this.elements.outputText.textContent = inputText;
            this.updateCharCount();
        }

        this.saveUserPreferences();
        this.showToast('Languages swapped!', 'success');
    }

    // Translate text
    async translateText() {
        const text = this.elements.inputText.value.trim();

        if (!text) {
            this.showToast('Please enter text to translate', 'warning');
            return;
        }

        if (text.length > 5000) {
            this.showToast('Text is too long. Maximum 5000 characters allowed.', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            const result = await this.translator.translateText(
                text, 
                this.currentSourceLang, 
                this.currentTargetLang
            );

            // Update output
            this.elements.outputText.innerHTML = `<div class="translation-result">${this.escapeHtml(result.translatedText)}</div>`;

            // Update translation info
            const sourceLangName = getLanguageName(result.sourceLang);
            const targetLangName = getLanguageName(result.targetLang);
            const confidence = Math.round(result.confidence * 100);

            this.elements.translationInfo.textContent = 
                `Translated from ${sourceLangName} to ${targetLangName} (${confidence}% confidence)`;

            // Update detected language if auto-detect was used
            if (this.currentSourceLang === 'auto') {
                this.elements.detectedLang.textContent = `Detected: ${sourceLangName}`;
            }

            // Enable action buttons
            this.elements.copyBtn.disabled = false;
            this.elements.speakBtn.disabled = false;

            this.showToast('Translation completed!', 'success');

        } catch (error) {
            console.error('Translation failed:', error);
            this.elements.outputText.innerHTML = 
                `<div class="error-message">Translation failed: ${this.escapeHtml(error.message)}</div>`;
            this.elements.translationInfo.textContent = '';
            this.showToast('Translation failed. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    // Clear all text
    clearText() {
        this.elements.inputText.value = '';
        this.elements.outputText.innerHTML = '<div class="placeholder">Translation will appear here...</div>';
        this.elements.detectedLang.textContent = '';
        this.elements.translationInfo.textContent = '';
        this.elements.charCount.textContent = '0 / 5000';
        this.elements.charCount.style.color = 'var(--text-muted)';

        // Disable action buttons
        this.elements.copyBtn.disabled = true;
        this.elements.speakBtn.disabled = true;

        this.elements.inputText.focus();
    }

    // Paste text from clipboard
    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            this.elements.inputText.value = text;
            this.updateCharCount();
            this.detectLanguageFromInput();
            this.showToast('Text pasted from clipboard', 'success');
        } catch (error) {
            console.error('Failed to paste text:', error);
            this.showToast('Failed to paste text. Please paste manually.', 'error');
        }
    }

    // Copy translation to clipboard
    async copyTranslation() {
        const translationElement = this.elements.outputText.querySelector('.translation-result');

        if (!translationElement) {
            this.showToast('No translation to copy', 'warning');
            return;
        }

        const text = translationElement.textContent;

        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Translation copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy text:', error);

            // Fallback: select text
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(translationElement);
            selection.removeAllRanges();
            selection.addRange(range);

            this.showToast('Translation selected. Press Ctrl+C to copy.', 'info');
        }
    }

    // Speak translation
    speakTranslation() {
        const translationElement = this.elements.outputText.querySelector('.translation-result');

        if (!translationElement) {
            this.showToast('No translation to speak', 'warning');
            return;
        }

        const text = translationElement.textContent;

        try {
            this.translator.speak(text, this.currentTargetLang);
            this.showToast('Speaking translation...', 'info');
        } catch (error) {
            console.error('Failed to speak text:', error);
            this.showToast('Text-to-speech not available', 'error');
        }
    }

    // Set loading state
    setLoadingState(isLoading) {
        if (isLoading) {
            this.elements.loadingOverlay.style.display = 'flex';
            this.elements.translateBtn.disabled = true;
            this.elements.translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';
        } else {
            this.elements.loadingOverlay.style.display = 'none';
            this.elements.translateBtn.disabled = false;
            this.elements.translateBtn.innerHTML = '<i class="fas fa-language"></i> Translate';
        }
    }

    // Show toast notification
    showToast(message, type = 'info') {
        this.elements.toast.textContent = message;
        this.elements.toast.className = `toast ${type} show`;

        setTimeout(() => {
            this.elements.toast.className = 'toast';
        }, 3000);
    }

    // Show modal
    showModal(type) {
        const modalContent = {
            privacy: {
                title: 'Privacy Policy',
                body: `
                    <p>We respect your privacy and are committed to protecting your personal data.</p>
                    <h4>Data Collection</h4>
                    <p>We do not collect, store, or transmit your translation data to our servers. All translations are processed through third-party APIs.</p>
                    <h4>Local Storage</h4>
                    <p>We may store your preferences and translation history locally in your browser for a better user experience.</p>
                    <h4>Third-Party Services</h4>
                    <p>We use Google Translate API and other translation services. Please refer to their privacy policies for more information.</p>
                `
            },
            terms: {
                title: 'Terms of Use',
                body: `
                    <p>By using this translator, you agree to the following terms:</p>
                    <h4>Service Availability</h4>
                    <p>We provide this service "as is" without any warranties. Service availability may vary.</p>
                    <h4>Usage Limits</h4>
                    <p>This service is for personal and educational use. Commercial use may be subject to API limitations.</p>
                    <h4>Content Responsibility</h4>
                    <p>You are responsible for the content you translate. We do not endorse or take responsibility for translated content.</p>
                `
            },
            contact: {
                title: 'Contact Us',
                body: `
                    <p>Get in touch with us for support or feedback:</p>
                    <h4>GitHub</h4>
                    <p><a href="https://github.com/yourusername/web-language-translator" target="_blank">Visit our GitHub repository</a></p>
                    <h4>Issues</h4>
                    <p><a href="https://github.com/yourusername/web-language-translator/issues" target="_blank">Report bugs or request features</a></p>
                    <h4>Support</h4>
                    <p>For technical support, please create an issue on GitHub with detailed information about your problem.</p>
                `
            }
        };

        const content = modalContent[type];
        if (content) {
            this.elements.modalTitle.textContent = content.title;
            this.elements.modalBody.innerHTML = content.body;
            this.elements.modal.style.display = 'flex';
        }
    }

    // Close modal
    closeModal() {
        this.elements.modal.style.display = 'none';
    }

    // Toggle mobile menu (basic implementation)
    toggleMobileMenu() {
        // Simple mobile menu toggle - you can enhance this
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        }
    }

    // Save user preferences
    saveUserPreferences() {
        const preferences = {
            sourceLang: this.currentSourceLang,
            targetLang: this.currentTargetLang
        };

        try {
            localStorage.setItem('translatorPreferences', JSON.stringify(preferences));
        } catch (error) {
            console.warn('Could not save preferences:', error);
        }
    }

    // Load user preferences
    loadUserPreferences() {
        try {
            const stored = localStorage.getItem('translatorPreferences');
            if (stored) {
                const preferences = JSON.parse(stored);

                if (preferences.sourceLang && isLanguageSupported(preferences.sourceLang)) {
                    this.currentSourceLang = preferences.sourceLang;
                    this.elements.sourceLang.value = preferences.sourceLang;
                }

                if (preferences.targetLang && isLanguageSupported(preferences.targetLang)) {
                    this.currentTargetLang = preferences.targetLang;
                    this.elements.targetLang.value = preferences.targetLang;
                }

                this.updateDetectedLanguageDisplay();
                this.updateTargetLanguageDisplay();
            }
        } catch (error) {
            console.warn('Could not load preferences:', error);
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global functions for modal (called from HTML)
function showModal(type) {
    if (window.translatorApp) {
        window.translatorApp.showModal(type);
    }
}

function closeModal() {
    if (window.translatorApp) {
        window.translatorApp.closeModal();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.translatorApp = new TranslatorApp();
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}