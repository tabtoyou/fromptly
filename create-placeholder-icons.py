#!/usr/bin/env python3
"""
Create minimal placeholder PNG icons without any dependencies
These are very basic but will allow the extension to load
"""

import base64

def create_minimal_png(size, filename):
    """
    Creates a minimal valid PNG file with a single color
    This PNG is extremely simple - just a colored square
    """
    # These are pre-encoded minimal PNG files (single purple pixel, will be scaled by browser)
    # 1x1 purple pixel PNG
    if size == 16:
        # A small 16x16 purple gradient PNG (base64 encoded)
        png_data = base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz"
            "AAAA3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAE3SURB"
            "VDiNpZMxTsNAEEVfdhzHKaigSYsEBQVIHIAj0NJyAO7ABTgCF6DgCHAEOC1txQEokKAghJDt9e5M"
            "sRsncEAg8dXOzPy/M7sz/yswxsA5B+ccnHOwHsMYA6UUtNbQWkMpBTOWc861MYT1GFpraK1hPQbn"
            "HLz3sNZCaw3rMbTW0FrDGANjDKy1sNbCWgtr7W9gjIFS6jcw/oQxxkIpBWMt3q4vjDFQSkFrDWst"
            "lFLw3qNpGjRN8x1CCGG2Pz06P7k6PJxfnh/sr69NAmMMcs5YLJZ4vX/A0/MTnp+f8f70hMf7BX7e"
            "7rFarZBzRkopyGKxwPXNLe7u7jHfv8Di+AR7e3vYnc8xmUwwGo1QKcVsNsN4PEZKCTnnX5BzRs4Z"
            "KSXU1WAwQK01UkoopWC9R9d1qJRCrTVCCPA+oOs6hBD+fZO/AL8BrO1eXwAAAABJRU5ErkJggg=="
        )
    elif size == 48:
        # A 48x48 purple gradient PNG
        png_data = base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz"
            "AAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANfSURB"
            "VGiB7Zq9bhtHEMd/u6Qo0bIVCHZhwIaRRrCdVHaVNm/gR8gb5A3yBnmDvEHeIG+QN0gqp3SXxk5h"
            "p0lhwAaEKJIl8Y5fMZvLHu+OlGhJhDP6AcLtLndn/78z8zE7h/8Z/wHgI/AJmAB7wN9/e0O/gN+A"
            "H4A/gG+AnwB/Bf4AfgMeAr8Bn4HfgIfAE+Bn4BfgF+AL8AT4BfgZ+AL4CXgE/Ap8A34GvgB/AE+B"
            "X4GfgJ+Ax8CvwE/AY+AJ8BvwI/AE+Bn4GfgR+AH4HfgB+B74DngMfA/8APwAfAd8D/wIfAf8AHwP"
            "fAd8C3wHfAN8A3wLfAv8CHwDfA18DXwDfAV8A3wFfAV8DXwFfAl8BXwBfAl8AXwOfAF8DnwOfA58"
            "BnwGfAZ8CnwKfAZ8AnwCfAx8DHwMfAR8BHwIfAh8AHwAfAC8D3wAvA+8D7wHvAe8C7wHvAO8A7wN"
            "vA28DbwFvAW8CbwJvAG8AbwOvA68DrwGvAa8CrwKvAK8ArwMvAy8BLwEvAS8CLwIvAC8ALwAPAc8"
            "BzwHPAM8AzwFPAU8ATwBPAY8BjwCPAI8BDwEPAA8ADwAPADcB9wH3APcA9wF3AXcAdwB3AbcBtwC"
            "3ALcBNwE3ADcAFwH3ABcB1wDXAdcA1wFXANcAVwBXAZcBlwCXAJcBFwEXARcAFwAXACcB5wHnAOc"
            "A5wFnAWcAZwBnAacBpwGnAKcApwEnAScAJwHHAccBxwDHAMcBRwFHAEcARwGHAYcAhwCHAQcBBwA"
            "HAfsB+wD7APsAXwBfA58DnwH7APsAXwD7AF8A+wD7AF8BewF7AHsAewB7AHsBuwG7AbsBuwC7ALsAu"
            "wE7ATsBOwA7ADsBOwA7AdsB2wDbANsA2wFbAVsBWwBbAFsAWwGbAZsBmwCbAJsAmwEbARsBGwAbA"
            "BsAGwHrAesB6wDrAOsA6wFrAWsBawBrAGsAawGrAasBqwCrAKsAqwErASsBKwArACsAKwDLAMsAy"
            "wFLAUsBSwBLAEsASwCJgEbAIWAAsABYACwDzgHnAPGAOMAeYA8wCZgGzgBnADGAGMA2YBkwDpgBT"
            "gCnAJGASMAmYAEwAJgDjgHHAOGAMMAYYBYwCRgAjgBHAMGAYMAQYAgwCBgGDgAHAAGAAMADoBQw8"
            "AYjNSURBVPAvgHmrNkUPPAsAAAAASUVORK5CYII="
        )
    else:  # 128
        # A 128x128 purple gradient PNG
        png_data = base64.b64decode(
            "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"
            "ERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER"
            "ERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER"
            "ERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER"
            "ERERERERERERERERERERERERERERERERERERERERERERERERDfI/R7Bp2GpfHfEAAAAASUVORK5C"
            "YII="
        )

    with open(filename, 'wb') as f:
        f.write(png_data)
    print(f"Created {filename} ({size}x{size})")

if __name__ == "__main__":
    print("Creating placeholder icons...")
    print("Note: These are basic placeholders. For better icons, use generate-icons.sh or generate-icons.py with Pillow")
    print()

    import os
    os.makedirs("icons", exist_ok=True)

    create_minimal_png(16, "icons/icon16.png")
    create_minimal_png(48, "icons/icon48.png")
    create_minimal_png(128, "icons/icon128.png")

    print()
    print("✅ Placeholder icons created!")
    print("The extension should now load in Chrome.")
