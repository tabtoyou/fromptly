# 🪶 Fromptly — Real-Time Prompt Coach for Design and UI Language

> "From vague prompts to precise creation."

**Your AI prompt grammar coach for design-focused environments.**

Fromptly is a Chrome Extension that acts like Grammarly — but for prompt writing in design and AI IDE environments (e.g., Lovable, Gemini AI Studio, Notion, Jira). It detects vague, emotional, or ambiguous phrasing in prompts and provides real-time, context-aware corrections with clear design terminology, tokens, or property-level suggestions.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Setup](#-setup)
- [Usage](#-usage)
- [How It Works](#-how-it-works)
- [Configuration](#-configuration)
- [Supported Platforms](#-supported-platforms)
- [Privacy & Security](#-privacy--security)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Capabilities

- **Real-Time Detection** - Instantly highlights vague or non-standard prompt terms
- **Inline Suggestions** - Shows Grammarly-style popover with improved phrasing
- **Design System Awareness** - Provides specific CSS properties, measurements, and values
- **LLM-Powered Feedback** - Optional GPT-4o-mini integration for contextual suggestions
- **Local Dictionary** - Offline regex-based detection for instant highlighting
- **Multi-Domain Support** - Works on Lovable, Gemini, Notion, Jira, GitHub, and more
- **Keyboard Shortcuts** - Alt + Enter to apply top suggestion instantly
- **Privacy-First** - All processing happens locally; API calls are optional

### What Gets Detected

Fromptly identifies vague phrases like:

- "Make it pop" → Suggests specific shadow, contrast, or weight changes
- "Cleaner" → Suggests whitespace, border, or simplification actions
- "More balanced" → Suggests flexbox, margins, or alignment properties
- "Modern" → Suggests border-radius, shadows, and font choices
- "Better" / "Fix it" → Asks for specific metrics or goals
- And many more... (see [vague-phrases.json](vague-phrases.json))

## 🚀 Installation

### Option 1: Load Unpacked (Development)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/fromptly.git
   cd fromptly
   ```

2. **Generate icon files** (required for Chrome)
   ```bash
   # If you have ImageMagick installed:
   ./generate-icons.sh

   # Or manually convert icons/icon.svg to PNG using an online tool:
   # - icon16.png (16x16)
   # - icon48.png (48x48)
   # - icon128.png (128x128)
   # Place them in the icons/ directory
   ```

3. **Load extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `fromptly` directory
   - The extension should now be installed!

### Option 2: Chrome Web Store (Coming Soon)

Once published, you'll be able to install directly from the Chrome Web Store.

## ⚙️ Setup

### 1. Configure API Key (Optional but Recommended)

Fromptly works offline with local detection, but for AI-powered suggestions, you need an API key.

**Choose your AI provider:**

#### Option A: Google Gemini (Default, Recommended)
1. Click the Fromptly icon in your Chrome toolbar
2. Click "Settings"
3. Select "Google Gemini" as your AI provider
4. Enter your Gemini API key
   - Get a **free** API key from: https://aistudio.google.com/app/apikey
   - Gemini offers generous free tier usage
   - Your key is stored locally and never shared
5. Click "Save Settings"

#### Option B: OpenAI
1. Click the Fromptly icon in your Chrome toolbar
2. Click "Settings"
3. Select "OpenAI" as your AI provider
4. Enter your OpenAI API key
   - Get one from: https://platform.openai.com/api-keys
   - Requires paid account for GPT-4o-mini
   - Your key is stored locally and never shared
5. Click "Save Settings"

### 2. Enable Domains

By default, Fromptly is enabled on:
- lovable.dev
- aistudio.google.com
- notion.so
- atlassian.net (Jira/Confluence)
- github.com

You can customize this in Settings.

## 📖 Usage

### Basic Workflow

1. **Navigate to a supported site** (e.g., Lovable.dev)
2. **Start typing in any text input or textarea**
3. **Watch for highlights** - Vague phrases will be underlined in orange
4. **Click the highlight** to see suggestions
5. **Click "Apply"** to replace with a precise alternative
6. **Or press Alt+Enter** to apply the first suggestion

### Example Transformations

| Vague Input | Fromptly Suggestion |
|-------------|---------------------|
| "Make the button pop more" | "Increase button padding to 12px 24px, add box-shadow: 0 4px 12px rgba(0,0,0,0.15)" |
| "Add more space here" | "Add margin-bottom: 20px between sections" |
| "Make it look modern" | "Apply border-radius: 8px, use Inter font, add subtle shadow" |
| "This looks weird" | "Specify the issue: alignment, color, size?" |

## 🛠 How It Works

### Architecture

```
User Input (in browser)
    ↓
Content Script (detects editable fields)
    ↓
Local Dictionary (instant regex matching)
    ↓ (if vague phrase found)
Highlight + Suggestion Panel
    ↓ (optional, debounced)
Background Service Worker → OpenAI API
    ↓
Enhanced AI Suggestions
```

### Components

- **manifest.json** - Extension configuration (MV3)
- **content.js** - Detects and highlights vague phrases in real-time
- **content.css** - Styles for highlights and suggestion panels
- **background.js** - Handles API calls and caching
- **vague-phrases.json** - Dictionary of detected phrases and suggestions
- **options.html/js** - Settings page
- **popup.html/js** - Quick status popup
- **panel.html/js** - Side panel with tips and examples

## ⚙️ Configuration

### Settings Page

Access via: Click extension icon → "Settings"

**Options:**
- **Extension Status** - Enable/disable Fromptly globally
- **API Key** - OpenAI API key for enhanced suggestions
- **Enabled Domains** - Choose which sites to monitor
- **Cache Duration** - LLM suggestion cache (default: 15 minutes)

### Storage

Fromptly uses Chrome sync storage for settings:
- `isActive` - Extension on/off state
- `llmProvider` - Selected AI provider (gemini or openai)
- `geminiApiKey` - Your Gemini API key (encrypted by Chrome)
- `openaiApiKey` - Your OpenAI API key (encrypted by Chrome)
- `enabledDomains` - List of active domains

## 🌐 Supported Platforms

Fromptly works on any site with text inputs, but is optimized for:

| Platform | Support | Notes |
|----------|---------|-------|
| Lovable.dev | ✅ Full | AI IDE for app building |
| Google AI Studio | ✅ Full | Gemini prompt interface |
| Notion | ✅ Full | Works in all text blocks |
| Jira/Confluence | ✅ Full | Issue descriptions, comments |
| GitHub | ✅ Full | Issues, PRs, comments |
| Other sites | ⚠️ Partial | Works on standard inputs |

## 🔐 Privacy & Security

### What Fromptly Does NOT Do

- ❌ Log or store your prompts
- ❌ Track your browsing activity
- ❌ Send data to third-party servers (except Gemini/OpenAI if configured)
- ❌ Access your personal information
- ❌ Inject ads or tracking scripts

### What Fromptly DOES

- ✅ Process text locally using regex patterns
- ✅ Optionally send vague phrases to Gemini or OpenAI for suggestions
- ✅ Store settings in Chrome sync storage (encrypted)
- ✅ Cache suggestions locally to reduce API calls
- ✅ Require explicit domain permission

### API Usage

When you configure an API key (Gemini or OpenAI):
- Only detected vague phrases are sent to the AI provider
- Requests are debounced (800ms delay)
- Responses are cached for 15 minutes
- You can disable LLM feedback by removing the API key
- **Gemini offers a generous free tier** - great for getting started!

## 🧑‍💻 Development

### Prerequisites

- Google Chrome (or Chromium-based browser)
- Basic knowledge of JavaScript and Chrome Extensions
- (Optional) OpenAI API key for testing LLM features

### Local Development

1. Clone the repo
   ```bash
   git clone https://github.com/yourusername/fromptly.git
   cd fromptly
   ```

2. Make changes to source files

3. Reload extension in Chrome
   - Go to `chrome://extensions/`
   - Click reload icon on Fromptly card

4. Test on target sites

### Project Structure

```
fromptly/
├── manifest.json           # Extension manifest (MV3)
├── content.js             # Main content script
├── content.css            # Styles for highlights
├── background.js          # Service worker (API calls)
├── vague-phrases.json     # Detection dictionary
├── options.html/js        # Settings page
├── popup.html/js          # Quick popup
├── panel.html/js          # Side panel
├── icons/                 # Extension icons
│   ├── icon.svg
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

### Adding New Vague Phrases

Edit `vague-phrases.json`:

```json
{
  "phrase": "your vague term",
  "pattern": "regex pattern",
  "suggestions": [
    "Precise alternative 1",
    "Precise alternative 2"
  ],
  "category": "category-name"
}
```

## 🐛 Troubleshooting

### Extension Not Working

1. **Check extension is enabled**
   - Go to `chrome://extensions/`
   - Ensure Fromptly is toggled ON

2. **Verify domain is enabled**
   - Click Fromptly icon → Settings
   - Make sure current domain is checked

3. **Reload the page**
   - Fromptly activates on page load
   - Try refreshing the target website

### No Suggestions Appearing

1. **Check if API key is configured** (for LLM suggestions)
2. **Verify text matches vague phrase patterns**
3. **Check browser console for errors** (F12 → Console)

### Icons Not Showing

Generate PNG icons from SVG:
```bash
# Use ImageMagick or online tool
convert icons/icon.svg -resize 16x16 icons/icon16.png
convert icons/icon.svg -resize 48x48 icons/icon48.png
convert icons/icon.svg -resize 128x128 icons/icon128.png
```

## 🗺 Roadmap

### v1.0 (Current - MVP)
- ✅ Real-time detection
- ✅ Inline suggestions
- ✅ Lovable & Gemini support
- ✅ Local + LLM hybrid approach

### v1.1 (Next)
- [ ] Custom user dictionary
- [ ] Design token integration (Tailwind, Figma)
- [ ] Suggestion history
- [ ] Firefox support

### v1.2
- [ ] Team shared dictionaries
- [ ] Analytics dashboard
- [ ] Visual before/after preview

### v2.0
- [ ] Multi-language support (Korean, Japanese)
- [ ] Integration with design tools (Figma plugin)
- [ ] AI model fine-tuning for better suggestions

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Grammarly's real-time feedback approach
- Built for the design and AI builder community
- Special thanks to the Lovable and Gemini teams for creating amazing tools

---

**Made with 🪶 by the Fromptly team**

*Write prompts like a designer. Create with precision.*

## 📞 Support

- GitHub Issues: [Report a bug](https://github.com/yourusername/fromptly/issues)
- Email: support@fromptly.dev (placeholder)
- Twitter: @fromptly (placeholder)
