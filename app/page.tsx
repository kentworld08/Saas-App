import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import Cta from "@/components/CTA";

import {
  getAllCompanions,
  getRecentSessions,
} from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";

const HomePage = async () => {
  const companions = await getAllCompanions({ limit: 3 });
  const recentSessionsCompanion = await getRecentSessions(10);
  return (
    <main className="pt-25">
      <h1 className="text-2xl underline">Popular Companions</h1>
      <section className="home-section">
        {companions.map((companion) => (
          <CompanionCard
            {...companion}
            key={companion.id}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>
      <section className="home-section ">
        <CompanionsList
          title="Recently completed sessions"
          companions={recentSessionsCompanion}
          classNames="w-2/3 max-lg:w-full"
        />
        <Cta />
      </section>
    </main>
  );
};

export default HomePage;
