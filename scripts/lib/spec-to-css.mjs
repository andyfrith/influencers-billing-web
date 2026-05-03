import { darkenHex } from "./color-utils.mjs";
import { primaryHoverFromContainer } from "./derive-design-colors.mjs";

/**
 * Maps DESIGN.md-shaped color tokens to app theme CSS variables (matches amber-nocturne.css).
 * @param {Record<string, string>} colors
 * @returns {Record<string, string>}
 */
export function designColorsToCssVars(colors) {
  const c = (k) => colors[k];
  const primaryContainer = c("primary-container");
  return {
    "--background": c("background"),
    "--foreground": c("on-background"),
    "--card": c("surface-container"),
    "--card-foreground": c("on-surface"),
    "--popover": c("surface-container-high"),
    "--popover-foreground": c("on-surface"),
    "--primary": primaryContainer,
    "--primary-foreground": c("on-primary-container"),
    "--secondary": c("secondary-container"),
    "--secondary-foreground": c("on-secondary-container"),
    "--muted": c("surface-container-highest"),
    "--muted-foreground": c("on-surface-variant"),
    "--accent": c("primary"),
    "--accent-foreground": c("on-primary"),
    "--destructive": c("error-container"),
    "--destructive-foreground": c("on-error-container"),
    "--border": c("outline-variant"),
    "--input": c("surface-container-high"),
    "--ring": c("surface-tint"),
    "--primary-hover": primaryHoverFromContainer(primaryContainer),
    "--surface-container-lowest": c("surface-container-lowest"),
    "--surface-deepest": c("surface-dim"),
    "--surface-void": darkenHex(c("surface-container-lowest"), 0.06),
    "--surface-panel": c("surface-container-low"),
    "--surface-container-low": c("surface-container-low"),
    "--border-subtle": darkenHex(c("outline-variant"), 0.15),
    "--form-error-text": c("error"),
    "--form-success-note": c("on-surface-variant"),
  };
}

/**
 * @param {Record<string, string>} vars
 * @returns {string}
 */
export function formatCssBlock(vars) {
  return Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
}
