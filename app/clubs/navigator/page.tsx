import type { Metadata } from "next";

import { ClubNavigator } from "@/components/clubs/club-navigator";
import { ClubNavigatorAmberNocturneFrame } from "@/components/clubs/club-navigator-amber-nocturne-frame";

export const metadata: Metadata = {
  title: "Club Navigator - Amber Nocturne",
  description: "Club discovery navigator (Stitch design: Amber Nocturne)",
};

export default function ClubNavigatorAmberNocturnePage(): React.JSX.Element {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <section className="min-h-[70vh] border-b border-border-subtle">
        <ClubNavigatorAmberNocturneFrame className="h-[70vh] min-h-[560px]" />
      </section>
      <ClubNavigator />
    </div>
  );
}
