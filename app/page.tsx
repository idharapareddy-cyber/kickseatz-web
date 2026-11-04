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
import { GAMES, TEAMS, TICKETS, teamName } from "../lib/data";
import { NBA_GAMES, nbaTeam } from "../lib/nba-data";

const collegeFootball = [
  { name: "Georgia Bulldogs", short: "UGA", image: "https://commons.wikimedia.org/wiki/Special:FilePath/2026_G-Day_at_Sanford_Stadium.jpg?width=2400" },
  { name: "Alabama Crimson Tide", short: "BAMA", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bryant-Denny_night.jpg?width=2400" },
  { name: "Ohio State Buckeyes", short: "OSU", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ohio_Stadium_%2823663942948%29.jpg?width=2400" },
  { name: "Texas Longhorns", short: "TEXAS", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Darrell_K_Royal%E2%80%93Texas_Memorial_Stadium_-_Texas_Longhorns_%2854983869867%29.jpg?width=2400" },
];

const sportCategories = [
  { name: "Football", kicker: "NFL", href: "/nfl", description: "Explore NFL matchups", image: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Arrowhead_Stadium.jpg" },
  { name: "Basketball", kicker: "NBA", href: "/nba", description: "Explore NBA matchups", image: "/images/nba/feature-den.png" },
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

// The preview inventory is intentionally always visible so the marketplace never renders empty between schedule refreshes.
const UPCOMING_GAMES = GAMES;
const NBA_HOME_GAMES = NBA_GAMES.slice(0, 6);

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

const rivalryKeys = new Set([
  "kansas-city-chiefs-buffalo-bills",
  "dallas-cowboys-philadelphia-eagles",
  "san-francisco-49ers-seattle-seahawks",
  "green-bay-packers-chicago-bears",
  "baltimore-ravens-pittsburgh-steelers",
  "atlanta-falcons-new-orleans-saints",
]);

const NFL_FALLBACK_STADIUM = "https://upload.wikimedia.org/wikipedia/commons/5/5a/SoFi_Stadium.jpg";

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
  const image = stadiumImages[game.home] ?? NFL_FALLBACK_STADIUM;
  return (
    <div className={"kz-stadium-visual" + (hero ? " kz-stadium-visual-hero" : "")}>
      <img src={image} alt={teamName(game.home) + " stadium"} />
      <div className="kz-stadium-shade" />
      <div className="kz-stadium-color" />
    </div>
  );
}

function GameVisual({ game, hero = false }: { game: (typeof GAMES)[number]; hero?: boolean }) {
  return <StadiumVisual game={game} hero={hero} />;
}

function SimpleMatchupVisual({ game, hero = false }: { game: (typeof GAMES)[number]; hero?: boolean }) {
  const away = TEAMS.find((team) => team.slug === game.away);
  const home = TEAMS.find((team) => team.slug === game.home);
  return (
    <div className={"kz-simple-matchup" + (hero ? " kz-simple-matchup-hero" : "")}>
      <div className="kz-simple-team"><img src={logoUrl(game.away)} alt="" /><span>{away?.abbr}</span></div>
      <div className="kz-simple-vs">VS</div>
      <div className="kz-simple-team"><img src={logoUrl(game.home)} alt="" /><span>{home?.abbr}</span></div>
    </div>
  );
}

const NBA_ARENA_FALLBACK = "/images/nba/atl.png";
const nbaArenaImages: Record<string, string> = {
  DEN: "/images/nba/den.png",
  LAC: "/images/nba/lac.png",
  ATL: "/images/nba/atl.png",
  PHI: "/images/nba/phi.png",
  SAC: "/images/nba/sac.png",
  GSW: "/images/nba/gsw.png",
};

function nbaLogo(abbr: string) {
  return nbaTeam(abbr)?.logo ?? "";
}

function NbaHomeCard({ game }: { game: (typeof NBA_GAMES)[number] }) {
  const away = nbaTeam(game.away);
  const home = nbaTeam(game.home);
  return (
    <Link href="/nba" className="kz-event-card kz-nba-event-card">
      <div className="kz-event-image">
        <div className="kz-stadium-visual">
          <img src={nbaArenaImages[game.home] ?? NBA_ARENA_FALLBACK} alt={(home?.name ?? "NBA") + " arena"} />
          <div className="kz-stadium-shade" />
          <div className="kz-stadium-color" />
        </div>
      </div>
      <div className="kz-event-info">
        <strong>{away?.name} @ {home?.name}</strong>
        <span>{formatDate(game.date)} · {game.time}</span>
        <small>{home?.city} · {game.demand} demand</small>
      </div>
    </Link>
  );
}

function NbaFeatureCard({ game, image, label }: { game: (typeof NBA_GAMES)[number]; image: string; label: string }) {
  const away = nbaTeam(game.away);
  const home = nbaTeam(game.home);
  return (
    <Link href="/nba" className="kz-nba-feature">
      <img className="kz-nba-feature-art" src={image} alt={`${away?.name} at ${home?.name} featured artwork`} />
      <div className="kz-nba-feature-shade" aria-hidden="true" />
      <div className="kz-nba-feature-copy">
        <span className="kz-nba-feature-label">{label}</span>
        <h3>{away?.name} <em>@</em> {home?.name}</h3>
        <p>{formatDate(game.date)} · {game.time} · {home?.city} · {game.demand} demand</p>
        <b>Find tickets <ArrowRight size={15} /></b>
      </div>
    </Link>
  );
}

function GameRow({ game }: { game: (typeof GAMES)[number] }) {
  return <Link href={`/find-tickets?game=${game.id}`} className="kz-game-row"><div className="kz-game-date"><strong>{new Date(`${game.date}T12:00:00`).toLocaleDateString("en-US", { month: "short" })}</strong><b>{new Date(`${game.date}T12:00:00`).getDate()}</b></div><div className="kz-game-matchup"><div><img src={logoUrl(game.away)} alt="" /><strong>{teamName(game.away)}</strong><span>@</span><strong>{teamName(game.home)}</strong><img src={logoUrl(game.home)} alt="" /></div><small><MapPin size={13} /> {game.venue} · {game.city} · {game.time}</small></div><span className="kz-demand">{game.demand}</span><span className="kz-ticket-link">Find Tickets <ArrowRight size={15} /></span></Link>;
}

function EventCard({ game }: { game: (typeof GAMES)[number] }) {
  const away = TEAMS.find((team) => team.slug === game.away);
  const home = TEAMS.find((team) => team.slug === game.home);
  const flags = gameFlags(game);
  const label = flags.rivalry ? "RIVALRY GAME" : flags.primetime ? "PRIMETIME" : flags.division ? "DIVISION SHOWDOWN" : game.demand === "Premium" ? "HIGH DEMAND" : "FEATURED";
  return (
    <Link href={`/find-tickets?game=${game.id}`} className="kz-event-card">
      <div className="kz-event-image">
        <GameVisual game={game} />
        <div className="kz-event-matchup-logos">
          <img src={logoUrl(game.away)} alt={away?.name ?? ""} />
          <span>VS</span>
          <img src={logoUrl(game.home)} alt={home?.name ?? ""} />
        </div>
        <span className="kz-event-flag">{label}</span>
      </div>
      <div className="kz-event-info">
        <strong>{teamName(game.away)} @ {teamName(game.home)}</strong>
        <span>{formatDate(game.date)} · {game.time}</span>
        <small>{game.venue} · {game.city}</small>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const featured = UPCOMING_GAMES.filter(isUpcomingGame).sort((a, b) => {
    const score = (game: (typeof GAMES)[number]) => {
      const flags = gameFlags(game);
      return (flags.rivalry ? 8 : 0) + (flags.primetime ? 6 : 0) +
        (flags.division ? 4 : 0) + (game.demand === "Premium" ? 4 : game.demand === "High" ? 2 : 0);
    };
    return score(b) - score(a) || a.date.localeCompare(b.date);
  }).slice(0, 3);
  const heroGame = featured[0] ?? UPCOMING_GAMES[0];
  const heroAway = TEAMS.find((team) => team.slug === heroGame.away);
  const heroHome = TEAMS.find((team) => team.slug === heroGame.home);
  const heroTickets = TICKETS.filter((ticket) => ticket.gameId === heroGame.id).slice(0, 3);

  return (
    <div className="page marketplace-home kz-home">
      <section className="kz-marketplace-hero">
        <div className="kz-marketplace-hero-copy">
          <span className="kz-eyebrow">THE LIVE EVENT MARKETPLACE</span>
          <h1>Be there for<br /><em>the big moments.</em></h1>
          <p>Find the game, compare the seats, and get closer to the moments fans remember.</p>
          <div className="kz-marketplace-hero-links">
            <Link href="/find-tickets" className="kz-primary-button">Explore tickets <ArrowRight size={16} /></Link>
            <Link href="/find-my-game">Find my game <ArrowRight size={14} /></Link>
          </div>
          <div className="kz-marketplace-trust"><span><Ticket size={14} /> Compare ticket options</span><span><Trophy size={14} /> Discover major matchups</span></div>
        </div>

        <div className="kz-marketplace-ticketboard">
          <div className="kz-ticketboard-topline"><span><Flame size={13} /> FEATURED EVENT</span><small>DEMO MARKETPLACE</small></div>
          <div className="kz-ticketboard-matchup">
            <div className="kz-ticketboard-team"><img src={logoUrl(heroGame.away)} alt="" /><strong>{heroAway?.abbr}</strong><small>{heroAway?.name}</small></div>
            <div className="kz-ticketboard-versus">VS</div>
            <div className="kz-ticketboard-team"><img src={logoUrl(heroGame.home)} alt="" /><strong>{heroHome?.abbr}</strong><small>{heroHome?.name}</small></div>
          </div>
          <div className="kz-ticketboard-event-meta">
            <strong>{teamName(heroGame.away)} at {teamName(heroGame.home)}</strong>
            <span><CalendarDays size={13} /> {formatDate(heroGame.date)} · {heroGame.time}</span>
            <span><MapPin size={13} /> {heroGame.venue} · {heroGame.city}</span>
          </div>
          <div className="kz-ticketboard-listings">
            <div className="kz-ticketboard-listing-heading"><strong>Available ticket options</strong><span>Sample listings</span></div>
            {heroTickets.map((ticket) => (
              <div className="kz-ticketboard-listing" key={ticket.id}>
                <div><strong>{ticket.seatArea}</strong><span>Section {ticket.section} · Row {ticket.row}</span></div>
                <strong>${ticket.price}<small> / seat</small></strong>
              </div>
            ))}
          </div>
          <Link href={`/find-tickets?game=${heroGame.id}`} className="kz-ticketboard-cta">Compare tickets <ArrowRight size={15} /></Link>
          <small className="kz-ticketboard-disclaimer">Illustrative demo inventory · Not live ticket availability</small>
        </div>
      </section>

      <section className="kz-section kz-curated-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">THE GAMES EVERYONE'S TALKING ABOUT</span><h2>Most anticipated</h2></div>
          <Link href="/nfl">Explore NFL games <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-curated-game-grid">
          {featured.map((game) => <EventCard key={game.id} game={game} />)}
        </div>
        <div className="kz-hype-categories">
          <Link href="/nfl"><Flame size={15} /> High-demand matchups</Link>
          <Link href="/nfl"><Trophy size={15} /> Rivalries & division games</Link>
          <Link href="/nfl"><CalendarDays size={15} /> Primetime & late-season games</Link>
        </div>
      </section>

      <section className="kz-section kz-sports-section kz-sports-directory">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">BROWSE BY SPORT</span><h2>Choose your game</h2></div>
          <span className="kz-section-note">Select a sport to explore its matchups.</span>
        </div>
        <div className="kz-sports-grid">
          {sportCategories.map((sport) => (
            <Link href={sport.href} className="kz-sport-card" key={sport.kicker}>
              <img src={sport.image} alt="" />
              <div className="kz-sport-shade" />
              <div className="kz-sport-card-copy">
                <span>{sport.kicker}</span>
                <strong>{sport.name}</strong>
                <small>{sport.description}</small>
              </div>
              <span className="kz-sport-card-arrow"><ArrowRight size={19} /></span>
            </Link>
          ))}
        </div>
      </section>

      <p className="demo-disclaimer">Demo marketplace · Ticket listings are synthetic inventory for product testing and are not live availability.</p>
    </div>
  );
}
