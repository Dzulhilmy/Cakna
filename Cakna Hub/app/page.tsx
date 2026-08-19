import { getCurrentUser } from "@/lib/auth";
import { getSiteContent } from "@/lib/site-store";
import { getProgramsByCore } from "@/lib/programs-store";
import PublicLanding from "@/components/public/PublicLanding";
import Hub from "@/components/Hub";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  // Guests see the public marketing site; members see the hub.
  if (!user) {
    const [content, programsByCore] = await Promise.all([
      getSiteContent(),
      getProgramsByCore(),
    ]);
    return (
      <PublicLanding content={content} programsByCore={programsByCore} />
    );
  }
  return <Hub user={user} />;
}
