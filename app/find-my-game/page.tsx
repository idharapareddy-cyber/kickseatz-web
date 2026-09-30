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
import { GAMES, TEAMS, TICKETS, Game } from "../../lib/data";

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
  const prices = TICKETS
    .filter((ticket) => ticket.gameId === game.id)
    .map((ticket) => ticket.price);

  return prices.length ? Math.min(...prices) : 0;
}

const demandRank: Record<Game["demand"], number> = {
  Premium: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

function demandClass(demand: Game["demand"]) {
  if (demand === "Premium") return "premium";
  if (demand === "High") return "high";
  if (demand === "Medium") return "medium";
  return "low";
}

export default function FindMyGamePage() {
  const [prefs, setPrefs] =
    useState<Preferences>(DEFAULT_PREFERENCES);

  const [games, setGames] = useState<Game[]>(GAMES);
  const [loading, setLoading] = useState(Boolean(process.env.NEXT_PUBLIC_API_BASE_URL));
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const [sortBy, setSortBy] =
    useState<"recommended" | "price" | "demand">(
      "recommended"
    );

  useEffect(() => {
    try {
      const profile = JSON.parse(
        localStorage.getItem("kz_profile") || "null"
      );

      if (profile) {
        setPrefs({
          ...DEFAULT_PREFERENCES,
          ...profile,
          location: profile.location || "",
        });
      }
    } catch {
      // Ignore invalid localStorage data.
    }

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
    if (!apiBase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch(`${apiBase}/api/games`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load games");
        return response.json();
      })
      .then((data: Game[]) => {
        if (!cancelled && Array.isArray(data) && data.length) {
          setGames(data);
        }
      })
      .catch(() => {
        // Keep the built-in demo games when the optional backend is unavailable.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (games.length === 0) return [];

    const ticketEligibleIds = new Set(
      TICKETS
        .filter((ticket) => ticket.price <= prefs.budget)
        .filter((ticket) => ticket.quantity >= prefs.ticketCount)
        .filter(
          (ticket) =>
            prefs.seatArea === "Any" ||
            ticket.seatArea === prefs.seatArea
        )
        .map((ticket) => ticket.gameId)
    );

    const eligibleGames = games.filter((game) => {
      if (!ticketEligibleIds.has(game.id)) return false;
      if (prefs.homeAway === "Home" && game.home !== prefs.favoriteTeam) {
        return false;
      }
      if (prefs.homeAway === "Away" && game.away !== prefs.favoriteTeam) {
        return false;
      }
      return true;
    });

    const personalized = personalizedGames(
      eligibleGames,
      prefs
    );

    const sorted = [...personalized];

    if (sortBy === "price") {
      sorted.sort(
        (a, b) =>
          startingPrice(a) - startingPrice(b)
      );
    }

    if (sortBy === "demand") {
      sorted.sort(
        (a, b) =>
          demandRank[b.demand] -
            demandRank[a.demand] ||
          startingPrice(a) - startingPrice(b)
      );
    }

    return sorted.slice(0, 8);
  }, [games, prefs, sortBy]);

  const updatePrefs = (
    changes: Partial<Preferences>
  ) => {
    setPrefs((current) => ({
      ...current,
      ...changes,
    }));
  };

  return (
    <div
      className="page"
      style={{
        paddingTop: 28,
      }}
    >
      <div
        className="page-head"
        style={{
          marginBottom: 24,
        }}
      >
        <div>
          <div className="eyebrow">
            GAME FINDER
          </div>

          <h1>Find My Game</h1>

          <p>
            Set your preferences and find NFL games
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
        style={{
          marginBottom: 18,
          padding: "16px 18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 13,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              minWidth: 38,
              borderRadius: 11,
              display: "grid",
              placeItems: "center",
              background:
                "rgba(124, 58, 237, 0.12)",
              border:
                "1px solid rgba(124, 58, 237, 0.25)",
            }}
          >
            <Search size={18} />
          </div>

          <div style={{ flex: 1 }}>
            <strong
              style={{
                display: "block",
                marginBottom: 3,
              }}
            >
              What matters most?
            </strong>

            <span className="muted">
              Choose your team, budget, seats, and
              game type.
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
        onClick={() =>
          setShowFilters(!showFilters)
        }
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
            transition: "transform 0.15s ease",
          }}
        />
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: showFilters
            ? "270px minmax(0, 1fr)"
            : "minmax(0, 1fr)",
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
                  updatePrefs({
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
                  updatePrefs({
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
                  updatePrefs({
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
                  updatePrefs({
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
                  updatePrefs({
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
                  updatePrefs({
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
                  updatePrefs({
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

        <section
          style={{
            minWidth: 0,
          }}
        >
          <div
            className="results-top"
            style={{
              marginBottom: 12,
            }}
          >
            <div>
              <strong>Matching games</strong>

              <span>
                {loading
                  ? "Searching upcoming NFL games..."
                  : `${results.length} matchups`}
              </span>
            </div>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as
                    | "recommended"
                    | "price"
                    | "demand"
                )
              }
              aria-label="Sort games"
              style={{
                width: "auto",
                minWidth: 160,
                minHeight: 42,
                padding: "9px 34px 9px 13px",
                borderRadius: 10,
                background:
                  "var(--panel, #15131d)",
                backgroundColor: "#15131d",
                color: "#f5f3ff",
                border:
                  "1px solid rgba(255,255,255,0.12)",
                outline: "none",
                colorScheme: "dark",
                appearance: "auto",
              }}
            >
              <option
                value="recommended"
                style={{
                  background: "#15131d",
                  color: "#f5f3ff",
                }}
              >
                Recommended
              </option>

              <option
                value="price"
                style={{
                  background: "#15131d",
                  color: "#f5f3ff",
                }}
              >
                Lowest price
              </option>

              <option
                value="demand"
                style={{
                  background: "#15131d",
                  color: "#f5f3ff",
                }}
              >
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
                  gap: 10,
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
                        padding: "17px 18px",
                        border:
                          index === 0 &&
                          sortBy === "recommended"
                            ? "1px solid rgba(124,58,237,0.45)"
                            : undefined,
                        boxShadow:
                          index === 0 &&
                          sortBy === "recommended"
                            ? "0 0 0 1px rgba(124,58,237,0.08)"
                            : undefined,
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "minmax(0, 1fr) auto",
                          gap: 20,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            {index === 0 &&
                              sortBy ===
                                "recommended" && (
                                <span className="score-chip">
                                  Best match
                                </span>
                              )}

                            <span className="muted">
                              {formatDate(
                                game.date
                              )}{" "}
                              · {game.time}
                            </span>

                            <span
                              className={`muted demand-${demandClass(
                                game.demand
                              )}`}
                            >
                              · {game.demand} demand
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize:
                                "1.1rem",
                              fontWeight: 750,
                              marginBottom: 6,
                              letterSpacing:
                                "-0.01em",
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

                          <div
                            className="muted"
                            style={{
                              fontSize:
                                "0.82rem",
                            }}
                          >
                            {game.venue} ·{" "}
                            {game.city}
                          </div>

                          <div
                            style={{
                              marginTop: 9,
                              fontSize: "0.86rem",
                            }}
                          >
                            {game.reason}
                          </div>
                        </div>

                        <div
                          style={{
                            textAlign: "right",
                            minWidth: 115,
                          }}
                        >
                          <div
                            className="muted"
                            style={{
                              fontSize:
                                "0.74rem",
                              marginBottom: 2,
                            }}
                          >
                            Tickets from
                          </div>

                          <div
                            style={{
                              fontSize:
                                "1.3rem",
                              fontWeight: 800,
                              marginBottom: 6,
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

          <div
            style={{
              marginTop: 18,
            }}
          >
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