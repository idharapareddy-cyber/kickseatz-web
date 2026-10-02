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
} from "lucide-react";
import { GAMES, TEAMS, teamName } from "../lib/data";

const logoIds: Record<string, number> = {
  ARI:22, ATL:1, BAL:33, BUF:2, CAR:29, CHI:3, CIN:4, CLE:5, DAL:6, DEN:7,
  DET:8, GB:9, HOU:34, IND:11, JAX:30, KC:12, LV:13, LAC:24, LAR:14,
  MIA:15, MIN:16, NE:17, NO:18, NYG:19, NYJ:20, PHI:21, PIT:23, SF:25,
  SEA:26, TB:27, TEN:10, WAS:28,
};

// Football-only editorial imagery. Match cards never use unrelated concert/music/soccer imagery.
const eventImages = [
  "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1668674768860-b6d34068042b?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1549963921-a936ee5b69e6?auto=format&fit=crop&w=1400&q=85",
];

function logoUrl(slug: string) {
  const abbr = TEAMS.find((t) => t.slug === slug)?.abbr;
  const id = abbr ? logoIds[abbr] : undefined;
  return id ? `https://a.espncdn.com/i/teamlogos/nfl/500/${id}.png` : "";
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
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

function EventCard({
  game,
  index,
  badge = "TRENDING",
}: {
  game: (typeof GAMES)[number];
  index: number;
  badge?: string;
}) {
  return (
    <Link href={`/find-tickets?game=${game.id}`} className="kz-event-card">
      <div className="kz-event-image">
        <img src={eventImages[index % eventImages.length]} alt="" />
        <div className="kz-image-shade" />
        <span className="kz-event-badge">{badge}</span>
        <span className="kz-heart" aria-hidden="true">♡</span>
        <div className="kz-card-logos">
          <img src={logoUrl(game.away)} alt="" />
          <span>VS</span>
          <img src={logoUrl(game.home)} alt="" />
        </div>
      </div>
      <div className="kz-event-info">
        <strong>{teamName(game.away)} @ {teamName(game.home)}</strong>
        <span>{formatDate(game.date)} · {game.city}</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const featured = GAMES.slice(0, 5);
  const trending = [...GAMES]
    .filter((game) => game.demand === "High" || game.demand === "Premium")
    .slice(0, 6);
  const upcoming = GAMES.slice(5, 12);

  return (
    <div className="page marketplace-home kz-home">
      <section className="kz-hero">
        <div className="kz-hero-image">
          <img src={eventImages[0]} alt="" />
          <div className="kz-hero-overlay" />
          <div className="kz-hero-copy">
            <span className="kz-eyebrow">KICKSEATZ · NFL TICKETS</span>
            <h1>Find your seat<br /><em>for the game.</em></h1>
            <p>Discover NFL games, compare tickets, and get closer to the action.</p>
            <Link href="/find-tickets" className="kz-primary-button">Explore NFL Tickets <ArrowRight size={17} /></Link>
          </div>
          <div className="kz-hero-game">
            <span>FEATURED GAME</span>
            <strong>{teamName(featured[0].away)} @ {teamName(featured[0].home)}</strong>
            <small>{formatDate(featured[0].date)} · {featured[0].city}</small>
          </div>
        </div>
        <div className="kz-hero-search">
          <div>
            <span className="kz-eyebrow">SEARCH THE NFL</span>
            <strong>What game are you looking for?</strong>
          </div>
          <form action="/find-tickets" method="get" className="kz-search-box">
            <Search size={19} />
            <input name="search" type="search" placeholder="Team, game, city, or stadium" aria-label="Search teams, games, cities, or stadiums" />
            <button type="submit">Search</button>
          </form>
          <div className="kz-search-links">
            <Link href="/find-tickets">All games</Link>
            <Link href="/teams">All teams</Link>
            <Link href="/find-my-game">Find My Game</Link>
          </div>
        </div>
      </section>

      <nav className="kz-category-rail" aria-label="NFL discovery">
        <Link className="active" href="/find-tickets">NFL Tickets</Link>
        <Link href="/find-tickets">Trending</Link>
        <Link href="/find-tickets">This Week</Link>
        <Link href="/teams">Teams</Link>
        <Link href="/find-my-game">Find My Game</Link>
        <Link href="/my-tickets">My Tickets</Link>
      </nav>

      <section className="kz-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">FEATURED</span><h2>Games worth seeing</h2></div>
          <Link href="/find-tickets">See all games <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-feature-grid">
          <Link href={`/find-tickets?game=${featured[0].id}`} className="kz-feature-main">
            <img src={eventImages[1]} alt="" />
            <div className="kz-feature-shade" />
            <span className="kz-feature-badge">FEATURED MATCHUP</span>
            <div className="kz-feature-copy">
              <span>{formatDate(featured[0].date)} · {featured[0].city}</span>
              <h3>{teamName(featured[0].away)} @ {teamName(featured[0].home)}</h3>
              <p>{featured[0].reason}</p>
              <b>Find tickets <ArrowRight size={15} /></b>
            </div>
          </Link>
          <div className="kz-feature-side">
            {featured.slice(1, 3).map((game, i) => (
              <EventCard key={game.id} game={game} index={i + 2} badge={i === 0 ? "HIGH DEMAND" : "POPULAR"} />
            ))}
          </div>
        </div>
      </section>

      <section className="kz-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">TRENDING NOW</span><h2>Games people are watching</h2></div>
          <Link href="/find-tickets">Browse all <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-card-grid">
          {trending.slice(0, 3).map((game, i) => <EventCard key={game.id} game={game} index={i} />)}
        </div>
      </section>

      <section className="kz-section kz-team-strip-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">EXPLORE</span><h2>Popular NFL teams</h2></div>
          <Link href="/teams">See all 32 teams <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-team-strip">
          {TEAMS.slice(0, 8).map((team) => (
            <Link
              href={`/teams/${team.slug}`}
              key={team.slug}
              className="kz-team-tile"
              style={{ "--team-color": team.color } as React.CSSProperties}
            >
              <div className="kz-team-color" />
              <img src={logoUrl(team.slug)} alt="" />
              <span>{team.abbr}</span>
              <strong>{team.name}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="kz-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">EXPLORE BY DIVISION</span><h2>Find your part of the NFL</h2></div>
          <Link href="/teams">Browse all teams <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-division-grid">
          {["AFC East","AFC North","AFC South","AFC West","NFC East","NFC North","NFC South","NFC West"].map((division) => {
            const teams = TEAMS.filter((team) => team.division === division).slice(0, 4);
            return (
              <Link href="/teams" className="kz-division-card" key={division}>
                <div className="kz-division-top">
                  <span>{division.startsWith("AFC") ? "AFC" : "NFC"}</span>
                  <ArrowRight size={16} />
                </div>
                <strong>{division}</strong>
                <div className="kz-division-logos">
                  {teams.map((team) => <img key={team.slug} src={logoUrl(team.slug)} alt="" />)}
                </div>
                <small>{teams.map((team) => team.abbr).join(" · ")}</small>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="kz-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">UPCOMING</span><h2>More NFL games</h2></div>
          <Link href="/find-tickets">View all tickets <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-game-list">
          {upcoming.map((game) => <GameRow key={game.id} game={game} />)}
        </div>
      </section>

      <section className="kz-section kz-discover">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">DISCOVER MORE</span><h2>Explore KickSeatz</h2></div>
        </div>
        <div className="kz-discover-grid">
          <Link href="/find-tickets"><Flame /><strong>High-demand games</strong><span>See matchups with strong ticket interest.</span><ArrowRight /></Link>
          <Link href="/find-tickets"><CalendarDays /><strong>This week</strong><span>Browse the next games on the schedule.</span><ArrowRight /></Link>
          <Link href="/find-my-game"><Navigation /><strong>Find My Game</strong><span>Answer a few questions and discover a matchup.</span><ArrowRight /></Link>
          <Link href="/teams"><Trophy /><strong>Browse teams</strong><span>Explore every NFL team and stadium.</span><ArrowRight /></Link>
        </div>
      </section>

      <section className="kz-info-strip">
        <div><span className="kz-eyebrow">KICKSEATZ</span><h2>Know what you’re buying.</h2></div>
        <p>Compare price, seat location, availability, and game information in one place.</p>
        <Link href="/find-tickets" className="kz-primary-button">Find tickets <Ticket size={16} /></Link>
      </section>

      <p className="demo-disclaimer">Demo marketplace · Ticket listings are synthetic inventory for product testing and are not live availability.</p>
    </div>
  );
}
