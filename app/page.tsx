import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  MapPin,
  Search,
  Ticket,
  Users,
} from "lucide-react";
import { GAMES } from "../lib/data";

const teamNames: Record<string, string> = {
  "kansas-city-chiefs": "Kansas City Chiefs",
  "buffalo-bills": "Buffalo Bills",
  "dallas-cowboys": "Dallas Cowboys",
  "philadelphia-eagles": "Philadelphia Eagles",
  "san-francisco-49ers": "San Francisco 49ers",
  "seattle-seahawks": "Seattle Seahawks",
  "green-bay-packers": "Green Bay Packers",
  "chicago-bears": "Chicago Bears",
  "baltimore-ravens": "Baltimore Ravens",
  "pittsburgh-steelers": "Pittsburgh Steelers",
  "miami-dolphins": "Miami Dolphins",
  "new-york-jets": "New York Jets",
  "atlanta-falcons": "Atlanta Falcons",
  "new-orleans-saints": "New Orleans Saints",
  "new-england-patriots": "New England Patriots",
  "denver-broncos": "Denver Broncos",
  "new-york-giants": "New York Giants",
  "detroit-lions": "Detroit Lions",
  "houston-texans": "Houston Texans",
  "jacksonville-jaguars": "Jacksonville Jaguars",
  "los-angeles-rams": "Los Angeles Rams",
  "cincinnati-bengals": "Cincinnati Bengals",
  "cleveland-browns": "Cleveland Browns",
  "tampa-bay-buccaneers": "Tampa Bay Buccaneers",
  "carolina-panthers": "Carolina Panthers",
  "minnesota-vikings": "Minnesota Vikings",
  "arizona-cardinals": "Arizona Cardinals",
  "indianapolis-colts": "Indianapolis Colts",
  "las-vegas-raiders": "Las Vegas Raiders",
  "los-angeles-chargers": "Los Angeles Chargers",
  "tennessee-titans": "Tennessee Titans",
  "washington-commanders": "Washington Commanders",
};

function teamName(slug: string) {
  return teamNames[slug] ?? slug;
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function GameRow({ game }: { game: (typeof GAMES)[number] }) {
  return (
    <Link href={`/find-tickets?game=${game.id}`} className="market-game-row">
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

  return (
    <div className="page marketplace-home">
      <section className="marketplace-hero">
        <div className="marketplace-hero-copy">
          <span className="market-eyebrow">NFL TICKETS</span>
          <h1>
            Find the game.
            <br />
            <em>Pick the seats.</em>
          </h1>
          <p>
            Search NFL matchups, compare ticket options, and find a game that
            fits what you want to spend.
          </p>

          <form action="/find-tickets" className="market-search-box">
            <Search size={19} />
            <input
              name="search"
              aria-label="Search teams, games, cities, or stadiums"
              placeholder="Search teams, games, cities, or stadiums"
            />
            <button type="submit">Search</button>
          </form>

          <div className="market-hero-links">
            <Link href="/find-tickets">
              Browse all tickets <ArrowRight size={15} />
            </Link>
            <Link href="/find-my-game">
              Find my game <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="marketplace-hero-panel">
          <div className="market-panel-top">
            <span>WHAT YOU CAN COMPARE</span>
            <Ticket size={18} />
          </div>

          <div className="market-panel-feature">
            <strong>Ticket price</strong>
            <span>See cost before you commit.</span>
          </div>
          <div className="market-panel-feature">
            <strong>Seat location</strong>
            <span>Understand the section and row.</span>
          </div>
          <div className="market-panel-feature">
            <strong>Game context</strong>
            <span>Matchups, demand, and venue.</span>
          </div>

          <Link href="/find-tickets" className="market-panel-link">
            Explore tickets <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="market-shortcut-bar">
        <Link href="/find-tickets">
          <Ticket size={18} />
          <span>
            <strong>Find Tickets</strong>
            <small>Compare listings</small>
          </span>
          <ChevronRight size={17} />
        </Link>
        <Link href="/find-my-game">
          <CalendarDays size={18} />
          <span>
            <strong>Find My Game</strong>
            <small>Match your preferences</small>
          </span>
          <ChevronRight size={17} />
        </Link>
        <Link href="/teams">
          <Users size={18} />
          <span>
            <strong>Browse Teams</strong>
            <small>All 32 NFL teams</small>
          </span>
          <ChevronRight size={17} />
        </Link>
      </section>

      <section className="marketplace-section">
        <div className="marketplace-heading">
          <div>
            <span className="market-eyebrow">FEATURED GAMES</span>
            <h2>Games worth a look</h2>
          </div>
          <Link href="/find-tickets" className="market-see-all">
            See all games <ArrowRight size={15} />
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
                <span>{game.city}</span>
                <span>{game.time}</span>
              </div>

              <div className="market-featured-bottom">
                <span>{game.reason}</span>
                <ArrowRight size={17} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="marketplace-section market-upcoming">
        <div className="marketplace-heading">
          <div>
            <span className="market-eyebrow">UPCOMING</span>
            <h2>More games on the schedule</h2>
          </div>
        </div>

        <div className="market-game-list">
          {upcoming.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section className="marketplace-info-strip">
        <div>
          <span className="market-eyebrow">WHY KICKSEATZ</span>
          <h2>More than a ticket price.</h2>
        </div>
        <p>
          KickSeatz brings ticket price, seat information, game context, and
          recommendation signals together so you can compare the whole option
          instead of staring at a number by itself.
        </p>
        <Link href="/find-tickets" className="primary-button">
          Start browsing <ArrowRight size={16} />
        </Link>
      </section>

      <p className="demo-disclaimer">
        Demo marketplace · Ticket listings are synthetic inventory for product
        testing and are not live availability.
      </p>
    </div>
  );
}
