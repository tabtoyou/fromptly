#!/usr/bin/env python3
"""
Create very simple monochrome PNG icons
These are minimal but functional placeholders
"""

def create_simple_colored_png(size, filename, r, g, b):
    """
    Creates a minimal PNG with a single solid color
    """
    import struct
    import zlib

    def png_pack(tag, data):
        chunk_head = tag + data
        return struct.pack("!I", len(data)) + chunk_head + struct.pack("!I", 0xFFFFFFFF & zlib.crc32(chunk_head))

    # PNG file signature
    png_data = b'\x89PNG\r\n\x1a\n'

    # IHDR chunk
    png_data += png_pack(b'IHDR', struct.pack("!2I5B", size, size, 8, 2, 0, 0, 0))

    # Create image data (RGB, no alpha)
    raw_data = b''
    for y in range(size):
        raw_data += b'\x00'  # Filter type
        for x in range(size):
            # Gradient effect from top to bottom
            ratio = y / size
            # Purple gradient
            r_val = int(102 + (118 - 102) * ratio)
            g_val = int(126 + (75 - 126) * ratio)
            b_val = int(234 + (162 - 234) * ratio)
            raw_data += bytes([r_val, g_val, b_val])

    # IDAT chunk
    png_data += png_pack(b'IDAT', zlib.compress(raw_data, 9))

    # IEND chunk
    png_data += png_pack(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(png_data)

if __name__ == "__main__":
    import os

    print("🪶 Creating simple placeholder icons...")
    print()

    os.makedirs("icons", exist_ok=True)

    sizes = [16, 48, 128]
    for size in sizes:
        filename = f"icons/icon{size}.png"
        create_simple_colored_png(size, filename, 102, 126, 234)
        print(f"✓ Created {filename} ({size}x{size})")

    print()
    print("✅ Icons created successfully!")
    print()
    print("These are simple gradient placeholders.")
    print("For better icons with the feather design, use:")
    print("  - generate-icons.sh (requires ImageMagick)")
    print("  - generate-icons.py (requires Pillow)")
    print("  - Or convert icons/icon.svg manually")
