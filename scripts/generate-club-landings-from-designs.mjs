#!/usr/bin/env node
/**
 * Reads each club DESIGN.md (via `designDoc` in `lib/club-color-themes.generated.ts`),
 * pulls archetype + Core Concept + UI Patterns, and writes `data/club-landings-from-designs.generated.ts`.
 *
 * Usage: node scripts/generate-club-landings-from-designs.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GEN_TS = path.join(ROOT, "lib", "club-color-themes.generated.ts");
const OUT_TS = path.join(ROOT, "data", "club-landings-from-designs.generated.ts");

const SKIP_THEME_IDS = new Set(["the-academy", "the-greenhouse"]);

const TEMPLATE_HERO = "/images/clubs/template/hero/background.jpg";
const BENEFIT_IMG = {
  a: "/images/clubs/template/benefits/exclusive-access.png",
  b: "/images/clubs/template/benefits/curated-communities.png",
  c: "/images/clubs/template/benefits/elite-benefits.png",
};
const EXPLORE = {
  zenith: {
    headline: "The Zenith",
    preHeadline: "Wellness & recovery",
    subheadline:
      "Longevity, recovery, and performance under one disciplined roof.",
    src: "/images/clubs/template/explore/zenith-health-hub.png",
    href: "/clubs/the-zenith",
  },
  circuit: {
    headline: "The Circuit",
    preHeadline: "Tech & innovation",
    src: "/images/clubs/template/explore/the-circuit.png",
    href: "/clubs/the-circuit",
  },
  vineyard: {
    headline: "The Vineyard",
    preHeadline: "Culinary & wine",
    src: "/images/clubs/template/explore/vintage-cellars.png",
    href: "/clubs/the-vineyard",
  },
};

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
 * @param {string} md
 * @param {string} title
 */
function extractSection(md, title) {
  const re = new RegExp(`^## ${title}\\s*$`, "m");
  const idx = md.search(re);
  if (idx === -1) return "";
  const start = md.indexOf("\n", idx) + 1;
  const rest = md.slice(start);
  const next = rest.search(/^## /m);
  const body = next === -1 ? rest : rest.slice(0, next);
  return body.trim();
}

/**
 * @param {string} section
 * @returns {{ title: string; body: string }[]}
 */
function parseUiBullets(section) {
  const out = [];
  if (!section) return out;
  for (const line of section.split("\n")) {
    const mm = line.match(/^-\s*\*\*([^*]+)\*\*:\s*(.+)$/);
    if (mm) out.push({ title: mm[1].trim(), body: mm[2].trim() });
  }
  return out;
}

/**
 * @param {string} coreConcept
 * @param {string} name
 */
function deriveHeadline(coreConcept, name) {
  const flat = coreConcept
    .replace(/\s+/g, " ")
    .replace(/[\u201c\u201d\u2018\u2019"]/g, "")
    .trim();
  if (!flat) return `Discover ${name}`;
  const sentences =
    flat.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [flat];
  const s0 = sentences[0] ?? "";
  const s1 = sentences[1] ?? "";
  const marketingOpener =
    /^(Ideal for|Perfect for|Great for|Best for|Designed for|Inspired by|An immersive|A high)\s*/i;
  let pick = s1 && marketingOpener.test(s0) ? s1 : s0;
  pick = pick.replace(/\.$/, "").trim();
  if (pick.length > 64) pick = `${pick.slice(0, 61)}…`;
  if (!pick) return `Discover ${name}`;
  return pick;
}

/**
 * @param {string} coreConcept
 * @param {string} archetype
 */
function deriveSubheadline(coreConcept, archetype) {
  const flat = coreConcept
    .replace(/\s+/g, " ")
    .replace(/[\u201c\u201d\u2018\u2019"]/g, "")
    .trim();
  let out = flat;
  if (out.length > 280) out = `${out.slice(0, 277)}…`;
  if (!out) {
    out = `A membership experience aligned with the ${archetype} direction—crafted for people who care how things look, feel, and behave.`;
  }
  return out;
}

/**
 * @param {{ title: string; body: string }[]} bullets
 * @param {string} archetype
 * @param {string} name
 */
function buildBenefitItems(bullets, archetype, name) {
  const icons = ["key", "groups", "diamond"];
  const imgs = [BENEFIT_IMG.a, BENEFIT_IMG.b, BENEFIT_IMG.c];
  const items = [];
  for (let i = 0; i < 3; i++) {
    const b = bullets[i];
    if (b) {
      items.push({
        icon: icons[i],
        image: { src: imgs[i], alt: b.title },
        headline: b.title,
        subheadline: b.body,
      });
    } else {
      const fallbacks = [
        {
          headline: "Signature access",
          subheadline: `Member-first drops, salons, and partner perks tuned to how ${name} members move through the world.`,
        },
        {
          headline: "Curated peers",
          subheadline: `Circles and introductions shaped by the ${archetype} lens—less noise, more signal.`,
        },
        {
          headline: "Concierge layer",
          subheadline:
            "Human support for travel, dining, logistics, and the details that compound over time.",
        },
      ];
      const f = fallbacks[i];
      items.push({
        icon: icons[i],
        image: { src: imgs[i], alt: f.headline },
        headline: f.headline,
        subheadline: f.subheadline,
      });
    }
  }
  return items;
}

/**
 * @returns {Promise<{ id: string; label: string; designDoc: string }[]>}
 */
async function readClubThemeOptions() {
  const text = await fs.readFile(GEN_TS, "utf8");
  const re =
    /\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*designDoc:\s*"([^"]+)"\s*\}/g;
  const options = [];
  let m;
  while ((m = re.exec(text))) {
    options.push({ id: m[1], label: m[2], designDoc: m[3] });
  }
  return options;
}

async function main() {
  const options = await readClubThemeOptions();
  let nextId = 4;
  const entries = [];

  for (const opt of options) {
    if (SKIP_THEME_IDS.has(opt.id)) continue;

    const docPath = path.join(ROOT, opt.designDoc);
    let raw;
    try {
      raw = await fs.readFile(docPath, "utf8");
    } catch (e) {
      throw new Error(`Missing design doc for ${opt.id}: ${opt.designDoc}`, {
        cause: e,
      });
    }

    const fm = splitFrontmatter(raw);
    const name = fm.name ?? opt.label;
    const archetype =
      typeof fm.archetype === "string" && fm.archetype.trim()
        ? fm.archetype.trim()
        : "Member experience";
    const themeId = fm.theme_id ?? opt.id;
    const body = raw.includes("\n---\n\n")
      ? raw.split("\n---\n\n").slice(1).join("\n---\n\n")
      : raw;

    const coreConcept = extractSection(body, "Core Concept");
    const uiPatterns = extractSection(body, "UI Patterns");
    const bullets = parseUiBullets(uiPatterns);

    const clubHref = `/clubs/${themeId}`;
    const headline = deriveHeadline(coreConcept, name);
    const subheadline = deriveSubheadline(coreConcept, archetype);
    const tagline =
      archetype.length > 90 ? `${archetype.slice(0, 87)}…` : archetype;

    entries.push({
      id: nextId++,
      name,
      colorThemeId: themeId,
      hero: {
        headline,
        subheadline,
        tagline,
        backgroundImage: {
          src: TEMPLATE_HERO,
          alt: name,
        },
        cta: {
          items: [
            { label: `Join ${name}`, href: clubHref },
            { label: "Explore Clubs", href: "/clubs" },
          ],
        },
      },
      benefits: {
        headline: `Why ${name} fits you`,
        subheadline: `Three signals from the design language—rooted in the ${archetype} archetype and the way this house shows up in product.`,
        items: buildBenefitItems(bullets, archetype, name),
      },
      explore: {
        headline: "More houses in the network",
        subheadline:
          "Move between clubs as your ambitions evolve—each house keeps its own palette, program, and point of view.",
        cta: { label: "Discover more", href: clubHref },
        items: [
          {
            headline: EXPLORE.zenith.headline,
            preHeadline: EXPLORE.zenith.preHeadline,
            subheadline: EXPLORE.zenith.subheadline,
            image: { src: EXPLORE.zenith.src, alt: EXPLORE.zenith.headline },
            href: EXPLORE.zenith.href,
          },
          {
            headline: EXPLORE.circuit.headline,
            preHeadline: EXPLORE.circuit.preHeadline,
            image: { src: EXPLORE.circuit.src, alt: EXPLORE.circuit.headline },
            href: EXPLORE.circuit.href,
          },
          {
            headline: EXPLORE.vineyard.headline,
            preHeadline: EXPLORE.vineyard.preHeadline,
            image: { src: EXPLORE.vineyard.src, alt: EXPLORE.vineyard.headline },
            href: EXPLORE.vineyard.href,
          },
        ],
      },
      attention: {
        headline: `Begin with ${name}`,
        subheadline: `${name} admits on a rolling basis. Share a bit about your work and cadence—we will respond with fit, timing, and the right next step.`,
        cta: {
          items: [
            { label: "Apply for membership", href: clubHref },
            { label: "Speak with an advisor", href: "/contact" },
          ],
        },
      },
    });
  }

  const banner = `/**
 * Auto-generated by scripts/generate-club-landings-from-designs.mjs — do not edit by hand.
 * Source: designs/ via lib/club-color-themes.generated.ts designDoc paths.
 * Re-run: bun run club-landings:generate
 */
import type { ClubLandingContent } from "./club-landing-types";

export const CLUB_LANDINGS_FROM_DESIGNS: ClubLandingContent[] = `;

  await fs.writeFile(
    OUT_TS,
    `${banner}${JSON.stringify(entries, null, 2)};\n`,
    "utf8",
  );
  console.log(`Wrote ${entries.length} club landings -> ${path.relative(ROOT, OUT_TS)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
