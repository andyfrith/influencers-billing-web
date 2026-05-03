export type HeroContent = {
  headline: string;
  subheadline: string;
  tagline: string;
  backgroundImage: {
    src: string;
    alt: string;
  };
  cta: {
    items: {
      label: string;
      href: string;
    }[];
  };
};

export type AttentionContent = {
  headline: string;
  subheadline: string;
  cta: {
    items: {
      label: string;
      href: string;
    }[];
  };
};

export type BenefitsContent = {
  headline: string;
  subheadline: string;
  items: BenefitsItemContent[];
};

export type BenefitsItemContent = {
  icon: string;
  image: {
    src: string;
    alt: string;
  };
  headline: string;
  subheadline: string;
};

export type ExploreContent = {
  headline: string;
  subheadline: string;
  cta: {
    label: string;
    href: string;
  };
  items: ExploreItemContent[];
};

export type ExploreItemContent = {
  headline: string;
  preHeadline: string;
  subheadline?: string;
  image: {
    src: string;
    alt: string;
  };
  href: string;
};

export type ClubLandingContent = {
  id: number;
  name: string;
  hero: HeroContent;
  benefits: BenefitsContent;
  explore: ExploreContent;
  attention: AttentionContent;
};

export const clubLandingContent: ClubLandingContent[] = [
  {
    id: 1,
    name: "Vanguard",
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
          headline: "Zenith Health Hub",
          preHeadline: "Wellness & Biohacking",
          subheadline:
            "Precision longevity and holistic recovery in the heart of the city.",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuANMYhsy-5mLnKzINwVz1SViyNUiTkNc_Fv8JYQLK5UTvxCPuVdSEQqHtTun2OyRvDoM1ofTGiQNctHB_KbNsqRum8DnepUBbOxiBRS5vuTVUz8J0aFaSTiRyL3sb0EhNyyvikj6q8Zu3Z4qJvcr_kivKYDQc3rL3OH8rmrrBLTM0aGLx73HJ0SUi0--hL5M3FWl2Z0xeV9md1u-ERBFm2XjMiWWOxmX2n8HLxD54wMlO0yLng1S1rYiIk3BhnVvrdMCL65GYDvYQl6",
            alt: "Zenit Health Hub",
          },
          href: "/clubs/the-academy",
        },
        {
          headline: "The Circuit",
          preHeadline: "Tech & Innovation",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4v-KDfm0D-_MHfe_MsrCpqpOAUruUc0BQp1ovviZ-R1OfDAeES_BGUoJrTZFBdUhRwMT63ejOAMYeMuinF0DmP-DPF9MIGYfPKX5JNkioEdQeiH39QcVwcF12hUJslIr4CLecjGN99SjcZ250e1L8uilIZO5kpaUyqKFQY_dYEAGeppfe2HBi-EGVnLA-DbmXpFFTKgy8tz2qluTGhe5HIDGasByAdM5c1xyHsxbh07RgjADnHyn3EKW07pYsqAKIwrR_HK4dVYer",
            alt: "The Circuit",
          },
          href: "/clubs/the-academy",
        },
        {
          headline: "Vintage Cellars",
          preHeadline: "Culinary & Wine",
          image: {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7hyGmMFTl-jackZ9O-Oeywa1P1RJbmlzgKXgOtIJfxrM5ZnWo7rm9hTUnIbvzHI_0dfOldaEhlVILUWLlR8LkTsBNhKJxGoPy3X_YynJWeIx9qaxhLdY-UwI4LjpTO5EO46QBJXoI5q6-YUz1lHTVzdGqO2Cjpd5BX1qYZwQQ6zq2QXfzfKYxH3rj1eVuuqZCkZAORM05jn39v0szhrALdaAnSwKOtgeE4LtzcBAIwMiB88YURolXXjJRC7tlkLnYJ_lQ0hKdtsP8",
            alt: "Vintage Cellars",
          },
          href: "/clubs/vintage-cellars",
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
];
