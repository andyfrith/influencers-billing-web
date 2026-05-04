import { resolveClubLandingContent } from "@/data/clubs";
import Landing from "@/components/clubs/template/landing";

export default async function DiscoverClubsPage(): Promise<React.JSX.Element> {
  return (
    <Landing
      isAuthenticated={false}
      clubLandingContent={resolveClubLandingContent(undefined)}
    />
  );
}
