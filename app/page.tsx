import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  Ticket,
} from "lucide-react";
import { GAMES, teamName } from "../lib/data";

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

  return (
    <div className="page marketplace-home">
      <section className="marketplace-hero">
        <div className="marketplace-hero-copy">
          <span className="market-eyebrow">KICKSEATZ</span>

          <h1>
            Find your game.
            <br />
            <em>Find your seats.</em>
          </h1>

          <p>
            Search NFL games, compare tickets, and see exactly what you’re
            getting before you buy.
          </p>

          <form
            action="/find-tickets"
            method="get"
            className="market-search-box"
          >
            <Search size={19} />

            <input
              type="search"
              name="search"
              aria-label="Search teams, games, cities, or stadiums"
              placeholder="Search teams, games, cities, or stadiums"
            />

            <button type="submit">Search</button>
          </form>

          <div className="market-hero-links">
            <Link href="/find-tickets">
              Browse tickets
              <ArrowRight size={15} />
            </Link>

            <Link href="/find-my-game">
              Find a game
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

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