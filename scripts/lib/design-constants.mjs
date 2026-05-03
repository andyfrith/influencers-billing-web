/** Typography block matching root DESIGN.md shape (sizes are the rhythm reference). */
export const GOLD_STANDARD_ROUNDED = {
  sm: "0.25rem",
  DEFAULT: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  full: "9999px",
};

export const GOLD_STANDARD_SPACING = {
  unit: "4px",
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "64px",
  gutter: "24px",
  margin: "32px",
};

/**
 * @param {string} headingFont e.g. "Plus Jakarta Sans, sans-serif"
 * @param {string} bodyFont
 * @param {number} [scale=1]
 */
export function buildTypographyBlock(headingFont, bodyFont, scale = 1) {
  const h = (headingFont || "Plus Jakarta Sans, sans-serif").split(",")[0].trim();
  const b = (bodyFont || "Plus Jakarta Sans, sans-serif").split(",")[0].trim();
  const s = (n) => `${Math.round(n * scale)}px`;

  return {
    "headline-xl": {
      fontFamily: h,
      fontSize: s(40),
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: "-0.02em",
    },
    "headline-lg": {
      fontFamily: h,
      fontSize: s(32),
      fontWeight: "600",
      lineHeight: "1.25",
      letterSpacing: "-0.01em",
    },
    "headline-md": {
      fontFamily: h,
      fontSize: s(24),
      fontWeight: "600",
      lineHeight: "1.3",
    },
    "body-lg": {
      fontFamily: b,
      fontSize: s(18),
      fontWeight: "400",
      lineHeight: "1.6",
    },
    "body-md": {
      fontFamily: b,
      fontSize: s(16),
      fontWeight: "400",
      lineHeight: "1.6",
    },
    "label-md": {
      fontFamily: b,
      fontSize: s(14),
      fontWeight: "600",
      lineHeight: "1.4",
      letterSpacing: "0.01em",
    },
    "label-sm": {
      fontFamily: b,
      fontSize: s(12),
      fontWeight: "500",
      lineHeight: "1.4",
      letterSpacing: "0.03em",
    },
  };
}
