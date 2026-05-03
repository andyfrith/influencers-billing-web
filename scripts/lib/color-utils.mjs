/**
 * @param {string} hex
 * @returns {string}
 */
export function normalizeHex(hex) {
  let h = String(hex).trim();
  const hash = h.indexOf("#");
  if (hash !== -1) h = h.slice(hash);
  if (!h.startsWith("#")) h = `#${h}`;
  h = h.slice(1);
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return `#${h.slice(0, 6).toLowerCase()}`;
}

/**
 * @param {string} hex
 * @returns {{ r: number; g: number; b: number }}
 */
export function hexToRgb(hex) {
  const h = normalizeHex(hex).slice(1);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/**
 * @param {{ r: number; g: number; b: number }} rgb
 * @returns {string}
 */
export function rgbToHex({ r, g, b }) {
  const clamp = (n) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${clamp(r)}${clamp(g)}${clamp(b)}`;
}

/**
 * @param {string} a
 * @param {string} b
 * @param {number} t 0–1
 * @returns {string}
 */
export function mixHex(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const u = Math.min(1, Math.max(0, t));
  return rgbToHex({
    r: A.r + (B.r - A.r) * u,
    g: A.g + (B.g - A.g) * u,
    b: A.b + (B.b - A.b) * u,
  });
}

/**
 * @param {string} hex
 * @returns {number} 0–1
 */
export function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const lin = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const R = lin(r);
  const G = lin(g);
  const B = lin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * @param {string} bgHex
 * @returns {string}
 */
export function contrastTextOn(bgHex) {
  return relativeLuminance(bgHex) > 0.45 ? "#1a1512" : "#f0f0f0";
}

/**
 * @param {string} hex
 * @param {number} amount 0–1 toward white
 * @returns {string}
 */
export function lightenHex(hex, amount) {
  return mixHex(hex, "#ffffff", amount);
}

/**
 * @param {string} hex
 * @param {number} amount 0–1 toward black
 * @returns {string}
 */
export function darkenHex(hex, amount) {
  return mixHex(hex, "#000000", amount);
}

/**
 * @param {string} hex
 * @returns {boolean}
 */
export function isDarkBackground(hex) {
  return relativeLuminance(hex) < 0.35;
}
