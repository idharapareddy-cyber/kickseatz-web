import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { GAMES, TEAMS, teamName } from "../../lib/data";

const logoIds: Record<string, number> = {
  ARI:22, ATL:1, BAL:33, BUF:2, CAR:29, CHI:3, CIN:4, CLE:5, DAL:6, DEN:7,
  DET:8, GB:9, HOU:34, IND:11, JAX:30, KC:12, LV:13, LAC:24, LAR:14,
  MIA:15, MIN:16, NE:17, NO:18, NYG:19, NYJ:20, PHI:21, PIT:23, SF:25,
  SEA:26, TB:27, TEN:10, WAS:28,
};

const stadiumImages: Record<string, string> = {
  "kansas-city-chiefs": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Arrowhead_Stadium.jpg",
  "dallas-cowboys": "https://images.unsplash.com/photo-1628630470727-b726b8a15a9d?auto=format&fit=crop&w=1600&q=85",
  "green-bay-packers": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Lambeau_Field.jpg",
  "san-francisco-49ers": "https://upload.wikimedia.org/wikipedia/commons/7/79/Levi%27s_Stadium.JPG",
  "atlanta-falcons": "https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_Stadium%2C_Atlanta%2C_GA_%2846558862285%29.jpg?width=1600",
  "seattle-seahawks": "https://commons.wikimedia.org/wiki/Special:FilePath/Lumen_Field_north_side_at_dusk.jpg?width=1600",
  "chicago-bears": "https://commons.wikimedia.org/wiki/Special:FilePath/Soldier_Field.jpg?width=1600",
  "pittsburgh-steelers": "https://commons.wikimedia.org/wiki/Special:FilePath/Acrisure_Stadium.jpg?width=1600",
  "new-york-jets": "https://commons.wikimedia.org/wiki/Special:FilePath/MetLife_Stadium.jpg?width=1600",
  "new-orleans-saints": "https://commons.wikimedia.org/wiki/Special:FilePath/Caesars_Superdome.jpg?width=1600",
};
const fallbackImage = "https://upload.wikimedia.org/wikipedia/commons/5/5a/SoFi_Stadium.jpg";

function logoUrl(slug: string) {
  const abbr = TEAMS.find((team) => team.slug === slug)?.abbr;
  const id = abbr ? logoIds[abbr] : undefined;
  return id ? `https://a.espncdn.com/i/teamlogos/nfl/500/${id}.png` : "";
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function NflGameCard({ game }: { game: (typeof GAMES)[number] }) {
  const home = TEAMS.find((team) => team.slug === game.home);
  return (
    <Link href={`/find-tickets?game=${game.id}`} className="kz-sport-game">
      <div className="kz-sport-game-art">
        <img src={stadiumImages[game.home] ?? fallbackImage} alt={`${home?.name ?? "NFL"} stadium`} />
        <div className="kz-sport-game-shade" />
        <div className="kz-sport-game-teams">
          <div><img src={logoUrl(game.away)} alt="" /><span>{TEAMS.find((team) => team.slug === game.away)?.abbr}</span></div>
          <b>VS</b>
          <div><img src={logoUrl(game.home)} alt="" /><span>{home?.abbr}</span></div>
        </div>
      </div>
      <div className="kz-sport-game-info">
        <span className="kz-sport-game-kicker">NFL · {game.demand.toUpperCase()} DEMAND</span>
        <h3>{teamName(game.away)} @ {teamName(game.home)}</h3>
        <p>{formatDate(game.date)} · {game.time}</p>
        <small><MapPin size={12} /> {game.city} · {game.venue}</small>
      </div>
    </Link>
  );
}

export default function NflPage() {
  const games = GAMES.filter((game) => new Date(`${game.date}T23:59:59`) >= new Date());
  return (
    <main className="kz-sport-page">
      <header className="kz-sport-page-head">
        <Link href="/"><ArrowRight size={14} /> Back to home</Link>
        <span className="kz-eyebrow">KICKSEATZ · NFL</span>
        <h1>Find your NFL game.</h1>
        <p>Browse upcoming matchups, from major rivalries to the games worth planning around.</p>
      </header>
      <section aria-label="Upcoming NFL games">
        <div className="kz-sport-game-grid">
          {games.map((game) => <NflGameCard key={game.id} game={game} />)}
        </div>
      </section>
    </main>
  );
}
