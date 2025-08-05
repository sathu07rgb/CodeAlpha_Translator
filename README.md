# Universal Language Translator - Web Edition

A modern, responsive web application that provides real-time translation between 100+ languages. Built with pure HTML, CSS, and JavaScript for GitHub Pages hosting.

🌐 **[Live Demo](https://yourusername.github.io/web-language-translator/)**

## ✨ Features

- **100+ Languages**: Translate between all major world languages
- **Real-time Translation**: Instant translation powered by translation APIs  
- **Auto Language Detection**: Automatically detects source language
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Text-to-Speech**: Listen to translations with built-in speech synthesis
- **Copy to Clipboard**: One-click copying of translations
- **Translation History**: Keeps track of recent translations
- **Keyboard Shortcuts**: Fast navigation with keyboard shortcuts
- **Privacy Focused**: No data collection or storage on servers
- **Completely Free**: No registration or limits

## 🚀 Quick Start

### Option 1: Use Online
Simply visit the [live demo](https://yourusername.github.io/web-language-translator/) and start translating!

### Option 2: Run Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/web-language-translator.git
   cd web-language-translator
   ```

2. Open `index.html` in your web browser, or serve it using a local web server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. Navigate to `http://localhost:8000` in your browser.

### Option 3: Deploy to GitHub Pages
1. Fork this repository
2. Go to your repository settings
3. Enable GitHub Pages from the `main` branch
4. Your translator will be live at `https://yourusername.github.io/web-language-translator/`

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Translation API**: MyMemory API (free tier) with fallback support
- **Speech Synthesis**: Web Speech API
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter)
- **Hosting**: GitHub Pages compatible

## 📱 Supported Languages

The translator supports 100+ languages including:

**Popular Languages:**
- English, Spanish, French, German, Italian, Portuguese
- Chinese (Simplified & Traditional), Japanese, Korean
- Arabic, Russian, Hindi, Turkish

**European Languages:**
- Polish, Czech, Hungarian, Romanian, Bulgarian
- Croatian, Serbian, Slovak, Slovenian, Lithuanian
- Latvian, Estonian, Norwegian, Swedish, Danish, Finnish

**Asian Languages:**
- Thai, Vietnamese, Indonesian, Malay, Filipino
- Bengali, Tamil, Telugu, Gujarati, Punjabi, Urdu
- Persian, Hebrew, Georgian, Armenian

**And many more...**

## 🎯 Usage

### Basic Translation
1. Select source language (or use auto-detect)
2. Select target language
3. Type or paste text in the input area
4. Click "Translate" or press Ctrl+Enter

### Advanced Features
- **Swap Languages**: Click the swap button to reverse translation direction
- **Copy Translation**: Click the copy button to copy result to clipboard
- **Listen to Translation**: Click the speaker button for text-to-speech
- **Quick Phrases**: Use predefined common phrases for quick translation
- **Clear Text**: Clear both input and output with one click

### Keyboard Shortcuts
- `Ctrl+K`: Focus on input text area
- `Ctrl+Enter`: Translate text
- `Ctrl+C`: Copy translation (when translation is selected)

## 🔧 Configuration

The translator uses the following APIs and can be configured:

### Translation API
- Primary: MyMemory API (free, no key required)
- Fallback: Built-in word dictionary for common phrases
- Rate Limit: 100 requests per day (free tier)

### Customization
You can customize the translator by modifying:

- `js/languages.js`: Add or modify supported languages
- `js/translator.js`: Change translation API or add new services
- `css/styles.css`: Modify appearance and styling
- `js/app.js`: Add new features or modify behavior

## 🌟 Features in Detail

### Auto Language Detection
Automatically detects the source language using character pattern recognition and common word analysis.

### Translation History
Keeps track of your recent translations locally in your browser. History persists between sessions.

### Responsive Design
Optimized for all screen sizes with a mobile-first approach. The interface adapts seamlessly to desktop, tablet, and mobile devices.

### Privacy Protection
- No data sent to our servers
- Translations processed through third-party APIs only
- Local storage for preferences and history
- No tracking or analytics

### PWA Ready
The app includes service worker registration for Progressive Web App capabilities (installable on mobile devices).

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Setup
1. Clone the repository
2. Open `index.html` in your browser
3. Make changes to HTML, CSS, or JavaScript files
4. Refresh the browser to see changes
5. Test on different devices and browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: [Create an issue](https://github.com/yourusername/web-language-translator/issues) for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🙏 Acknowledgments

- [MyMemory API](https://mymemory.translated.net/) for free translation services
- [Font Awesome](https://fontawesome.com/) for beautiful icons
- [Google Fonts](https://fonts.google.com/) for typography
- The open-source community for inspiration and feedback

## 📈 Roadmap

- [ ] Add more translation service providers
- [ ] Implement document translation (PDF, Word)
- [ ] Add translation confidence indicators
- [ ] Implement user accounts and cloud sync
- [ ] Add image text recognition (OCR) translation
- [ ] Create browser extension version
- [ ] Add offline translation capabilities
- [ ] Implement translation quality rating system

---

**Made with ❤️ for the global community**

*Breaking language barriers, one translation at a time.*