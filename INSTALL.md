# 🪶 Fromptly - Quick Installation Guide

## Prerequisites

- Google Chrome or any Chromium-based browser (Edge, Brave, Opera, etc.)
- (Optional) OpenAI API key for AI-powered suggestions

## Installation Steps

### 1. Get the Extension Files

You should already have the `fromptly` directory with all necessary files.

Verify you have these files:
```bash
fromptly/
├── manifest.json
├── content.js
├── content.css
├── background.js
├── vague-phrases.json
├── options.html/js
├── popup.html/js
├── panel.html/js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### 2. Load Extension in Chrome

1. **Open Chrome Extensions Page**
   - Type `chrome://extensions/` in your address bar, OR
   - Click menu (⋮) → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Navigate to and select the `fromptly` directory
   - Click "Select Folder" or "Open"

4. **Verify Installation**
   - You should see a Fromptly card in your extensions list
   - The extension should be enabled (toggle is blue/on)
   - You should see the Fromptly icon (🪶) in your Chrome toolbar

### 3. Configure the Extension (Optional but Recommended)

1. **Click the Fromptly icon** in your Chrome toolbar
2. **Click "Settings"** button
3. **Choose your AI provider and enter API key** (optional)

   **Option A: Google Gemini (Recommended)**
   - Select "Google Gemini" as provider
   - Get a **FREE** API key from: https://aistudio.google.com/app/apikey
   - Gemini has a generous free tier!

   **Option B: OpenAI**
   - Select "OpenAI" as provider
   - Get a key from: https://platform.openai.com/api-keys
   - Requires paid account

   **Note:** Local detection works without an API key, but AI suggestions require one.

4. **Configure domains** (default domains are already enabled):
   - lovable.dev
   - aistudio.google.com
   - notion.so
   - atlassian.net (Jira/Confluence)
   - github.com
5. **Click "Save Settings"**

### 4. Test the Extension

1. **Visit a supported site** (e.g., https://lovable.dev)
2. **Find a text input or textarea**
3. **Type a vague phrase** like:
   - "Make it pop"
   - "Cleaner design"
   - "More balanced"
4. **Watch for orange highlighting** on vague phrases
5. **Click the highlight** to see suggestions
6. **Press Alt+Enter** to apply the first suggestion

## Troubleshooting

### Extension Not Loading

**Problem:** Extension fails to load or shows errors

**Solutions:**
- Verify all files are present in the directory
- Check that icons exist (icon16.png, icon48.png, icon128.png)
- Look for error messages in the extensions page
- Try reloading the extension (click reload icon ⟳)

### Icons Missing

**Problem:** No icon appears or broken icon image

**Solutions:**
Run one of these scripts to generate icons:
```bash
# Option 1: Using Python (no dependencies)
python3 create-simple-icons.py

# Option 2: Using ImageMagick (better quality)
./generate-icons.sh

# Option 3: Using Python with Pillow (best quality)
pip install Pillow
python3 generate-icons.py
```

### No Suggestions Appearing

**Problem:** Vague phrases not detected or highlighted

**Solutions:**
- Check extension is enabled (click icon → verify status)
- Verify current domain is in enabled list (Settings)
- Refresh the web page
- Check browser console for errors (F12 → Console)

### API Not Working

**Problem:** Only local suggestions appear, no AI suggestions

**Solutions:**
- Verify API key is entered correctly in Settings
- Check API key is valid and has credits
- Wait 1-2 seconds after highlighting appears
- Check browser console for API errors

## Updating the Extension

When you modify any files:

1. Go to `chrome://extensions/`
2. Find the Fromptly extension
3. Click the reload icon (⟳)
4. Refresh any open web pages where you want to use it

## Uninstalling

1. Go to `chrome://extensions/`
2. Find Fromptly
3. Click "Remove"
4. Confirm deletion

## Next Steps

- Read the full [README.md](README.md) for detailed features
- Customize `vague-phrases.json` to add your own detection patterns
- Share feedback and report issues

---

**Need Help?**

- Check [README.md](README.md) for detailed documentation
- Review [vague-phrases.json](vague-phrases.json) to see what's detected
- Open the browser console (F12) to see error messages

**Enjoy writing better prompts with Fromptly! 🪶**
