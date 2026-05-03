/**
 * @param {string} filename e.g. "TheBillboard-DESIGN.md" or "AlpineTrek-DESIGN.md"
 * @returns {string} kebab-case theme id
 */
export function themeIdFromDesignFilename(filename) {
  let stem = filename.replace(/\.md$/i, "").replace(/-DESIGN$/i, "");
  if (/^The[A-Z]/.test(stem)) {
    stem = `the-${stem.slice(3)}`;
  }
  return stem
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}
