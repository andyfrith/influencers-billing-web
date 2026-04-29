---
name: Amber Nocturne
colors:
  surface: "#161311"
  surface-dim: "#161311"
  surface-bright: "#3d3836"
  surface-container-lowest: "#110d0c"
  surface-container-low: "#1f1b19"
  surface-container: "#231f1d"
  surface-container-high: "#2e2927"
  surface-container-highest: "#393431"
  on-surface: "#eae1dd"
  on-surface-variant: "#e2bfb0"
  inverse-surface: "#eae1dd"
  inverse-on-surface: "#342f2d"
  outline: "#a98a7d"
  outline-variant: "#5a4136"
  surface-tint: "#ffb693"
  primary: "#ffb693"
  on-primary: "#561f00"
  primary-container: "#ff6b00"
  on-primary-container: "#572000"
  inverse-primary: "#a04100"
  secondary: "#ffb77a"
  on-secondary: "#4c2700"
  secondary-container: "#d37b20"
  on-secondary-container: "#432100"
  tertiary: "#cec5bf"
  on-tertiary: "#352f2b"
  tertiary-container: "#9f9792"
  on-tertiary-container: "#35302c"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#ffdbcc"
  primary-fixed-dim: "#ffb693"
  on-primary-fixed: "#351000"
  on-primary-fixed-variant: "#7a3000"
  secondary-fixed: "#ffdcc2"
  secondary-fixed-dim: "#ffb77a"
  on-secondary-fixed: "#2e1500"
  on-secondary-fixed-variant: "#6d3a00"
  tertiary-fixed: "#ebe1da"
  tertiary-fixed-dim: "#cec5bf"
  on-tertiary-fixed: "#1f1b17"
  on-tertiary-fixed-variant: "#4c4641"
  background: "#161311"
  on-background: "#eae1dd"
  surface-variant: "#393431"
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "600"
    lineHeight: "1.25"
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: "600"
    lineHeight: "1.3"
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: "400"
    lineHeight: "1.6"
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: "400"
    lineHeight: "1.6"
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: "600"
    lineHeight: "1.4"
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: "500"
    lineHeight: "1.4"
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is built on a "Warm Tech" aesthetic—a sophisticated dark mode that replaces cold, sterile blacks with deep, charcoal-inflected ambers and rich bister tones. The brand personality is optimistic and energetic, yet maintains a premium composure.

The style leverages **Minimalism** with a touch of **Glassmorphism**. High-value interactions are highlighted by a vibrant orange accent that feels like a glowing ember against a dark room. The interface should feel approachable and friendly through the use of generous organic rounding, while the crisp typography and deliberate whitespace ensure a professional, sophisticated finish.

## Colors

The palette is anchored by a deep obsidian-warm base. Unlike standard dark modes, the neutrals are tinted with a hint of orange (warm grey) to maintain the "Friendly yet Sophisticated" narrative.

- **Primary:** A high-vibrancy "Solar Orange" (#FF6B00) used for critical actions and brand expression.
- **Secondary:** A softer "Peach Ember" (#FF9F43) for secondary highlights or gradients.
- **Surface Tones:** Use `#1A1614` for the primary container background. Surfaces should never be pure black; they should always feel like they belong to a warm-toned family.
- **Accents:** Use low-opacity orange glows (5-10% alpha) for hover states on dark containers to create a "heat-map" tactile feel.

## Typography

The design system exclusively utilizes **Plus Jakarta Sans**. Its modern, geometric shapes and slightly wider apertures contribute to the friendly and optimistic tone of the UI.

- **Headlines:** Use Bold or ExtraBold weights with slight negative letter-spacing to create a tight, editorial look.
- **Body Text:** Use Regular weight with a generous line-height (1.6) to ensure maximum readability against the dark background.
- **Hierarchy:** Primary content should use the `text_primary` color, while supporting metadata and descriptions should drop to `text_secondary` to reduce visual noise.

## Layout & Spacing

This design system employs a **Fluid Grid** model with a consistent 8-pixel rhythmic scale. All layout decisions should be divisible by 4px, but primary spacing should favor 16px and 24px increments to maintain a spacious, modern feel.

The layout should prioritize content density in the center of the screen, utilizing wide margins on desktop to prevent eye strain. Elements should "float" within their containers, using padding rather than borders to define structure whenever possible.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layering**.

1.  **The Base:** The lowest level is the `#0F0D0C` background.
2.  **The Container:** Primary cards use `#1A1614` with a subtle 1px border of `#2D2824` to define edges without being harsh.
3.  **Shadows:** Use large, diffused shadows with a slight warm tint (`rgba(0, 0, 0, 0.5)` with a secondary shadow of `rgba(255, 107, 0, 0.05)` for floating elements).
4.  **Glassmorphism:** For overlays like navigation bars or modals, use a backdrop blur of 12px and 60% opacity on the surface color to maintain a sense of depth and spatial awareness.

## Shapes

The design system follows a strict `ROUND_TWELVE` (0.75rem / 12px) philosophy for standard components. This creates a soft, approachable feel that mitigates the potential "aggressiveness" of a dark, high-contrast palette.

- **Small Components (Chips, Inputs):** Use a 12px radius.
- **Large Components (Cards, Modals):** Use a 24px (rounded-lg) radius to emphasize the friendly character.
- **Buttons:** Fully rounded (pill) buttons are preferred for primary CTAs to maximize their visual distinction.

## Components

- **Buttons:** Primary buttons are Solid Orange (`#FF6B00`) with white or dark-brown text. Secondary buttons should be Ghost style with a thin warm-grey border and a subtle orange hover glow.
- **Chips:** Used for filtering; they should have a background of `#2D2824` and transition to the primary orange color when selected.
- **Input Fields:** Use a dark-fill (`#1A1614`) with a 12px radius. The focus state should feature a 2px orange border and a subtle outer glow (bloom effect).
- **Cards:** Cards are the workhorse of the system. They should have a 24px corner radius and no visible shadow unless they are "interactive" (hoverable). On hover, they should lift slightly (translate Y -4px) and gain a soft, warm shadow.
- **Progress Bars & Toggles:** Use the primary orange for "active" states to create a clear visual indicator of system status.
