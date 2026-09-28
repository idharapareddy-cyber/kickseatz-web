import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, MapPin, Ticket } from "lucide-react";
import { GameCard } from "../../../components/GameCard";
import { gamesForTeam, teamBySlug } from "../../../lib/data";

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = teamBySlug(slug);
  if (!team) notFound();
  const games = gamesForTeam(team.slug);
  return (
    <div className="page">
      <Link href="/teams" className="back-link"><ArrowRight size={15}/> All teams</Link>
      <section className="team-hero">
        <div className="team-big-mark" style={{background: `linear-gradient(135deg, ${team.color}, #17131f)`}}>{team.abbr}</div>
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
