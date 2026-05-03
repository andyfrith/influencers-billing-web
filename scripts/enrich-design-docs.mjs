#!/usr/bin/env node
/**
 * Enriches Markdown design specs under `designs/` (suffix `-DESIGN.md`) with the same frontmatter variables as root DESIGN.md
 * (full `colors`, `colors_light`, `typography`, `rounded`, `spacing`), while preserving
 * the original compact palette under `club_palette`.
 *
 * Usage:
 *   node scripts/enrich-design-docs.mjs
 *   node scripts/enrich-design-docs.mjs --name=TheCircuit
 *   node scripts/enrich-design-docs.mjs --name=AlpineTrek-DESIGN.md
 *   node scripts/enrich-design-docs.mjs --force
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import {
  inferDarkModeFromLight,
  inferLightModeFromDark,
  normalizeClubSeed,
} from "./lib/club-palette-fallback.mjs";
import { deriveMaterialColorsFromSeed } from "./lib/derive-design-colors.mjs";
import {
  buildTypographyBlock,
  GOLD_STANDARD_ROUNDED,
  GOLD_STANDARD_SPACING,
} from "./lib/design-constants.mjs";
import { themeIdFromDesignFilename } from "./lib/theme-id.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DESIGNS_DIR = path.join(ROOT, "designs");

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
 * @returns {{ yaml: unknown; body: string }}
 */
function splitFrontmatter(raw) {
  if (!raw.startsWith("---")) {
    throw new Error("Expected YAML frontmatter opening ---");
  }
  const nl = raw.startsWith("---\r\n") ? 5 : raw.startsWith("---\n") ? 4 : null;
  if (nl === null) throw new Error("Expected newline after opening ---");
  const rest = raw.slice(nl);
  const endMatch = rest.match(/\r?\n---\r?\n/);
  if (!endMatch || endMatch.index === undefined) {
    throw new Error("Expected closing --- for frontmatter");
  }
  const yamlSrc = rest.slice(0, endMatch.index);
  const body = rest.slice(endMatch.index + endMatch[0].length);
  return { yaml: YAML.parse(yamlSrc), body };
}

/**
 * @param {unknown} doc
 * @returns {boolean}
 */
function isAlreadyEnriched(doc) {
  if (!doc || typeof doc !== "object") return false;
  const d = /** @type {Record<string, unknown>} */ (doc);
  return Boolean(
    d.club_palette &&
      d.colors &&
      typeof d.colors === "object" &&
      d.colors_light &&
      /** @type {Record<string, unknown>} */ (d.colors)["surface-container"],
  );
}

/**
 * @param {string} nameArg
 * @param {string} basename
 * @param {string} themeId
 * @returns {boolean}
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
 * @param {Record<string, unknown>} doc
 * @returns {{
 *   light: Record<string, string> | null;
 *   dark: Record<string, string> | null;
 * }}
 */
function extractClubSeeds(doc) {
  const cp = /** @type {Record<string, unknown>} */ (doc.club_palette || {});
  if (cp.light_mode && cp.dark_mode) {
    return {
      light: /** @type {Record<string, string>} */ (cp.light_mode),
      dark: /** @type {Record<string, string>} */ (cp.dark_mode),
    };
  }
  if (cp.light_mode && !cp.dark_mode) {
    return {
      light: /** @type {Record<string, string>} */ (cp.light_mode),
      dark: null,
    };
  }
  if (cp.dark_mode && !cp.light_mode) {
    return {
      light: null,
      dark: /** @type {Record<string, string>} */ (cp.dark_mode),
    };
  }
  const colors = /** @type {Record<string, unknown>} */ (doc.colors || {});
  if (colors.light_mode && colors.dark_mode) {
    return {
      light: /** @type {Record<string, string>} */ (colors.light_mode),
      dark: /** @type {Record<string, string>} */ (colors.dark_mode),
    };
  }
  if (colors.light_mode) {
    return {
      light: /** @type {Record<string, string>} */ (colors.light_mode),
      dark: colors.dark_mode
        ? /** @type {Record<string, string>} */ (colors.dark_mode)
        : null,
    };
  }
  if (colors.dark_mode) {
    return {
      light: null,
      dark: /** @type {Record<string, string>} */ (colors.dark_mode),
    };
  }
  throw new Error("Missing club_palette or colors with light_mode and/or dark_mode");
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const nameArg =
    args.find((a) => a.startsWith("--name="))?.split("=", 2)[1] ?? "";

  const files = await collectDesignFiles(DESIGNS_DIR);
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const basename = path.basename(file);
    const themeId = themeIdFromDesignFilename(basename);
    if (!nameMatchesFilter(nameArg, basename, themeId)) continue;

    const raw = await fs.readFile(file, "utf8");
    const { yaml: docUnknown, body } = splitFrontmatter(raw);
    const doc = /** @type {Record<string, unknown>} */ (docUnknown || {});

    if (isAlreadyEnriched(doc) && !force) {
      skipped++;
      continue;
    }

    const { light: lightRaw, dark: darkRaw } = extractClubSeeds(doc);
    if (!lightRaw && !darkRaw) {
      throw new Error(`${file}: extractClubSeeds returned no palettes`);
    }
    const lightSeed = lightRaw
      ? normalizeClubSeed(lightRaw)
      : normalizeClubSeed(inferLightModeFromDark(/** @type {Record<string, string>} */ (darkRaw)));
    const darkSeed = darkRaw
      ? normalizeClubSeed(darkRaw)
      : inferDarkModeFromLight(/** @type {Record<string, string>} */ (lightRaw));
    const colors = deriveMaterialColorsFromSeed(darkSeed);
    const colors_light = deriveMaterialColorsFromSeed(lightSeed);

    const themeName = String(doc.theme_name ?? doc.name ?? basename).replace(/^["']|["']$/g, "");
    const headingHint =
      typeof doc.typography === "object" && doc.typography
        ? String(/** @type {Record<string, unknown>} */ (doc.typography).headings ?? "")
        : "";
    const bodyHint =
      typeof doc.typography === "object" && doc.typography
        ? String(/** @type {Record<string, unknown>} */ (doc.typography).body ?? "")
        : "";
    const scale =
      typeof doc.typography === "object" && doc.typography
        ? Number(/** @type {Record<string, unknown>} */ (doc.typography).scale ?? 1) || 1
        : 1;

    /**
     * @param {Record<string, string>} raw
     */
    function seedForDoc(raw) {
      return {
        primary: String(raw.primary ?? ""),
        secondary: String(raw.secondary ?? raw.primary ?? ""),
        accent: String(raw.accent ?? raw.secondary ?? raw.primary ?? ""),
        background: String(raw.background ?? ""),
        surface: String(raw.surface ?? "#ffffff"),
        text: String(raw.text ?? ""),
      };
    }

    const club_palette = {
      light_mode: lightRaw
        ? seedForDoc(lightRaw)
        : seedForDoc(inferLightModeFromDark(/** @type {Record<string, string>} */ (darkRaw))),
      dark_mode: darkRaw
        ? seedForDoc(darkRaw)
        : seedForDoc(inferDarkModeFromLight(/** @type {Record<string, string>} */ (lightRaw))),
    };

    const next = {
      name: themeName,
      theme_id: themeId,
      version: doc.version ?? 1.0,
      archetype: doc.archetype ?? "",
      club_palette,
      colors,
      colors_light,
      typography: buildTypographyBlock(headingHint, bodyHint, scale),
      rounded: GOLD_STANDARD_ROUNDED,
      spacing: GOLD_STANDARD_SPACING,
    };

    const yamlOut =
      "---\n" +
      YAML.stringify(next, {
        lineWidth: 100,
        defaultStringType: "QUOTE_DOUBLE",
        defaultKeyType: "PLAIN",
      }) +
      "\n---\n\n" +
      body;

    await fs.writeFile(file, yamlOut, "utf8");
    updated++;
    console.log(`enriched: ${path.relative(ROOT, file)} (${themeId})`);
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped} (already enriched).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
