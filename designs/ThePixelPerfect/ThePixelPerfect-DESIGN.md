---
version: 1.0
theme_name: "The Pixel Perfect"
archetype: "8-Bit & Retro-Modern"
colors:
  light_mode:
    primary: "#FF0044"
    secondary: "#000000"
    accent: "#00ADFF"
    background: "#FFFFFF"
    surface: "#F0F0F0"
    text: "#000000"
  dark_mode:
    primary: "#00FF66"
    secondary: "#FFFFFF"
    accent: "#FF00CC"
    background: "#000000"
    surface: "#111111"
    text: "#FFFFFF"
typography:
  headings: "Silkscreen, cursive"
  body: "Pixelify Sans, sans-serif"
  scale: 1.0
---

# DESIGN RATIONALE

## Core Concept

A playful 8-bit aesthetic for indie game developers or digital toy shops. It combines retro pixel art constraints with modern web usability.

## UI Patterns

- **Pixel Borders:** All containers must use a 4px stepped border-style.
- **No Anti-Aliasing:** Imagery should remain "crispy" with `image-rendering: pixelated` properties.
- **Chunky Buttons:** Buttons should have a heavy "bottom-shadow" that shifts up when clicked to simulate physical arcade buttons.
