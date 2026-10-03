import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Flame,
  MapPin,
  Navigation,
  Search,
  Ticket,
  Trophy,
  Music2,
  Users,
  Sparkles,
} from "lucide-react";
import { GAMES, TEAMS, teamName } from "../lib/data";

const collegeFootball = [
  { name: "Georgia Bulldogs", short: "UGA", image: "https://a.espncdn.com/i/teamlogos/ncaa/500/61.png" },
  { name: "Alabama Crimson Tide", short: "BAMA", image: "https://a.espncdn.com/i/teamlogos/ncaa/500/333.png" },
  { name: "Ohio State Buckeyes", short: "OSU", image: "https://a.espncdn.com/i/teamlogos/ncaa/500/194.png" },
  { name: "Texas Longhorns", short: "TEXAS", image: "https://a.espncdn.com/i/teamlogos/ncaa/500/251.png" },
];

const sportCategories = [
  { name: "Basketball", kicker: "NBA", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=85" },
  { name: "Baseball", kicker: "MLB", image: "https://www.nikkansports.com/baseball/mlb/news/img/202401040000891-w1300_1.jpg" },
  { name: "Hockey", kicker: "NHL", image: "https://oeg.ca/assets/uploads/img/_800x450_crop_center-center_none/Hockey_RogersPlace_1600px.jpg" },
  { name: "Soccer", kicker: "MLS", image: "https://cdn.mos.cms.futurecdn.net/xjhbJv3TtXPSRw2mgjXukN-650-80.jpg" },
];

const logoIds: Record<string, number> = {
  ARI:22, ATL:1, BAL:33, BUF:2, CAR:29, CHI:3, CIN:4, CLE:5, DAL:6, DEN:7,
  DET:8, GB:9, HOU:34, IND:11, JAX:30, KC:12, LV:13, LAC:24, LAR:14,
  MIA:15, MIN:16, NE:17, NO:18, NYG:19, NYJ:20, PHI:21, PIT:23, SF:25,
  SEA:26, TB:27, TEN:10, WAS:28,
};

function logoUrl(slug: string) {
  const abbr = TEAMS.find((t) => t.slug === slug)?.abbr;
  const id = abbr ? logoIds[abbr] : undefined;
  return id ? `https://a.espncdn.com/i/teamlogos/nfl/500/${id}.png` : "";
}

function isUpcomingGame(game: (typeof GAMES)[number]) {
  const today = new Date();
  const gameDate = new Date(game.date + "T23:59:59");
  return gameDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

const UPCOMING_GAMES = GAMES.filter(isUpcomingGame);

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const rivalryKeys = new Set([
  "kansas-city-chiefs-buffalo-bills",
  "dallas-cowboys-philadelphia-eagles",
  "san-francisco-49ers-seattle-seahawks",
  "green-bay-packers-chicago-bears",
  "baltimore-ravens-pittsburgh-steelers",
  "atlanta-falcons-new-orleans-saints",
]);

const stadiumImages: Record<string, string> = {
  "kansas-city-chiefs": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Arrowhead_Stadium.jpg",
  "dallas-cowboys": "https://images.unsplash.com/photo-1628630470727-b726b8a15a9d?auto=format&fit=crop&w=1600&q=85",
  "green-bay-packers": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Lambeau_Field.jpg",
  "san-francisco-49ers": "https://upload.wikimedia.org/wikipedia/commons/7/79/Levi%27s_Stadium.JPG",
  "atlanta-falcons": "https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_Stadium%2C_Atlanta%2C_GA_%2846558862285%29.jpg?width=1600",
};

function gameFlags(game: (typeof GAMES)[number]) {
  const homeTeam = TEAMS.find((team) => team.slug === game.home);
  const awayTeam = TEAMS.find((team) => team.slug === game.away);
  const division = Boolean(homeTeam && awayTeam && homeTeam.division === awayTeam.division);
  const primetime = game.time.includes("8:20 PM") || game.time.includes("8:15 PM") || game.time.includes("8:00 PM");
  const rivalry = rivalryKeys.has(game.home + "-" + game.away) || rivalryKeys.has(game.away + "-" + game.home);
  const playoffWatch = game.date >= "2026-12-01";
  return { division, primetime, rivalry, playoffWatch };
}

function gameCategory(game: (typeof GAMES)[number]) {
  const flags = gameFlags(game);
  if (flags.primetime) return "PRIMETIME";
  if (flags.rivalry) return "RIVALRY";
  if (flags.division) return "DIVISION";
  if (flags.playoffWatch) return "PLAYOFF WATCH";
  return "GAME DAY";
}

function StadiumVisual({ game, hero = false }: { game: (typeof GAMES)[number]; hero?: boolean }) {
  const image = stadiumImages[game.home];
  if (!image) return <SimpleMatchupVisual game={game} hero={hero} />;
  return (
    <div className={"kz-stadium-visual" + (hero ? " kz-stadium-visual-hero" : "")}>
      <img src={image} alt={teamName(game.home) + " stadium"} />
      <div className="kz-stadium-shade" />
      <div className="kz-stadium-color" style={{ background: TEAMS.find((team) => team.slug === game.home)?.color }} />
      <div className="kz-stadium-label"><span>{gameCategory(game)}</span><strong>{game.venue}</strong></div>
    </div>
  );
}

function GameVisual({ game, hero = false }: { game: (typeof GAMES)[number]; hero?: boolean }) {
  // One strong photo for supported hero games; clean team-logo matchup art everywhere else.
  return hero && stadiumImages[game.home]
    ? <StadiumVisual game={game} hero />
    : <SimpleMatchupVisual game={game} hero={hero} />;
}

function SimpleMatchupVisual({ game, hero = false }: { game: (typeof GAMES)[number]; hero?: boolean }) {
  const away = TEAMS.find((team) => team.slug === game.away);
  const home = TEAMS.find((team) => team.slug === game.home);
  return (
    <div
      className={"kz-simple-matchup" + (hero ? " kz-simple-matchup-hero" : "")}
      style={{
        "--away-color": away?.color ?? "#5b2eff",
        "--home-color": home?.color ?? "#111827",
      } as React.CSSProperties}
    >
      <div className="kz-simple-team">
        <img src={logoUrl(game.away)} alt="" />
        <span>{away?.abbr}</span>
      </div>
      <div className="kz-simple-vs">VS</div>
      <div className="kz-simple-team">
        <img src={logoUrl(game.home)} alt="" />
        <span>{home?.abbr}</span>
      </div>
      <div className="kz-simple-matchup-label">
        <small>{gameCategory(game)}</small>
        <strong>{teamName(game.away)} @ {teamName(game.home)}</strong>
      </div>
    </div>
  );
}

function GameRow({ game }: { game: (typeof GAMES)[number] }) {
  return (
    <Link href={`/find-tickets?game=${game.id}`} className="kz-game-row">
      <div className="kz-game-date">
        <strong>{new Date(`${game.date}T12:00:00`).toLocaleDateString("en-US", { month: "short" })}</strong>
        <b>{new Date(`${game.date}T12:00:00`).getDate()}</b>
      </div>
      <div className="kz-game-matchup">
        <div>
          <img src={logoUrl(game.away)} alt="" />
          <strong>{teamName(game.away)}</strong>
          <span>@</span>
          <strong>{teamName(game.home)}</strong>
          <img src={logoUrl(game.home)} alt="" />
        </div>
        <small><MapPin size={13} /> {game.venue} · {game.city} · {game.time}</small>
      </div>
      <span className="kz-demand">{game.demand}</span>
      <span className="kz-ticket-link">Find Tickets <ArrowRight size={15} /></span>
    </Link>
  );
}

function EventCard({ game }: { game: (typeof GAMES)[number] }) {
  const homeTeam = TEAMS.find((team) => team.slug === game.home);
  const awayTeam = TEAMS.find((team) => team.slug === game.away);

  return (
    <Link
      href={`/find-tickets?game=${game.id}`}
      className="kz-event-card"
      style={{
        "--home-team-color": homeTeam?.color ?? "#6D28D9",
        "--away-team-color": awayTeam?.color ?? "#111827",
      } as React.CSSProperties}
    >
      <div className="kz-event-image">
        <GameVisual game={game} />
        <span className="kz-event-badge">{gameCategory(game)}</span>
        <span className="kz-heart" aria-hidden="true">♡</span>
      </div>
      <div className="kz-event-info">
        <strong>{teamName(game.away)} @ {teamName(game.home)}</strong>
        <span>{formatDate(game.date)} · {game.city}</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const featured = UPCOMING_GAMES.slice(0, 5);
  const trending = [...UPCOMING_GAMES]
    .filter((game) => game.demand === "High" || game.demand === "Premium")
    .slice(0, 6);
  const upcoming = UPCOMING_GAMES.slice(5, 12);

  return (
    <div className="page marketplace-home kz-home">
      {/* Existing homepage sections continue below unchanged. */}
    </div>
  );
}
