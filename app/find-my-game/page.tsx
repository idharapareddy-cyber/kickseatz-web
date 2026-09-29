"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  DEFAULT_PREFERENCES,
  Preferences,
  personalizedGames,
} from "../../lib/logic";
import { TEAMS } from "../../lib/data";

type Game = {
  id: string;
  home: string;
  away: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  demand: "Low" | "Medium" | "High" | "Premium";
  reason: string;
};

const teamNames: Record<string, string> = {};

TEAMS.forEach((team) => {
  teamNames[team.slug] = team.name;
});

function teamName(slug: string) {
  return teamNames[slug] ?? slug;
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}

function startingPrice(game: Game) {
  if (game.demand === "Premium") return 145;
  if (game.demand === "High") return 105;
  if (game.demand === "Medium") return 72;
  return 55;
}

export default function FindMyGamePage() {
  const [prefs, setPrefs] =
    useState<Preferences>(DEFAULT_PREFERENCES);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    async function loadGames() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/games"
        );

        if (!response.ok) {
          throw new Error("Failed to load games");
        }

        const data: Game[] = await response.json();
        setGames(data);
      } catch (error) {
        console.error(error);
        setError(
          "Could not connect to the KickSeatz backend."
        );
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  const results = useMemo(() => {
    if (games.length === 0) return [];

    return personalizedGames(games as any, prefs).slice(
      0,
      8
    );
  }, [games, prefs]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">GAME FINDER</div>

          <h1>Find My Game</h1>

          <p>
            Set your preferences and compare the games
            that fit.
          </p>
        </div>

        <Link
          href="/find-tickets"
          className="primary-button"
        >
          Browse tickets
          <ArrowRight size={16} />
        </Link>
      </div>

      <div
        className="card"
        style={{ marginBottom: 20 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "4px 0",
          }}
        >
          <Search size={20} />

          <div style={{ flex: 1 }}>
            <strong
              style={{ display: "block" }}
            >
              What matters most?
            </strong>

            <span className="muted">
              Choose a team, budget, seat area, and game
              type.
            </span>
          </div>

          <Link
            href="/find-tickets"
            className="secondary-button"
          >
            Search tickets
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <button
        className="secondary-button"
        onClick={() => setShowFilters(!showFilters)}
        style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <SlidersHorizontal size={16} />
        Filters

        <ChevronDown
          size={15}
          style={{
            transform: showFilters
              ? "rotate(180deg)"
              : "rotate(0deg)",
          }}
        />
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: showFilters
            ? "270px 1fr"
            : "1fr",
          gap: 22,
          alignItems: "start",
        }}
      >
        {showFilters && (
          <aside className="quiz-panel">
            <div className="filter-title">
              <SlidersHorizontal size={17} />
              <strong>Game filters</strong>
            </div>

            <label>
              Favorite team

              <select
                value={prefs.favoriteTeam}
                onChange={(event) =>
                  setPrefs({
                    ...prefs,
                    favoriteTeam:
                      event.target.value,
                  })
                }
              >
                {TEAMS.map((team) => (
                  <option
                    key={team.slug}
                    value={team.slug}
                  >
                    {team.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Game type

              <select
                value={prefs.fanType}
                onChange={(event) =>
                  setPrefs({
                    ...prefs,
                    fanType:
                      event.target.value as any,
                  })
                }
              >
                <option>Big game</option>
                <option>
                  Rivalry atmosphere
                </option>
                <option>Casual day out</option>
              </select>
            </label>

            <label>
              Max ticket price{" "}
              <span className="range-value">
                ${prefs.budget}
              </span>

              <input
                type="range"
                min="50"
                max="350"
                step="10"
                value={prefs.budget}
                onChange={(event) =>
                  setPrefs({
                    ...prefs,
                    budget: Number(
                      event.target.value
                    ),
                  })
                }
              />
            </label>

            <label>
              Tickets

              <select
                value={prefs.ticketCount}
                onChange={(event) =>
                  setPrefs({
                    ...prefs,
                    ticketCount: Number(
                      event.target.value
                    ),
                  })
                }
              >
                <option value={1}>
                  1 ticket
                </option>
                <option value={2}>
                  2 tickets
                </option>
                <option value={3}>
                  3 tickets
                </option>
                <option value={4}>
                  4 tickets
                </option>
              </select>
            </label>

            <label>
              Seat area

              <select
                value={prefs.seatArea}
                onChange={(event) =>
                  setPrefs({
                    ...prefs,
                    seatArea:
                      event.target.value as any,
                  })
                }
              >
                <option value="Any">
                  Any location
                </option>
                <option value="Lower Bowl">
                  Lower Bowl
                </option>
                <option value="Club">
                  Club
                </option>
                <option value="Upper Bowl">
                  Upper Bowl
                </option>
              </select>
            </label>

            <label>
              Home / away

              <select
                value={prefs.homeAway || "Either"}
                onChange={(event) =>
                  setPrefs({
                    ...prefs,
                    homeAway:
                      event.target.value as any,
                  })
                }
              >
                <option value="Either">
                  Home or away
                </option>
                <option value="Home">
                  Home games
                </option>
                <option value="Away">
                  Away games
                </option>
              </select>
            </label>

            <label>
              Travel radius

              <select
                value={prefs.radius}
                onChange={(event) =>
                  setPrefs({
                    ...prefs,
                    radius: Number(
                      event.target.value
                    ),
                  })
                }
              >
                <option value={100}>
                  Within 100 miles
                </option>
                <option value={250}>
                  Within 250 miles
                </option>
                <option value={500}>
                  Within 500 miles
                </option>
                <option value={1000}>
                  Anywhere in the U.S.
                </option>
              </select>
            </label>

            <div className="quiz-summary">
              <div>
                <strong>
                  {loading
                    ? "Finding games..."
                    : `${results.length} matches found`}
                </strong>

                <p>
                  {error
                    ? "Backend connection failed."
                    : "Results update automatically."}
                </p>
              </div>
            </div>
          </aside>
        )}

        <section>
          <div className="results-top">
            <div>
              <strong>Matching games</strong>

              <span>
                {loading
                  ? "Searching upcoming NFL games..."
                  : `${results.length} matchups`}
              </span>
            </div>

            <select
              defaultValue="recommended"
              style={{
                width: "auto",
                minWidth: 150,
              }}
            >
              <option value="recommended">
                Recommended
              </option>
              <option value="price">
                Lowest price
              </option>
              <option value="demand">
                Game demand
              </option>
            </select>
          </div>

          {loading && (
            <div className="card">
              <p className="muted">
                Loading upcoming NFL games...
              </p>
            </div>
          )}

          {error && (
            <div className="card">
              <p className="text-red-400">
                {error}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            results.length === 0 && (
              <div className="card">
                <strong>
                  No matching games found.
                </strong>

                <p className="muted">
                  Try increasing your budget or
                  travel radius.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            results.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                {results.map((game, index) => {
                  const price =
                    startingPrice(game);

                  return (
                    <Link
                      key={game.id}
                      href={`/find-tickets?game=${game.id}`}
                      className="card"
                      style={{
                        textDecoration: "none",
                        display: "block",
                        transition:
                          "transform 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "1fr auto",
                          gap: 20,
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems:
                                "center",
                              gap: 8,
                              marginBottom: 10,
                              flexWrap: "wrap",
                            }}
                          >
                            {index === 0 && (
                              <span className="score-chip">
                                Best match
                              </span>
                            )}

                            <span className="muted">
                              {formatDate(
                                game.date
                              )}{" "}
                              • {game.time}
                            </span>

                            <span className="muted">
                              • {game.demand} demand
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize:
                                "1.15rem",
                              fontWeight: 700,
                              marginBottom: 7,
                            }}
                          >
                            {teamName(
                              game.away
                            )}{" "}
                            <span className="muted">
                              @
                            </span>{" "}
                            {teamName(
                              game.home
                            )}
                          </div>

                          <div className="muted">
                            {game.venue} •{" "}
                            {game.city}
                          </div>

                          <div
                            style={{
                              marginTop: 10,
                              fontSize: "0.9rem",
                            }}
                          >
                            {game.reason}
                          </div>
                        </div>

                        <div
                          style={{
                            textAlign: "right",
                            minWidth: 125,
                          }}
                        >
                          <div
                            className="muted"
                            style={{
                              fontSize: "0.8rem",
                            }}
                          >
                            Tickets from
                          </div>

                          <div
                            style={{
                              fontSize:
                                "1.35rem",
                              fontWeight: 800,
                              margin:
                                "2px 0 7px",
                            }}
                          >
                            ${price}
                          </div>

                          <span className="text-button">
                            View tickets
                            <ArrowRight
                              size={15}
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

          <div style={{ marginTop: 18 }}>
            <Link
              href="/find-tickets"
              className="secondary-button"
            >
              Browse all games
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      <p className="demo-disclaimer">
        Demo site: ticket listings are synthetic
        inventory for product testing and are not live
        availability.
      </p>
    </div>
  );
}