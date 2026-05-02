import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Landing from "@/components/clubs/vanguard/landing";

type Feature = {
  icon: string;
  title: string;
  description: string;
  imageUrl: string;
};

type Club = {
  category: string;
  name: string;
  description: string;
  imageUrl: string;
};

const features: Feature[] = [
  {
    icon: "key",
    title: "Exclusive Access",
    description:
      "Unfiltered entry to private events, invitation-only galas, and global retreats designed for the few.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANMYhsy-5mLnKzINwVz1SViyNUiTkNc_Fv8JYQLK5UTvxCPuVdSEQqHtTun2OyRvDoM1ofTGiQNctHB_KbNsqRum8DnepUBbOxiBRS5vuTVUz8J0aFaSTiRyL3sb0EhNyyvikj6q8Zu3Z4qJvcr_kivKYDQc3rL3OH8rmrrBLTM0aGLx73HJ0SUi0--hL5M3FWl2Z0xeV9md1u-ERBFm2XjMiWWOxmX2n8HLxD54wMlO0yLng1S1rYiIk3BhnVvrdMCL65GYDvYQl6",
  },
  {
    icon: "groups",
    title: "Curated Communities",
    description:
      "Forge powerful alliances within niche circles tailored to your industry, interests, and lifestyle.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4v-KDfm0D-_MHfe_MsrCpqpOAUruUc0BQp1ovviZ-R1OfDAeES_BGUoJrTZFBdUhRwMT63ejOAMYeMuinF0DmP-DPF9MIGYfPKX5JNkioEdQeiH39QcVwcF12hUJslIr4CLecjGN99SjcZ250e1L8uilIZO5kpaUyqKFQY_dYEAGeppfe2HBi-EGVnLA-DbmXpFFTKgy8tz2qluTGhe5HIDGasByAdM5c1xyHsxbh07RgjADnHyn3EKW07pYsqAKIwrR_HK4dVYer",
  },
  {
    icon: "diamond",
    title: "Elite Benefits",
    description:
      "24/7 concierge service, bespoke travel itineraries, and prioritized treatment at global luxury partners.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA7hyGmMFTl-jackZ9O-Oeywa1P1RJbmlzgKXgOtIJfxrM5ZnWo7rm9hTUnIbvzHI_0dfOldaEhlVILUWLlR8LkTsBNhKJxGoPy3X_YynJWeIx9qaxhLdY-UwI4LjpTO5EO46QBJXoI5q6-YUz1lHTVzdGqO2Cjpd5BX1qYZwQQ6zq2QXfzfKYxH3rj1eVuuqZCkZAORM05jn39v0szhrALdaAnSwKOtgeE4LtzcBAIwMiB88YURolXXjJRC7tlkLnYJ_lQ0hKdtsP8",
  },
];

const clubs: Club[] = [
  {
    category: "Wellness & Biohacking",
    name: "Zenith Health Hub",
    description:
      "Precision longevity and holistic recovery in the heart of the city.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANMYhsy-5mLnKzINwVz1SViyNUiTkNc_Fv8JYQLK5UTvxCPuVdSEQqHtTun2OyRvDoM1ofTGiQNctHB_KbNsqRum8DnepUBbOxiBRS5vuTVUz8J0aFaSTiRyL3sb0EhNyyvikj6q8Zu3Z4qJvcr_kivKYDQc3rL3OH8rmrrBLTM0aGLx73HJ0SUi0--hL5M3FWl2Z0xeV9md1u-ERBFm2XjMiWWOxmX2n8HLxD54wMlO0yLng1S1rYiIk3BhnVvrdMCL65GYDvYQl6",
  },
  {
    category: "Tech & Innovation",
    name: "The Circuit",
    description:
      "A private nexus for founders, operators, and investors shaping tomorrow.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4v-KDfm0D-_MHfe_MsrCpqpOAUruUc0BQp1ovviZ-R1OfDAeES_BGUoJrTZFBdUhRwMT63ejOAMYeMuinF0DmP-DPF9MIGYfPKX5JNkioEdQeiH39QcVwcF12hUJslIr4CLecjGN99SjcZ250e1L8uilIZO5kpaUyqKFQY_dYEAGeppfe2HBi-EGVnLA-DbmXpFFTKgy8tz2qluTGhe5HIDGasByAdM5c1xyHsxbh07RgjADnHyn3EKW07pYsqAKIwrR_HK4dVYer",
  },
  {
    category: "Culinary & Wine",
    name: "Vintage Cellars",
    description:
      "Rare pairings, private tastings, and curated chef residencies worldwide.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA7hyGmMFTl-jackZ9O-Oeywa1P1RJbmlzgKXgOtIJfxrM5ZnWo7rm9hTUnIbvzHI_0dfOldaEhlVILUWLlR8LkTsBNhKJxGoPy3X_YynJWeIx9qaxhLdY-UwI4LjpTO5EO46QBJXoI5q6-YUz1lHTVzdGqO2Cjpd5BX1qYZwQQ6zq2QXfzfKYxH3rj1eVuuqZCkZAORM05jn39v0szhrALdaAnSwKOtgeE4LtzcBAIwMiB88YURolXXjJRC7tlkLnYJ_lQ0hKdtsP8",
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = Boolean(session?.user);

  return (
    <Landing
      isAuthenticated={isAuthenticated}
      features={features}
      clubs={clubs}
    />
  );
}
