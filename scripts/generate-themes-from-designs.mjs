#!/usr/bin/env node
/**
 * Generates `app/themes/clubs/<theme_id>.css` from enriched design docs under `designs/`.
 * Requires frontmatter produced by `scripts/enrich-design-docs.mjs` (`colors`, `colors_light`, …).
 *
 * Usage:
 *   node scripts/generate-themes-from-designs.mjs
 *   node scripts/generate-themes-from-designs.mjs --name=TheCircuit
 *   node scripts/generate-themes-from-designs.mjs --name=alpine-trek
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { designColorsToCssVars, formatCssBlock } from "./lib/spec-to-css.mjs";
import { themeIdFromDesignFilename } from "./lib/theme-id.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DESIGNS_DIR = path.join(ROOT, "designs");
const OUT_DIR = path.join(ROOT, "app", "themes", "clubs");

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function collectDesignFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await collectDesignFiles(full)));
    } else if (e.isFile() && /-DESIGN\.md$/i.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * @param {string} raw
 */
function splitFrontmatter(raw) {
  const nl = raw.startsWith("---\r\n") ? 5 : raw.startsWith("---\n") ? 4 : null;
  if (nl === null) throw new Error("Expected opening ---");
  const rest = raw.slice(nl);
  const endMatch = rest.match(/\r?\n---\r?\n/);
  if (!endMatch || endMatch.index === undefined) {
    throw new Error("Expected closing --- for frontmatter");
  }
  const yamlSrc = rest.slice(0, endMatch.index);
  return YAML.parse(yamlSrc);
}

/**
 * @param {string} nameArg
 * @param {string} basename
 * @param {string} themeId
 */
function nameMatchesFilter(nameArg, basename, themeId) {
  const n = nameArg.trim().toLowerCase();
  if (!n) return true;
  return (
    basename.toLowerCase() === n ||
    basename.toLowerCase().replace(/\.md$/i, "") === n ||
    themeId === n ||
    basename.toLowerCase().includes(n) ||
    themeId.includes(n)
  );
}

/**
 * @param {string} px
 * @returns {string}
 */
function pxToRem(px) {
  const n = parseFloat(String(px).replace(/px/i, "").trim());
  if (Number.isNaN(n)) return "1rem";
  return `${n / 16}rem`;
}

/**
 * @param {Record<string, unknown>} typography
 * @returns {Record<string, string>}
 */
function typographyToCssVars(typography) {
  if (!typography || typeof typography !== "object") return {};
  const t = /** @type {Record<string, Record<string, unknown>>} */ (typography);
  const hxl = t["headline-xl"] || {};
  const font =
    typeof hxl.fontFamily === "string"
      ? `${hxl.fontFamily}, ui-sans-serif, system-ui, sans-serif`
      : "ui-sans-serif, system-ui, sans-serif";

  return {
    "--font-sans": font,
    "--text-headline-xl": pxToRem(String(hxl.fontSize ?? "40px")),
    "--text-headline-lg": pxToRem(String(t["headline-lg"]?.fontSize ?? "32px")),
    "--text-headline-md": pxToRem(String(t["headline-md"]?.fontSize ?? "24px")),
    "--text-body-lg": pxToRem(String(t["body-lg"]?.fontSize ?? "18px")),
    "--text-body-md": pxToRem(String(t["body-md"]?.fontSize ?? "16px")),
    "--text-label-md": pxToRem(String(t["label-md"]?.fontSize ?? "14px")),
    "--text-label-sm": pxToRem(String(t["label-sm"]?.fontSize ?? "12px")),
    "--leading-headline-xl": String(hxl.lineHeight ?? "1.2"),
    "--leading-headline-lg": String(t["headline-lg"]?.lineHeight ?? "1.25"),
    "--leading-headline-md": String(t["headline-md"]?.lineHeight ?? "1.3"),
    "--leading-body-lg": String(t["body-lg"]?.lineHeight ?? "1.6"),
    "--leading-body-md": String(t["body-md"]?.lineHeight ?? "1.6"),
    "--leading-label-md": String(t["label-md"]?.lineHeight ?? "1.4"),
    "--leading-label-sm": String(t["label-sm"]?.lineHeight ?? "1.4"),
  };
}

/**
 * @param {Record<string, unknown>} rounded
 */
function roundedToCssVars(rounded) {
  const r = rounded && typeof rounded === "object" ? rounded : {};
  const def = String(r.DEFAULT ?? r.default ?? "0.75rem");
  return {
    "--radius": def,
    "--radius-sm": String(r.sm ?? "0.25rem"),
    "--radius-md": String(r.md ?? "0.75rem"),
    "--radius-lg": String(r.lg ?? "1rem"),
    "--radius-xl": String(r.xl ?? "1.5rem"),
    "--radius-full": String(r.full ?? "9999px"),
  };
}

/**
 * @param {Record<string, string>} a
 * @param {Record<string, string>} b
 */
function mergeVars(a, b) {
  return { ...a, ...b };
}

/**
 * Escapes a string for use inside a TypeScript double-quoted literal.
 * @param {string} s
 */
function tsEscapeString(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ");
}

/**
 * Scans all enriched design docs and writes `lib/club-color-themes.generated.ts`
 * plus `app/themes/clubs-bundle.css` (imports every club theme stylesheet).
 * @param {string} root
 */
async function writeClubThemeRegistry(root) {
  const files = await collectDesignFiles(DESIGNS_DIR);
  /** @type {{ id: string; label: string; designDoc: string }[]} */
  const entries = [];

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    let doc;
    try {
      doc = splitFrontmatter(raw);
    } catch {
      continue;
    }
    const d = /** @type {Record<string, unknown>} */ (doc);
    const colors = /** @type {Record<string, string>|undefined} */ (d.colors);
    const colors_light = /** @type {Record<string, string>|undefined} */ (d.colors_light);
    if (!colors?.["surface-container"] || !colors_light?.["surface-container"]) continue;

    const basename = path.basename(file);
    const themeId = String(d.theme_id ?? themeIdFromDesignFilename(basename));
    const label = String(d.name ?? themeId);
    const designDoc = path.relative(root, file).split(path.sep).join("/");
    entries.push({ id: themeId, label, designDoc });
  }

  entries.sort((a, b) => a.label.localeCompare(b.label, "en"));

  const idsLiteral = entries.map((e) => `"${tsEscapeString(e.id)}"`).join(",\n  ");
  const optionsLiteral = entries
    .map(
      (e) =>
        `  { id: "${tsEscapeString(e.id)}", label: "${tsEscapeString(e.label)}", designDoc: "${tsEscapeString(e.designDoc)}" }`,
    )
    .join(",\n");

  const tsOut =
    `/**\n` +
    ` * Auto-generated by scripts/generate-themes-from-designs.mjs — do not edit by hand.\n` +
    ` */\n\n` +
    `export const CLUB_COLOR_THEME_IDS = [\n  ${idsLiteral},\n] as const;\n\n` +
    `export type ClubColorThemeId = (typeof CLUB_COLOR_THEME_IDS)[number];\n\n` +
    `export const CLUB_COLOR_THEME_OPTIONS = [\n${optionsLiteral},\n] as const;\n`;

  const tsPath = path.join(root, "lib", "club-color-themes.generated.ts");
  await fs.writeFile(tsPath, tsOut, "utf8");

  const importLines = entries
    .map((e) => `@import "./clubs/${e.id}.css";`)
    .join("\n");
  const bundle =
    `/* Auto-generated by scripts/generate-themes-from-designs.mjs — do not edit by hand. */\n\n` +
    importLines +
    (importLines ? "\n" : "");

  const bundlePath = path.join(root, "app", "themes", "clubs-bundle.css");
  await fs.writeFile(bundlePath, bundle, "utf8");

  console.log(`\nwrote registry: ${path.relative(root, tsPath)}`);
  console.log(`wrote bundle: ${path.relative(root, bundlePath)} (${entries.length} imports)`);
}

async function main() {
  const args = process.argv.slice(2);
  const nameArg =
    args.find((a) => a.startsWith("--name="))?.split("=", 2)[1] ?? "";

  await fs.mkdir(OUT_DIR, { recursive: true });

  const files = await collectDesignFiles(DESIGNS_DIR);
  let wrote = 0;

  for (const file of files) {
    const basename = path.basename(file);
    const themeIdFromFile = themeIdFromDesignFilename(basename);
    if (!nameMatchesFilter(nameArg, basename, themeIdFromFile)) continue;

    const raw = await fs.readFile(file, "utf8");
    const doc = /** @type {Record<string, unknown>} */ (splitFrontmatter(raw));
    const themeId = String(doc.theme_id ?? themeIdFromFile);
    const colors = /** @type {Record<string, string>|undefined} */ (doc.colors);
    const colors_light = /** @type {Record<string, string>|undefined} */ (
      doc.colors_light
    );

    if (!colors?.["surface-container"] || !colors_light?.["surface-container"]) {
      console.warn(
        `skip (not enriched): ${path.relative(ROOT, file)} — run scripts/enrich-design-docs.mjs first`,
      );
      continue;
    }

    const typeVars = typographyToCssVars(
      /** @type {Record<string, unknown>} */ (doc.typography),
    );
    const radVars = roundedToCssVars(
      /** @type {Record<string, unknown>} */ (doc.rounded),
    );
    const darkBlock = mergeVars(
      mergeVars(mergeVars(radVars, typeVars), designColorsToCssVars(colors)),
    );
    const lightBlock = mergeVars(
      mergeVars(mergeVars(radVars, typeVars), designColorsToCssVars(colors_light)),
    );

    const rel = path.relative(ROOT, file);
    const header = `/* Generated from ${rel} — theme_id: ${themeId}. Do not edit by hand; re-run generate-themes-from-designs.mjs */\n\n`;

    const css =
      header +
      `html[data-color-theme="${themeId}"] {\n` +
      formatCssBlock(darkBlock) +
      "\n}\n\n" +
      `html[data-color-theme="${themeId}"].light {\n` +
      formatCssBlock(lightBlock) +
      "\n}\n";

    const outPath = path.join(OUT_DIR, `${themeId}.css`);
    await fs.writeFile(outPath, css, "utf8");
    wrote++;
    console.log(`wrote: ${path.relative(ROOT, outPath)}`);
  }

  console.log(`\nDone. Wrote ${wrote} theme file(s) under app/themes/clubs/.`);

  await writeClubThemeRegistry(ROOT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
