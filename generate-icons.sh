#!/bin/bash

# Fromptly Icon Generator
# Converts SVG icon to required PNG sizes for Chrome Extension

echo "🪶 Fromptly Icon Generator"
echo "=========================="

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null && ! command -v magick &> /dev/null; then
    echo "❌ Error: ImageMagick is not installed."
    echo ""
    echo "Please install ImageMagick:"
    echo "  - Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  - macOS: brew install imagemagick"
    echo "  - Windows: Download from https://imagemagick.org/script/download.php"
    echo ""
    echo "Alternatively, use an online SVG to PNG converter:"
    echo "  - https://cloudconvert.com/svg-to-png"
    echo "  - https://svgtopng.com/"
    echo ""
    echo "Convert icons/icon.svg to:"
    echo "  - icons/icon16.png (16x16)"
    echo "  - icons/icon48.png (48x48)"
    echo "  - icons/icon128.png (128x128)"
    exit 1
fi

# Detect ImageMagick command
if command -v convert &> /dev/null; then
    CONVERT_CMD="convert"
elif command -v magick &> /dev/null; then
    CONVERT_CMD="magick convert"
fi

echo "✓ ImageMagick found"
echo ""

# Generate icons
echo "Generating icons..."

$CONVERT_CMD icons/icon.svg -resize 16x16 icons/icon16.png
echo "✓ Created icons/icon16.png (16x16)"

$CONVERT_CMD icons/icon.svg -resize 48x48 icons/icon48.png
echo "✓ Created icons/icon48.png (48x48)"

$CONVERT_CMD icons/icon.svg -resize 128x128 icons/icon128.png
echo "✓ Created icons/icon128.png (128x128)"

echo ""
echo "✅ All icons generated successfully!"
echo ""
echo "Next steps:"
echo "1. Load the extension in Chrome (chrome://extensions/)"
echo "2. Enable Developer mode"
echo "3. Click 'Load unpacked' and select the fromptly directory"
