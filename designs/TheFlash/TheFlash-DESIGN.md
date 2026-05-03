---
version: 1.0
theme_name: "The Flash"
archetype: "High-Speed Commerce"
colors:
  light_mode:
    primary: "#000000"
    secondary: "#F5F5F5"
    accent: "#FFFF00" # Electric Yellow
    background: "#FFFFFF"
    surface: "#F9F9F9"
    text: "#000000"
  dark_mode:
    primary: "#FFFFFF"
    secondary: "#1A1A1A"
    accent: "#FFFF00"
    background: "#000000"
    surface: "#0A0A0A"
    text: "#FFFFFF"
typography:
  headings: "Inter, sans-serif"
  body: "Inter, sans-serif"
  scale: 1.2
---

# DESIGN RATIONALE

## Core Concept

Designed for high-frequency trading, flash sales, or breaking news. The UI prioritizes speed of perception and rapid-fire updates.

## UI Patterns

- **Ticker Elements:** Use a scrolling text bar at the top for live updates or price movements.
- **Micro-Transitions:** Use very fast (100ms) hover states to indicate responsiveness without delaying the user.
- **Compact UI:** Reduce padding to ensure the maximum amount of "above the fold" information is visible.
