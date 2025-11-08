#!/usr/bin/env python3
"""
Fromptly Icon Generator (Python version)
Generates simple placeholder PNG icons for Chrome Extension
"""

import os
import base64

def create_simple_png_icon(size, filename):
    """
    Create a simple PNG icon with a gradient background and text.
    This creates a very basic PNG file manually.
    """
    # For simplicity, we'll create a data URI that can be converted
    # In a real scenario, you'd use PIL/Pillow, but this works without dependencies

    print(f"⚠️  Note: This script creates very basic placeholder icons.")
    print(f"   For best results, use ImageMagick or an online converter.")
    print(f"   See README.md for instructions.")
    print()

    # Create a minimal valid PNG
    # This is a placeholder - ideally use PIL or convert the SVG
    png_header = b'\x89PNG\r\n\x1a\n'

    # For now, just copy the SVG and note that it needs conversion
    print(f"⚠️  Cannot generate {filename} without PIL/Pillow or ImageMagick")
    print(f"   Please use one of these methods:")
    print(f"   1. Install Pillow: pip install Pillow")
    print(f"   2. Use ImageMagick: ./generate-icons.sh")
    print(f"   3. Use online converter: https://svgtopng.com/")

if __name__ == "__main__":
    print("🪶 Fromptly Icon Generator (Python)")
    print("=" * 40)
    print()

    try:
        from PIL import Image, ImageDraw, ImageFont
        print("✓ Pillow is installed")
        print()

        # Create icons directory if it doesn't exist
        os.makedirs("icons", exist_ok=True)

        sizes = [16, 48, 128]

        for size in sizes:
            # Create image with gradient-like background
            img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)

            # Draw a circular gradient background
            for i in range(size):
                for j in range(size):
                    # Calculate distance from center
                    dx = i - size/2
                    dy = j - size/2
                    distance = (dx*dx + dy*dy) ** 0.5
                    max_distance = size / 2

                    if distance <= max_distance:
                        # Gradient colors (purple to blue)
                        ratio = distance / max_distance
                        r = int(102 + (118 - 102) * ratio)
                        g = int(126 + (75 - 126) * ratio)
                        b = int(234 + (162 - 234) * ratio)
                        img.putpixel((i, j), (r, g, b, 255))

            # Draw a simple feather icon (simplified)
            if size >= 32:
                # Draw a vertical line for feather shaft
                shaft_x = size // 2
                draw.line([(shaft_x, size//4), (shaft_x, size*3//4)],
                         fill=(255, 255, 255, 255), width=max(1, size//16))

                # Draw feather barbs
                for y in range(size//4, size*3//4, max(1, size//8)):
                    draw.line([(shaft_x - size//6, y), (shaft_x, y)],
                             fill=(255, 255, 255, 200), width=max(1, size//20))
                    draw.line([(shaft_x, y), (shaft_x + size//6, y)],
                             fill=(255, 255, 255, 200), width=max(1, size//20))

            filename = f"icons/icon{size}.png"
            img.save(filename, 'PNG')
            print(f"✓ Created {filename} ({size}x{size})")

        print()
        print("✅ All icons generated successfully!")
        print()
        print("Next steps:")
        print("1. Load the extension in Chrome (chrome://extensions/)")
        print("2. Enable Developer mode")
        print("3. Click 'Load unpacked' and select the fromptly directory")

    except ImportError:
        print("❌ Pillow is not installed")
        print()
        print("Please install Pillow to generate icons:")
        print("  pip install Pillow")
        print()
        print("Or use alternative methods:")
        print("  1. Use ImageMagick: ./generate-icons.sh")
        print("  2. Use online converter: https://svgtopng.com/")
        print()
        print("Convert icons/icon.svg to:")
        print("  - icons/icon16.png (16x16)")
        print("  - icons/icon48.png (48x48)")
        print("  - icons/icon128.png (128x128)")
