import { CLUB_COLOR_THEME_IDS } from "@/lib/club-color-themes.generated";
import type { ColorThemeId } from "@/lib/color-themes";
import { DEFAULT_COLOR_THEME_ID } from "@/lib/color-themes";

import { CLUB_LANDINGS_FROM_DESIGNS } from "./club-landings-from-designs.generated";
import type { ClubLandingContent } from "./club-landing-types";

export type {
  AttentionContent,
  BenefitsContent,
  BenefitsItemContent,
  ClubLandingContent,
  ExploreContent,
  ExploreItemContent,
  HeroContent,
} from "./club-landing-types";

export const clubLandingContent: ClubLandingContent[] = [
  {
    id: 1,
    name: "The Academy",
    colorThemeId: "the-academy",
    hero: {
      headline: "Access the Extraordinary",
      subheadline:
        "Join world-class innovators, wellness leaders, and creators. Elevate your lifestyle with curated access to the most exclusive communities and experiences around the globe.",
      tagline: "The future of membership",
      backgroundImage: {
        src: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1800&q=80",
        alt: "The Academy",
      },
      cta: {
        items: [
          {
            label: "Join The Academy",
            href: "/clubs/the-academy",
          },
          {
            label: "Explore Clubs",
            href: "/clubs",
          },
        ],
      },
    },
    benefits: {
      headline: "Redefining Premium Living",
      subheadline:
        "Every membership is a passport to unmatched privileges and meaningful connections.",
      items: [
        {
          icon: "key",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuANMYhsy-5mLnKzINwVz1SViyNUiTkNc_Fv8JYQLK5UTvxCPuVdSEQqHtTun2OyRvDoM1ofTGiQNctHB_KbNsqRum8DnepUBbOxiBRS5vuTVUz8J0aFaSTiRyL3sb0EhNyyvikj6q8Zu3Z4qJvcr_kivKYDQc3rL3OH8rmrrBLTM0aGLx73HJ0SUi0--hL5M3FWl2Z0xeV9md1u-ERBFm2XjMiWWOxmX2n8HLxD54wMlO0yLng1S1rYiIk3BhnVvrdMCL65GYDvYQl6",
            alt: "Exclusive Access",
          },
          headline: "Exclusive Access",
          subheadline:
            "Unfiltered entry to private events, invitation-only galas, and global retreats designed for the few.",
        },
        {
          icon: "groups",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4v-KDfm0D-_MHfe_MsrCpqpOAUruUc0BQp1ovviZ-R1OfDAeES_BGUoJrTZFBdUhRwMT63ejOAMYeMuinF0DmP-DPF9MIGYfPKX5JNkioEdQeiH39QcVwcF12hUJslIr4CLecjGN99SjcZ250e1L8uilIZO5kpaUyqKFQY_dYEAGeppfe2HBi-EGVnLA-DbmXpFFTKgy8tz2qluTGhe5HIDGasByAdM5c1xyHsxbh07RgjADnHyn3EKW07pYsqAKIwrR_HK4dVYer",
            alt: "Curated Communities",
          },
          headline: "Curated Communities",
          subheadline:
            "Forge powerful alliances within niche circles tailored to your industry, interests, and lifestyle.",
        },
        {
          icon: "diamond",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7hyGmMFTl-jackZ9O-Oeywa1P1RJbmlzgKXgOtIJfxrM5ZnWo7rm9hTUnIbvzHI_0dfOldaEhlVILUWLlR8LkTsBNhKJxGoPy3X_YynJWeIx9qaxhLdY-UwI4LjpTO5EO46QBJXoI5q6-YUz1lHTVzdGqO2Cjpd5BX1qYZwQQ6zq2QXfzfKYxH3rj1eVuuqZCkZAORM05jn39v0szhrALdaAnSwKOtgeE4LtzcBAIwMiB88YURolXXjJRC7tlkLnYJ_lQ0hKdtsP8",
            alt: "Elite Benefits",
          },
          headline: "Elite Benefits",
          subheadline:
            "24/7 concierge service, bespoke travel itineraries, and prioritized treatment at global luxury partners.",
        },
      ],
    },
    explore: {
      headline: "Explore Our Communities",
      subheadline:
        "From wellness and innovation to hospitality and fine dining, find the club that reflects your ambitions.",
      cta: {
        label: "Discover More",
        href: "/clubs/the-academy",
      },
      items: [
        {
          headline: "The Zenith",
          preHeadline: "Wellness & Biohacking",
          subheadline:
            "Precision longevity and holistic recovery in the heart of the city.",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuANMYhsy-5mLnKzINwVz1SViyNUiTkNc_Fv8JYQLK5UTvxCPuVdSEQqHtTun2OyRvDoM1ofTGiQNctHB_KbNsqRum8DnepUBbOxiBRS5vuTVUz8J0aFaSTiRyL3sb0EhNyyvikj6q8Zu3Z4qJvcr_kivKYDQc3rL3OH8rmrrBLTM0aGLx73HJ0SUi0--hL5M3FWl2Z0xeV9md1u-ERBFm2XjMiWWOxmX2n8HLxD54wMlO0yLng1S1rYiIk3BhnVvrdMCL65GYDvYQl6",
            alt: "The Zenith",
          },
          href: "/clubs/the-zenith",
        },
        {
          headline: "The Circuit",
          preHeadline: "Tech & Innovation",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4v-KDfm0D-_MHfe_MsrCpqpOAUruUc0BQp1ovviZ-R1OfDAeES_BGUoJrTZFBdUhRwMT63ejOAMYeMuinF0DmP-DPF9MIGYfPKX5JNkioEdQeiH39QcVwcF12hUJslIr4CLecjGN99SjcZ250e1L8uilIZO5kpaUyqKFQY_dYEAGeppfe2HBi-EGVnLA-DbmXpFFTKgy8tz2qluTGhe5HIDGasByAdM5c1xyHsxbh07RgjADnHyn3EKW07pYsqAKIwrR_HK4dVYer",
            alt: "The Circuit",
          },
          href: "/clubs/the-circuit",
        },
        {
          headline: "The Vineyard",
          preHeadline: "Culinary & Wine",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7hyGmMFTl-jackZ9O-Oeywa1P1RJbmlzgKXgOtIJfxrM5ZnWo7rm9hTUnIbvzHI_0dfOldaEhlVILUWLlR8LkTsBNhKJxGoPy3X_YynJWeIx9qaxhLdY-UwI4LjpTO5EO46QBJXoI5q6-YUz1lHTVzdGqO2Cjpd5BX1qYZwQQ6zq2QXfzfKYxH3rj1eVuuqZCkZAORM05jn39v0szhrALdaAnSwKOtgeE4LtzcBAIwMiB88YURolXXjJRC7tlkLnYJ_lQ0hKdtsP8",
            alt: "The Vineyard",
          },
          href: "/clubs/the-vineyard",
        },
      ],
    },
    attention: {
      headline: "Your Seat is Reserved",
      subheadline:
        "Application for membership is now open. Join the next generation of global leadership and claim your place at The Academy.",
      cta: {
        items: [
          {
            label: "Apply for Membership",
            href: "/clubs/the-academy",
          },
          {
            label: "Speak with an Advisor",
            href: "/contact",
          },
        ],
      },
    },
  },
  {
    id: 2,
    name: "The Greenhouse",
    colorThemeId: "the-greenhouse",
    hero: {
      headline: "Grow at Your Own Pace",
      subheadline:
        "A soft, organic membership space for wellness seekers, makers, and anyone building a calmer, more sustainable rhythm. Warm light, rounded edges, and community that feels like home.",
      tagline: "Organic membership, human scale",
      backgroundImage: {
        src: "https://images.unsplash.com/photo-1585320806297-9794b65e7f88?auto=format&fit=crop&w=1800&q=80",
        alt: "The Greenhouse — sunlit glasshouse filled with lush plants",
      },
      cta: {
        items: [
          {
            label: "Step Inside The Greenhouse",
            href: "/clubs/the-greenhouse",
          },
          {
            label: "Explore Clubs",
            href: "/clubs",
          },
        ],
      },
    },
    benefits: {
      headline: "Cultivate What Matters",
      subheadline:
        "Thoughtful perks and gentle structure so you can focus on growth—personal, creative, or collective—without the noise.",
      items: [
        {
          icon: "key",
          image: {
            src: "/images/clubs/template/benefits/exclusive-access.png",
            alt: "First pick on seasonal experiences",
          },
          headline: "First Light Access",
          subheadline:
            "Early entry to workshops, garden walks, and intimate gatherings before they open to the wider network.",
        },
        {
          icon: "groups",
          image: {
            src: "/images/clubs/template/benefits/curated-communities.png",
            alt: "Small circles of growers and makers",
          },
          headline: "Rooted Circles",
          subheadline:
            "Meet people who share your pace—growers, restorers, and builders who trade ideas as easily as seeds.",
        },
        {
          icon: "diamond",
          image: {
            src: "/images/clubs/template/benefits/elite-benefits.png",
            alt: "Partners tuned to sustainable living",
          },
          headline: "Always in Season",
          subheadline:
            "Partner offers and tools chosen for low-impact living: from soil-to-table dining to mindful travel.",
        },
      ],
    },
    explore: {
      headline: "More Rooms in the Garden",
      subheadline:
        "Wander into neighboring clubs—each with its own atmosphere—until you find the one that fits today.",
      cta: {
        label: "Discover More",
        href: "/clubs/the-greenhouse",
      },
      items: [
        {
          headline: "The Zenith",
          preHeadline: "Wellness & recovery",
          subheadline:
            "Soft light, breathwork, and recovery rituals designed for nervous systems that need a break.",
          image: {
            src: "/images/clubs/template/explore/zenith-health-hub.png",
            alt: "The Zenith",
          },
          href: "/clubs/the-zenith",
        },
        {
          headline: "The Circuit",
          preHeadline: "Tech & innovation",
          image: {
            src: "/images/clubs/template/explore/the-circuit.png",
            alt: "The Circuit",
          },
          href: "/clubs/the-circuit",
        },
        {
          headline: "The Vineyard",
          preHeadline: "Culinary & wine",
          image: {
            src: "/images/clubs/template/explore/vintage-cellars.png",
            alt: "The Vineyard",
          },
          href: "/clubs/the-vineyard",
        },
      ],
    },
    attention: {
      headline: "Save a Spot on the Bench",
      subheadline:
        "Memberships for The Greenhouse open in small cohorts so the community stays personal. Apply now and we will walk you through the next window.",
      cta: {
        items: [
          {
            label: "Request an Invite",
            href: "/clubs/the-greenhouse",
          },
          {
            label: "Speak with an Advisor",
            href: "/contact",
          },
        ],
      },
    },
  },
  {
    id: 3,
    name: "Vanguard",
    colorThemeId: DEFAULT_COLOR_THEME_ID,
    hero: {
      headline: "Access the Extraordinary",
      subheadline:
        "Join world-class innovators, wellness leaders, and creators. Elevate your lifestyle with curated access to the most exclusive communities and experiences around the globe.",
      tagline: "The future of membership",
      backgroundImage: {
        src: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1800&q=80",
        alt: "The Vanguard",
      },
      cta: {
        items: [
          {
            label: "Join the Vanguard",
            href: "/clubs/the-vanguard",
          },
          {
            label: "Explore Clubs",
            href: "/clubs",
          },
        ],
      },
    },
    benefits: {
      headline: "Redefining Premium Living",
      subheadline:
        "Every membership is a passport to unmatched privileges and meaningful connections.",
      items: [
        {
          icon: "key",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuANMYhsy-5mLnKzINwVz1SViyNUiTkNc_Fv8JYQLK5UTvxCPuVdSEQqHtTun2OyRvDoM1ofTGiQNctHB_KbNsqRum8DnepUBbOxiBRS5vuTVUz8J0aFaSTiRyL3sb0EhNyyvikj6q8Zu3Z4qJvcr_kivKYDQc3rL3OH8rmrrBLTM0aGLx73HJ0SUi0--hL5M3FWl2Z0xeV9md1u-ERBFm2XjMiWWOxmX2n8HLxD54wMlO0yLng1S1rYiIk3BhnVvrdMCL65GYDvYQl6",
            alt: "Exclusive Access",
          },
          headline: "Exclusive Access",
          subheadline:
            "Unfiltered entry to private events, invitation-only galas, and global retreats designed for the few.",
        },
        {
          icon: "groups",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4v-KDfm0D-_MHfe_MsrCpqpOAUruUc0BQp1ovviZ-R1OfDAeES_BGUoJrTZFBdUhRwMT63ejOAMYeMuinF0DmP-DPF9MIGYfPKX5JNkioEdQeiH39QcVwcF12hUJslIr4CLecjGN99SjcZ250e1L8uilIZO5kpaUyqKFQY_dYEAGeppfe2HBi-EGVnLA-DbmXpFFTKgy8tz2qluTGhe5HIDGasByAdM5c1xyHsxbh07RgjADnHyn3EKW07pYsqAKIwrR_HK4dVYer",
            alt: "Curated Communities",
          },
          headline: "Curated Communities",
          subheadline:
            "Forge powerful alliances within niche circles tailored to your industry, interests, and lifestyle.",
        },
        {
          icon: "diamond",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7hyGmMFTl-jackZ9O-Oeywa1P1RJbmlzgKXgOtIJfxrM5ZnWo7rm9hTUnIbvzHI_0dfOldaEhlVILUWLlR8LkTsBNhKJxGoPy3X_YynJWeIx9qaxhLdY-UwI4LjpTO5EO46QBJXoI5q6-YUz1lHTVzdGqO2Cjpd5BX1qYZwQQ6zq2QXfzfKYxH3rj1eVuuqZCkZAORM05jn39v0szhrALdaAnSwKOtgeE4LtzcBAIwMiB88YURolXXjJRC7tlkLnYJ_lQ0hKdtsP8",
            alt: "Elite Benefits",
          },
          headline: "Elite Benefits",
          subheadline:
            "24/7 concierge service, bespoke travel itineraries, and prioritized treatment at global luxury partners.",
        },
      ],
    },
    explore: {
      headline: "Explore Our Communities",
      subheadline:
        "From wellness and innovation to hospitality and fine dining, find the club that reflects your ambitions.",
      cta: {
        label: "Discover More",
        href: "/clubs/the-vanguard",
      },
      items: [
        {
          headline: "The Zenith",
          preHeadline: "Wellness & Biohacking",
          subheadline:
            "Precision longevity and holistic recovery in the heart of the city.",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuANMYhsy-5mLnKzINwVz1SViyNUiTkNc_Fv8JYQLK5UTvxCPuVdSEQqHtTun2OyRvDoM1ofTGiQNctHB_KbNsqRum8DnepUBbOxiBRS5vuTVUz8J0aFaSTiRyL3sb0EhNyyvikj6q8Zu3Z4qJvcr_kivKYDQc3rL3OH8rmrrBLTM0aGLx73HJ0SUi0--hL5M3FWl2Z0xeV9md1u-ERBFm2XjMiWWOxmX2n8HLxD54wMlO0yLng1S1rYiIk3BhnVvrdMCL65GYDvYQl6",
            alt: "The Zenith",
          },
          href: "/clubs/the-zenith",
        },
        {
          headline: "The Circuit",
          preHeadline: "Tech & Innovation",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4v-KDfm0D-_MHfe_MsrCpqpOAUruUc0BQp1ovviZ-R1OfDAeES_BGUoJrTZFBdUhRwMT63ejOAMYeMuinF0DmP-DPF9MIGYfPKX5JNkioEdQeiH39QcVwcF12hUJslIr4CLecjGN99SjcZ250e1L8uilIZO5kpaUyqKFQY_dYEAGeppfe2HBi-EGVnLA-DbmXpFFTKgy8tz2qluTGhe5HIDGasByAdM5c1xyHsxbh07RgjADnHyn3EKW07pYsqAKIwrR_HK4dVYer",
            alt: "The Circuit",
          },
          href: "/clubs/the-circuit",
        },
        {
          headline: "The Vineyard",
          preHeadline: "Culinary & Wine",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7hyGmMFTl-jackZ9O-Oeywa1P1RJbmlzgKXgOtIJfxrM5ZnWo7rm9hTUnIbvzHI_0dfOldaEhlVILUWLlR8LkTsBNhKJxGoPy3X_YynJWeIx9qaxhLdY-UwI4LjpTO5EO46QBJXoI5q6-YUz1lHTVzdGqO2Cjpd5BX1qYZwQQ6zq2QXfzfKYxH3rj1eVuuqZCkZAORM05jn39v0szhrALdaAnSwKOtgeE4LtzcBAIwMiB88YURolXXjJRC7tlkLnYJ_lQ0hKdtsP8",
            alt: "The Vineyard",
          },
          href: "/clubs/the-vineyard",
        },
      ],
    },
    attention: {
      headline: "Your Seat is Reserved",
      subheadline:
        "Application for membership is now open. Join the next generation of global leadership and claim your place in the Vanguard.",
      cta: {
        items: [
          {
            label: "Apply for Membership",
            href: "/clubs/the-vanguard",
          },
          {
            label: "Speak with an Advisor",
            href: "/contact",
          },
        ],
      },
    },
  },
  ...CLUB_LANDINGS_FROM_DESIGNS,
];

/** Slug used for `/discover/clubs` and for unknown `/discover/clubs/<slug>` values. */
export const DEFAULT_CLUB_LANDING_SLUG = "the-academy";

/**
 * Converts a club `name` from `clubLandingContent` into a URL path segment (kebab-case, lowercase).
 */
export function clubLandingDisplayNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns landing content for an exact slug match, or `undefined` if no club uses that slug.
 */
export function findClubLandingContentBySlug(
  slug: string,
): ClubLandingContent | undefined {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  return clubLandingContent.find(
    (entry) => clubLandingDisplayNameToSlug(entry.name) === normalized,
  );
}

/**
 * Resolves landing page content from a URL slug. Empty, unknown, or missing slug falls back to
 * {@link DEFAULT_CLUB_LANDING_SLUG}, then the first entry in {@link clubLandingContent}.
 */
export function resolveClubLandingContent(
  slug: string | undefined,
): ClubLandingContent {
  const trimmed = slug?.trim();
  const match =
    trimmed != null && trimmed !== ""
      ? findClubLandingContentBySlug(trimmed)
      : undefined;
  if (match) {
    return match;
  }
  return (
    findClubLandingContentBySlug(DEFAULT_CLUB_LANDING_SLUG) ??
    clubLandingContent[0]
  );
}

/**
 * Resolves the color theme id for a discover URL slug (including default / unknown slugs).
 * Used by middleware and must stay in sync with {@link resolveClubLandingContent}.
 */
export function resolveClubLandingColorThemeId(
  slugFromPath: string | undefined,
): ColorThemeId {
  return resolveClubLandingContent(slugFromPath).colorThemeId;
}

function isClubGeneratedColorThemeId(themeId: ColorThemeId): boolean {
  return (CLUB_COLOR_THEME_IDS as readonly string[]).includes(themeId);
}

/**
 * `/discover/clubs/<slug>` path segment for a color theme when a landing row uses that club CSS
 * theme. Core palette options and clubs that reuse a core theme (e.g. Vanguard) return `undefined`.
 */
export function discoverSlugForColorThemeId(
  themeId: ColorThemeId,
): string | undefined {
  if (!isClubGeneratedColorThemeId(themeId)) {
    return undefined;
  }
  const entry = clubLandingContent.find((c) => c.colorThemeId === themeId);
  return entry ? clubLandingDisplayNameToSlug(entry.name) : undefined;
}
