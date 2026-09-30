import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Ticket } from "lucide-react";
import { GameCard } from "../../../components/GameCard";
import { gamesForTeam, teamBySlug } from "../../../lib/data";

const logoIds: Record<string, number> = {
  ARI: 22, ATL: 1, BAL: 33, BUF: 2, CAR: 29, CHI: 3, CIN: 4, CLE: 5,
  DAL: 6, DEN: 7, DET: 8, GB: 9, HOU: 34, IND: 11, JAX: 30, KC: 12,
  LV: 13, LAC: 24, LAR: 14, MIA: 15, MIN: 16, NE: 17, NO: 18, NYG: 19,
  NYJ: 20, PHI: 21, PIT: 23, SF: 25, SEA: 26, TB: 27, TEN: 10, WAS: 28,
};

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = teamBySlug(slug);
  if (!team) notFound();
  const games = gamesForTeam(team.slug);
  const logoId = logoIds[team.abbr];

  return (
    <div className="page">
      <Link href="/teams" className="back-link"><ArrowLeft size={15}/> All teams</Link>
      <section className="team-hero">
        <div className="team-big-mark" style={{background: "#17151f", borderColor: team.color, position: "relative", overflow: "hidden"}}>
          {logoId ? (
            <img
              src={`https://a.espncdn.com/i/teamlogos/nfl/500/${logoId}.png`}
              alt=""
              style={{width: 72, height: 72, objectFit: "contain"}}
            />
          ) : (
            team.abbr
          )}
        </div>
        <div>
          <div className="eyebrow">{team.division}</div>
          <h1>{team.name}</h1>
          <p><MapPin size={15}/>{team.venue} · {team.city}, {team.state}</p>
          <Link href={`/find-tickets?team=${team.slug}`} className="primary-button"><Ticket size={16}/> Find tickets</Link>
        </div>
      </section>
      <section className="section">
        <div className="section-heading"><div><div className="eyebrow">Schedule</div><h2>Upcoming games</h2></div><span className="muted">{games.length} demo matchups</span></div>
        <div className="game-grid">{games.map(game => <GameCard key={game.id} game={game} />)}</div>
      </section>
    </div>
  );
}
