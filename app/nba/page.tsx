import Link from "next/link";
import { ArrowRight, MapPin, Ticket } from "lucide-react";
import { NBA_GAMES, nbaTeam } from "../../lib/nba-data";

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function NbaGameCard({ game, featured = false }: { game: (typeof NBA_GAMES)[number]; featured?: boolean }) {
  const away = nbaTeam(game.away)!;
  const home = nbaTeam(game.home)!;
  return (
    <Link href={`/nba?game=${game.id}`} className={`kz-nba-game ${featured ? "featured" : ""}`}>
      <div className="kz-nba-art">
        <div className="kz-nba-team"><img src={away.logo} alt="" /><strong>{away.abbr}</strong></div>
        <span>VS</span>
        <div className="kz-nba-team"><img src={home.logo} alt="" /><strong>{home.abbr}</strong></div>
      </div>
      <div className="kz-nba-info">
        <div><span className="kz-nba-kicker">NBA · {game.demand === "Premium" ? "HIGH DEMAND" : "UPCOMING"}</span><h3>{away.name} @ {home.name}</h3></div>
        <p>{formatDate(game.date)} · {game.time}</p>
        <small><MapPin size={12} /> {home.city}</small>
      </div>
    </Link>
  );
}

export default function NbaPage() {
  const featured = NBA_GAMES.slice(0, 3);
  const upcoming = NBA_GAMES.slice(3);

  return (
    <div className="page kz-nba-page">
      <style>{`
        .kz-nba-page{max-width:1180px;margin:0 auto;padding:28px 22px 70px;color:#f6f2fb}
        .kz-nba-hero{border:1px solid rgba(255,255,255,.09);border-radius:24px;overflow:hidden;background:linear-gradient(135deg,#151020,#09070e);padding:34px;display:flex;justify-content:space-between;gap:30px;align-items:end}
        .kz-nba-eyebrow{font-size:10px;font-weight:900;letter-spacing:.16em;color:#a78bfa}
        .kz-nba-hero h1{font-size:clamp(42px,6vw,72px);letter-spacing:-.06em;line-height:.9;margin:8px 0 12px}.kz-nba-hero p{max-width:620px;color:#aaa1b8;margin:0;font-size:14px;line-height:1.6}
        .kz-nba-cta{display:inline-flex;align-items:center;gap:8px;margin-top:20px;padding:12px 17px;border-radius:11px;background:#7c3aed;color:#fff;font-weight:800;font-size:13px}
        .kz-nba-section{margin-top:38px}.kz-nba-heading{display:flex;justify-content:space-between;align-items:end;margin-bottom:14px}.kz-nba-heading h2{margin:4px 0 0;font-size:27px;letter-spacing:-.03em}.kz-nba-heading a{color:#c4b5fd;font-size:12px;font-weight:800}
        .kz-nba-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
        .kz-nba-game{display:block;border:1px solid rgba(255,255,255,.09);border-radius:16px;overflow:hidden;background:#11101a;transition:transform .18s ease,border-color .18s ease}.kz-nba-game:hover{transform:translateY(-2px);border-color:rgba(167,139,250,.5)}
        .kz-nba-art{height:190px;background:radial-gradient(circle at 50% 40%,rgba(124,58,237,.45),transparent 52%),linear-gradient(135deg,#09070e,#211735);display:flex;align-items:center;justify-content:center;gap:20px}.kz-nba-game.featured .kz-nba-art{height:240px}
        .kz-nba-team{width:34%;display:flex;flex-direction:column;align-items:center;gap:8px}.kz-nba-team img{width:86px;height:86px;object-fit:contain;filter:drop-shadow(0 10px 20px rgba(0,0,0,.45))}.kz-nba-team strong{font-size:11px}.kz-nba-art>span{font-size:11px;font-weight:1000;color:#b9a7d6;letter-spacing:.12em}
        .kz-nba-info{padding:14px 15px 16px;border-top:1px solid rgba(255,255,255,.08)}.kz-nba-info h3{margin:4px 0 7px;font-size:14px}.kz-nba-info p{margin:0;color:#b7afc1;font-size:11px}.kz-nba-info small{display:flex;align-items:center;gap:5px;color:#777181;font-size:10px;margin-top:7px}.kz-nba-kicker{font-size:8px;font-weight:900;letter-spacing:.13em;color:#a78bfa}
        .kz-nba-team-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}.kz-nba-team-tile{padding:15px 8px;text-align:center;border:1px solid rgba(255,255,255,.08);border-radius:13px;background:#11101a;color:#fff}.kz-nba-team-tile img{width:50px;height:50px;object-fit:contain;display:block;margin:0 auto 8px}.kz-nba-team-tile span{font-size:9px;color:#8f8898}
        @media(max-width:800px){.kz-nba-hero{padding:25px;display:block}.kz-nba-grid{grid-template-columns:1fr}.kz-nba-game.featured .kz-nba-art,.kz-nba-art{height:210px}.kz-nba-team-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      `}</style>

      <section className="kz-nba-hero">
        <div><span className="kz-nba-eyebrow">KICKSEATZ · NBA</span><h1>Basketball is here.</h1><p>KickSeatz now brings NBA matchups into the same simple, visual ticket-discovery experience we built for football.</p><Link href="/find-tickets" className="kz-nba-cta">Explore tickets <Ticket size={15} /></Link></div>
      </section>

      <section className="kz-nba-section"><div className="kz-nba-heading"><div><span className="kz-nba-eyebrow">FEATURED</span><h2>Games worth seeing</h2></div><Link href="#upcoming">See upcoming games <ArrowRight size={14} /></Link></div><div className="kz-nba-grid">{featured.map((game) => <NbaGameCard key={game.id} game={game} featured />)}</div></section>

      <section className="kz-nba-section" id="upcoming"><div className="kz-nba-heading"><div><span className="kz-nba-eyebrow">UP NEXT</span><h2>More NBA games</h2></div></div><div className="kz-nba-grid">{upcoming.map((game) => <NbaGameCard key={game.id} game={game} />)}</div></section>

      <section className="kz-nba-section"><div className="kz-nba-heading"><div><span className="kz-nba-eyebrow">EXPLORE</span><h2>NBA teams</h2></div></div><div className="kz-nba-team-grid">{NBA_GAMES.slice(0, 6).flatMap((game) => [game.away, game.home]).filter((abbr, index, list) => list.indexOf(abbr) === index).slice(0, 12).map((abbr) => { const team = nbaTeam(abbr)!; return <Link className="kz-nba-team-tile" href={`/nba?team=${abbr}`} key={abbr}><img src={team.logo} alt="" /><strong>{team.abbr}</strong><span>{team.city}</span></Link>; })}</div></section>
    </div>
  );
}
