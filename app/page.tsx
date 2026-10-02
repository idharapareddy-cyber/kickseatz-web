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
import { GAMES, PLAYER_SPOTLIGHTS, TEAMS, teamName } from "../lib/data";

const logoIds: Record<string, number> = { ARI:22, ATL:1, BAL:33, BUF:2, CAR:29, CHI:3, CIN:4, CLE:5, DAL:6, DEN:7, DET:8, GB:9, HOU:34, IND:11, JAX:30, KC:12, LV:13, LAC:24, LAR:14, MIA:15, MIN:16, NE:17, NO:18, NYG:19, NYJ:20, PHI:21, PIT:23, SF:25, SEA:26, TB:27, TEN:10, WAS:28 };
function logoUrl(slug: string) { const abbr = TEAMS.find(t => t.slug === slug)?.abbr; const id = abbr ? logoIds[abbr] : undefined; return id ? "https://a.espncdn.com/i/teamlogos/nfl/500/" + id + ".png" : ""; }

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function GameRow({
  game,
}: {
  game: (typeof GAMES)[number];
}) {
  return (
    <Link
      href={`/find-tickets?game=${game.id}`}
      className="market-game-row"
    >
      <div className="market-game-date">
        <strong>{formatDate(game.date)}</strong>
        <span>{game.time}</span>
      </div>

      <div className="market-game-matchup">
        <div>
          <strong>{teamName(game.away)}</strong>
          <span>@</span>
          <strong>{teamName(game.home)}</strong>
        </div>

        <small>
          <MapPin size={13} />
          {game.venue} · {game.city}
        </small>
      </div>

      <div className="market-game-demand">
        <span>{game.demand}</span>
      </div>

      <div className="market-game-action">
        <span>View tickets</span>
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}

export default function HomePage() {
  const featured = GAMES.slice(0, 3);
  const upcoming = GAMES.slice(3, 10);
  const trending = [...GAMES].filter((game) => game.demand === "High" || game.demand === "Premium").slice(0, 4);
  const popular = [...GAMES].sort((a, b) => {
    const score = (d: string) => d === "Premium" ? 4 : d === "High" ? 3 : d === "Medium" ? 2 : 1;
    return score(b.demand) - score(a.demand);
  }).slice(0, 4);

  return (
    <div className="page marketplace-home">
      <section className="marketplace-hero market-home-hero">
        <div className="market-home-hero-art">
          <img className="market-home-player" src={PLAYER_SPOTLIGHTS[0].image} alt="" />
          <div className="market-home-hero-copy">
            <span className="market-eyebrow">NFL TICKETS</span>
            <h1>Be there when it matters.</h1>
            <p>Find NFL games, compare listings, and get to the seats that fit you.</p>
          </div>
          <div className="market-home-featured-chip">
            <span>FEATURED GAME</span>
            <strong>{teamName(featured[0].away)} @ {teamName(featured[0].home)}</strong>
            <small>{formatDate(featured[0].date)} · {featured[0].city}</small>
          </div>
        </div>
        <div className="market-home-search-panel">
          <div className="market-search-heading">
            <strong>What do you want to see?</strong>
            <span>Search teams, games, cities, or stadiums</span>
          </div>
          <form action="/find-tickets" method="get" className="market-search-box">
            <Search size={19} />
            <input type="search" name="search" aria-label="Search teams, games, cities, or stadiums" placeholder="Search teams, games, cities, or stadiums" />
            <button type="submit">Search</button>
          </form>
          <div className="market-home-search-links">
            <Link href="/find-tickets">Browse all games</Link>
            <Link href="/teams">Browse teams</Link>
            <Link href="/find-my-game">Find a game</Link>
          </div>
        </div>
      </section>

      <div className="market-home-category-rail" aria-label="Browse NFL tickets">
        <Link className="active" href="/find-tickets">NFL Tickets</Link>
        <Link href="/find-tickets">Trending</Link>
        <Link href="/find-tickets">This Week</Link>
        <Link href="/teams">Teams</Link>
        <Link href="/find-my-game">Find a Game</Link>
        <Link href="/my-tickets">My Tickets</Link>
      </div>

      <section className="marketplace-section">
        <div className="marketplace-heading">
          <div>
            <span className="market-eyebrow">FEATURED</span>
            <h2>Popular matchups</h2>
          </div>

          <Link
            href="/find-tickets"
            className="market-see-all"
          >
            View all tickets
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="market-featured-grid">
          {featured.map((game) => (
            <Link
              key={game.id}
              href={`/find-tickets?game=${game.id}`}
              className="market-featured-card"
            >
              <div className="market-featured-top">
                <span>{game.demand}</span>
                <strong>{formatDate(game.date)}</strong>
              </div>

              <div className="market-featured-teams">
                <div>
                  <small>AWAY</small>
                  <strong>{teamName(game.away)}</strong>
                </div>

                <span>@</span>

                <div className="home">
                  <small>HOME</small>
                  <strong>{teamName(game.home)}</strong>
                </div>
              </div>

              <div className="market-featured-meta">
                <span>
                  <MapPin size={13} />
                  {game.city}
                </span>

                <span>
                  <CalendarDays size={13} />
                  {game.time}
                </span>
              </div>

              <div className="market-featured-bottom">
                <span>{game.reason}</span>
                <ArrowRight size={17} />
              </div>
            </Link>
          ))}
        </div>
      </section>



      <section className="marketplace-section market-discovery-section">
        <div className="marketplace-heading">
          <div>
            <span className="market-eyebrow">TRENDING NOW</span>
            <h2>Games people are watching</h2>
          </div>
          <Link href="/find-tickets" className="market-see-all">See all <ArrowRight size={15}/></Link>
        </div>
        <div className="market-discovery-grid">
          {trending.map((game) => (
            <Link key={game.id} href={"/find-tickets?game=" + game.id} className="market-event-card">
              <div className="market-event-visual">
                <span className="market-event-badge">TRENDING</span>
                <div className="market-event-logos">
                  <img src={logoUrl(game.away)} alt="" />
                  <b>@</b>
                  <img src={logoUrl(game.home)} alt="" />
                </div>
              </div>
              <div className="market-event-info">
                <strong>{teamName(game.away)} @ {teamName(game.home)}</strong>
                <span>{formatDate(game.date)} · {game.city}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="marketplace-section market-discovery-section">
        <div className="marketplace-heading">
          <div>
            <span className="market-eyebrow">MOST POPULAR</span>
            <h2>Popular events</h2>
          </div>
          <Link href="/find-tickets" className="market-see-all">Browse all <ArrowRight size={15}/></Link>
        </div>
        <div className="market-popular-list">
          {popular.map((game, index) => (
            <Link key={game.id} href={"/find-tickets?game=" + game.id} className="market-popular-row">
              <span className="market-popular-rank">{String(index + 1).padStart(2, "0")}</span>
              <div className="market-popular-matchup">
                <div><img src={logoUrl(game.away)} alt="" /><strong>{teamName(game.away)}</strong></div>
                <span className="market-popular-vs">VS</span>
                <div><img src={logoUrl(game.home)} alt="" /><strong>{teamName(game.home)}</strong></div>
              </div>
              <div className="market-popular-info">
                <strong>{formatDate(game.date)}</strong>
                <span>{game.time} · {game.venue} · {game.city}</span>
              </div>
              <span className="market-popular-demand">{game.demand}</span>
              <span className="market-popular-action">Tickets <ArrowRight size={15}/></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="market-category-section">
        <div className="marketplace-heading"><div><span className="market-eyebrow">EXPLORE</span><h2>Shop by what you want to see</h2></div></div>
        <div className="market-category-grid">
          <Link href="/find-tickets" className="market-category-card"><span className="market-category-icon"><Flame size={19}/></span><div><strong>High-demand games</strong><small>Premium matchups</small></div><ArrowRight size={16}/></Link>
          <Link href="/find-tickets" className="market-category-card"><span className="market-category-icon"><CalendarDays size={19}/></span><div><strong>This week</strong><small>Upcoming NFL games</small></div><ArrowRight size={16}/></Link>
          <Link href="/find-my-game" className="market-category-card"><span className="market-category-icon"><Navigation size={19}/></span><div><strong>Nearby games</strong><small>Explore by location</small></div><ArrowRight size={16}/></Link>
          <Link href="/teams" className="market-category-card"><span className="market-category-icon"><Trophy size={19}/></span><div><strong>Browse teams</strong><small>All 32 NFL teams</small></div><ArrowRight size={16}/></Link>
        </div>
      </section>

      <section className="marketplace-section market-upcoming">
        <div className="marketplace-heading">
          <div>
            <span className="market-eyebrow">UPCOMING GAMES</span>
            <h2>More games</h2>
          </div>

          <Link
            href="/teams"
            className="market-see-all"
          >
            Browse teams
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="market-game-list">
          {upcoming.map((game) => (
            <GameRow
              key={game.id}
              game={game}
            />
          ))}
        </div>
      </section>

      <section className="marketplace-section market-bonus-section">
        <div className="marketplace-heading">
          <div>
            <span className="market-eyebrow">BONUS TOOLS</span>
            <h2>More ways to use KickSeatz</h2>
          </div>
        </div>
        <div className="market-bonus-grid">
          <Link href="/find-my-game" className="market-bonus-card">
            <Search size={20} />
            <div><strong>Find My Game</strong><span>Answer a few questions and discover games that fit.</span></div>
            <ArrowRight size={16} />
          </Link>
          <Link href="/teams" className="market-bonus-card">
            <Trophy size={20} />
            <div><strong>Browse Teams</strong><span>Explore every NFL team and its upcoming games.</span></div>
            <ArrowRight size={16} />
          </Link>
          <Link href="/my-tickets" className="market-bonus-card">
            <Ticket size={20} />
            <div><strong>My Tickets</strong><span>Keep your saved listings and ticket activity together.</span></div>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="marketplace-info-strip">
        <div>
          <span className="market-eyebrow">KICKSEATZ</span>

          <h2>Know what you’re buying.</h2>
        </div>

        <p>
          Compare price, seat location, availability, and game information in
          one place.
        </p>

        <Link
          href="/find-tickets"
          className="primary-button"
        >
          Find tickets
          <Ticket size={16} />
        </Link>
      </section>

      <p className="demo-disclaimer">
        Demo marketplace · Ticket listings are synthetic inventory for product
        testing and are not live availability.
      </p>
    </div>
  );
}