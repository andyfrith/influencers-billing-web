import { clubLandingContent } from "@/data/clubs";
import Landing from "@/components/clubs/template/landing";

export default async function Page() {
  return (
    <Landing
      isAuthenticated={false}
      clubLandingContent={clubLandingContent[0]}
    />
  );
}
