import Link from "next/link";
import { getServerSession } from "next-auth";

import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";

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
    description: "Precision longevity and holistic recovery in the heart of the city.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANMYhsy-5mLnKzINwVz1SViyNUiTkNc_Fv8JYQLK5UTvxCPuVdSEQqHtTun2OyRvDoM1ofTGiQNctHB_KbNsqRum8DnepUBbOxiBRS5vuTVUz8J0aFaSTiRyL3sb0EhNyyvikj6q8Zu3Z4qJvcr_kivKYDQc3rL3OH8rmrrBLTM0aGLx73HJ0SUi0--hL5M3FWl2Z0xeV9md1u-ERBFm2XjMiWWOxmX2n8HLxD54wMlO0yLng1S1rYiIk3BhnVvrdMCL65GYDvYQl6",
  },
  {
    category: "Tech & Innovation",
    name: "The Circuit",
    description: "A private nexus for founders, operators, and investors shaping tomorrow.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4v-KDfm0D-_MHfe_MsrCpqpOAUruUc0BQp1ovviZ-R1OfDAeES_BGUoJrTZFBdUhRwMT63ejOAMYeMuinF0DmP-DPF9MIGYfPKX5JNkioEdQeiH39QcVwcF12hUJslIr4CLecjGN99SjcZ250e1L8uilIZO5kpaUyqKFQY_dYEAGeppfe2HBi-EGVnLA-DbmXpFFTKgy8tz2qluTGhe5HIDGasByAdM5c1xyHsxbh07RgjADnHyn3EKW07pYsqAKIwrR_HK4dVYer",
  },
  {
    category: "Culinary & Wine",
    name: "Vintage Cellars",
    description: "Rare pairings, private tastings, and curated chef residencies worldwide.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA7hyGmMFTl-jackZ9O-Oeywa1P1RJbmlzgKXgOtIJfxrM5ZnWo7rm9hTUnIbvzHI_0dfOldaEhlVILUWLlR8LkTsBNhKJxGoPy3X_YynJWeIx9qaxhLdY-UwI4LjpTO5EO46QBJXoI5q6-YUz1lHTVzdGqO2Cjpd5BX1qYZwQQ6zq2QXfzfKYxH3rj1eVuuqZCkZAORM05jn39v0szhrALdaAnSwKOtgeE4LtzcBAIwMiB88YURolXXjJRC7tlkLnYJ_lQ0hKdtsP8",
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = Boolean(session?.user);

  return (
    <main className="min-h-screen bg-[#100d0b] text-[#f2ece8]">
      <header className="sticky top-0 z-50 border-b border-[#2f2722] bg-[#0f0c0a]/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff9f3f]">
            Vanguard Club
          </Link>
          <nav className="hidden items-center gap-8 text-xs text-[#b9aaa0] md:flex">
            <Link href="/clubs" className="transition-colors hover:text-white">
              Clubs
            </Link>
            <Link href="/account/memberships" className="transition-colors hover:text-white">
              Benefits
            </Link>
            <Link href="/account/billing" className="transition-colors hover:text-white">
              Concierge
            </Link>
            <span className="text-[#ff9f3f]">Memberships</span>
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/account/billing" className="text-xs text-[#c7b9ae] hover:text-white">
                  Account
                </Link>
                <Link href="/clubs">
                  <Button className="h-8 rounded-full bg-[#ff7a00] px-4 text-xs font-semibold text-black hover:bg-[#ff8e27]">
                    Explore
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-xs text-[#c7b9ae] hover:text-white">
                  Login
                </Link>
                <Link href="/sign-up">
                  <Button className="h-8 rounded-full bg-[#ff7a00] px-4 text-xs font-semibold text-black hover:bg-[#ff8e27]">
                    Join
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#2f2722]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0f0c0acc] via-[#0f0c0a99] to-[#100d0b]" />
        <div className="relative mx-auto flex min-h-[460px] w-full max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-[#5b4433] bg-[#251d18] px-4 py-1 text-[10px] uppercase tracking-[0.16em] text-[#ff9f3f]">
            The Future of Membership
          </div>
          <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
            Access the <span className="text-[#ff8a1a]">Extraordinary</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#d7c6bb]">
            Join world-class innovators, wellness leaders, and creators. Elevate your lifestyle
            with curated access to the most exclusive communities and experiences around the globe.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={isAuthenticated ? "/clubs" : "/sign-up"}>
              <Button className="h-10 rounded-full bg-[#ff7a00] px-7 text-sm font-semibold text-black hover:bg-[#ff8f2a]">
                Join the Vanguard
              </Button>
            </Link>
            <Link href="/clubs">
              <Button
                variant="outline"
                className="h-10 rounded-full border-[#66544a] bg-black/30 px-7 text-sm text-white hover:bg-black/50"
              >
                Explore Clubs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-white">Redefining Premium Living</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#bdaea5]">
            Every membership is a passport to unmatched privileges and meaningful connections.
          </p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="overflow-hidden rounded-2xl border border-[#352c27] bg-[#1b1613]"
            >
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url('${feature.imageUrl}')` }}
              />
              <article
                className="rounded-b-2xl border-t border-[#3d322c] bg-[#26201c] p-4"
              >
                <span className="material-symbols-outlined rounded bg-[#3b2d24] p-1 text-sm text-[#ff8a1a]">
                  {feature.icon}
                </span>
                <h3 className="mt-3 text-lg font-medium text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#bdaea5]">{feature.description}</p>
              </article>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#2a2522] py-14">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-white">Explore Our Communities</h2>
              <p className="mt-2 text-sm text-[#bcaea4]">
                From wellness and innovation to hospitality and fine dining, find the club that
                reflects your ambitions.
              </p>
            </div>
            <Link href="/clubs">
              <Button
                variant="outline"
                className="hidden rounded-full border-[#5d4f46] bg-[#1f1a17] px-4 text-xs text-[#ff9f3f] md:inline-flex"
              >
                Discover More
                <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
            <article
              className="relative min-h-[320px] overflow-hidden rounded-2xl border border-[#433831] md:col-span-2 md:row-span-2"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${clubs[0].imageUrl}')` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <p className="text-xs text-[#d4c2b7]">{clubs[0].category}</p>
                <h3 className="mt-1 text-3xl font-semibold text-white">{clubs[0].name}</h3>
                <p className="mt-2 max-w-md text-sm text-[#d7c5ba]">{clubs[0].description}</p>
              </div>
            </article>
            {clubs.slice(1).map((club) => (
              <article
                key={club.name}
                className="relative min-h-[150px] overflow-hidden rounded-2xl border border-[#433831]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${club.imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <p className="text-xs text-[#d4c2b7]">{club.category}</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">{club.name}</h3>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 md:hidden">
            <Link href="/clubs">
              <Button
                variant="outline"
                className="rounded-full border-[#5d4f46] bg-[#1f1a17] px-4 text-xs text-[#ff9f3f]"
              >
                Discover More
                <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-[#3f342d] bg-linear-to-r from-[#2a211c] to-[#211a16] px-8 py-10 text-center">
          <h2 className="text-4xl font-semibold text-white">Your Seat is Reserved</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#c6b5aa]">
            Application for membership is now open. Join the next generation of global leadership
            and claim your place in the Vanguard.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/clubs">
                  <Button className="h-10 rounded-full bg-[#ff7a00] px-6 text-sm font-semibold text-black hover:bg-[#ff8e27]">
                    Apply for Membership
                  </Button>
                </Link>
                <Link href="/account/billing">
                  <Button
                    variant="outline"
                    className="h-10 rounded-full border-[#6b5a50] bg-transparent px-6 text-sm text-white"
                  >
                    Manage Billing
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button className="h-10 rounded-full bg-[#ff7a00] px-6 text-sm font-semibold text-black hover:bg-[#ff8e27]">
                    Apply for Membership
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="h-10 rounded-full border-[#6b5a50] bg-transparent px-6 text-sm text-white"
                  >
                    Speak with an Advisor
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#2e2621] py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 text-xs text-[#8f7f75] md:flex-row md:items-center">
          <span className="font-semibold uppercase tracking-[0.14em] text-[#d5c6bb]">Vanguard Club</span>
          <div className="flex gap-4">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
