"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Filter,
  Search,
  SlidersHorizontal,
  Ticket as TicketIcon,
} from "lucide-react";
import { TicketCard } from "../../components/TicketCard";
import { DEFAULT_PREFERENCES, Preferences } from "../../lib/logic";
import { GAMES, TEAMS, TICKETS, gameById, teamName } from "../../lib/data";

export default function FindTicketsPage() {
  const [team, setTeam] = useState("all");
  const [gameId, setGameId] = useState("all");
  const [budget, setBudget] = useState(DEFAULT_PREFERENCES.budget);
  const [count, setCount] = useState(DEFAULT_PREFERENCES.ticketCount);
  const [seatArea, setSeatArea] =
    useState<Preferences["seatArea"]>("Any");
  const [priority, setPriority] =
    useState<Preferences["priority"]>(
      DEFAULT_PREFERENCES.priority
    );
  const [search, setSearch] = useState("");
  const [queryLoaded, setQueryLoaded] = useState(false);

  useEffect(() => {
    try {
      const profile = JSON.parse(
        localStorage.getItem("kz_profile") || "null"
      );

      if (profile) {
        setTeam(profile.favoriteTeam || "all");
        setBudget(
          Number(profile.budget) || DEFAULT_PREFERENCES.budget
        );
        setCount(
          Number(profile.ticketCount) ||
            DEFAULT_PREFERENCES.ticketCount
        );
        setSeatArea(profile.seatArea || "Any");
        setPriority(
          profile.priority || DEFAULT_PREFERENCES.priority
        );
      }

      const params = new URLSearchParams(
        window.location.search
      );

      const qTeam = params.get("team");
      const qGame = params.get("game");
      const qSearch = params.get("search");

      if (qTeam) setTeam(qTeam);
      if (qGame) setGameId(qGame);
      if (qSearch) setSearch(qSearch);
    } catch {}

    setQueryLoaded(true);
  }, []);

  const gameOptions = useMemo(
    () =>
      team === "all"
        ? GAMES
        : GAMES.filter(
            (game) =>
              game.home === team || game.away === team
          ),
    [team]
  );

  const prefs: Preferences = {
    favoriteTeam:
      team === "all"
        ? DEFAULT_PREFERENCES.favoriteTeam
        : team,
    budget,
    ticketCount: count,
    seatArea,
    priority,
    fanType: DEFAULT_PREFERENCES.fanType,
    radius: DEFAULT_PREFERENCES.radius,
  };

  const filtered = useMemo(() => {
    let items = TICKETS.filter(
      (ticket) =>
        ticket.price <= budget &&
        ticket.quantity >= count
    );

    if (team !== "all") {
      items = items.filter(
        (ticket) =>
          ticket.home === team ||
          ticket.away === team
      );
    }

    if (gameId !== "all") {
      items = items.filter(
        (ticket) => ticket.gameId === gameId
      );
    }

    if (seatArea !== "Any") {
      items = items.filter(
        (ticket) => ticket.seatArea === seatArea
      );
    }

    const normalizedSearch = search.trim().toLowerCase();
    if (normalizedSearch) {
      items = items.filter((ticket) => {
        const game = gameById(ticket.gameId);
        const haystack = [
          teamName(ticket.away),
          teamName(ticket.home),
          ticket.venue,
          game?.city ?? "",
          game?.reason ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedSearch);
      });
    }

    if (priority === "Lowest Price") {
      return [...items].sort(
        (a, b) => a.price - b.price
      );
    }

    if (priority === "Best Game") {
      return [...items].sort(
        (a, b) =>
          b.score - a.score ||
          a.price - b.price
      );
    }

    return [...items].sort(
      (a, b) =>
        b.score +
          (b.home === prefs.favoriteTeam
            ? 8
            : b.away === prefs.favoriteTeam
              ? 5
              : 0) -
        (a.score +
          (a.home === prefs.favoriteTeam
            ? 8
            : a.away === prefs.favoriteTeam
              ? 5
              : 0))
    );
  }, [
    team,
    gameId,
    budget,
    count,
    seatArea,
    priority,
    prefs.favoriteTeam,
    search,
  ]);

  if (!queryLoaded) return null;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Tickets</div>

          <h1>Find Tickets</h1>

          <p>
            Choose a team, set your budget, and compare
            available listings.
          </p>
        </div>

        <div className="search-mini">
          <Search size={15} />
          {filtered.length} matches
        </div>
      </div>

      <div className="finder-layout">
        <aside className="filter-panel">
          <div className="filter-title">
            <SlidersHorizontal size={17} />
            <strong>Filter tickets</strong>
          </div>

          <label>
            Team
            <select
              value={team}
              onChange={(event) => {
                setTeam(event.target.value);
                setGameId("all");
              }}
            >
              <option value="all">All NFL</option>

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
            Matchup
            <select
              value={gameId}
              onChange={(event) =>
                setGameId(event.target.value)
              }
            >
              <option value="all">
                Any matchup
              </option>

              {gameOptions.map((game) => (
                <option
                  key={game.id}
                  value={game.id}
                >
                  {teamName(game.away)} @ {teamName(game.home)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Max price{" "}
            <span className="range-value">
              ${budget}
            </span>

            <input
              type="range"
              min="35"
              max="350"
              step="5"
              value={budget}
              onChange={(event) =>
                setBudget(Number(event.target.value))
              }
            />
          </label>

          <label>
            Tickets needed

            <select
              value={count}
              onChange={(event) =>
                setCount(Number(event.target.value))
              }
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </label>

          <label>
            Seat area

            <select
              value={seatArea}
              onChange={(event) =>
                setSeatArea(
                  event.target.value as Preferences["seatArea"]
                )
              }
            >
              <option>Any</option>
              <option>Lower Bowl</option>
              <option>Club</option>
              <option>Upper Bowl</option>
            </select>
          </label>

          <label>
            Sort by

            <select
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value as Preferences["priority"]
                )
              }
            >
              <option>Best Overall Value</option>
              <option>Lowest Price</option>
              <option>Best Game</option>
            </select>
          </label>

          <button
            className="reset-button"
            onClick={() => {
              setTeam("all");
              setGameId("all");
              setBudget(DEFAULT_PREFERENCES.budget);
              setCount(
                DEFAULT_PREFERENCES.ticketCount
              );
              setSeatArea("Any");
              setPriority(
                DEFAULT_PREFERENCES.priority
              );
              setSearch("");
            }}
          >
            <Filter size={14} />
            Reset filters
          </button>
        </aside>

        <section>
          <div className="results-top">
            <div>
              <strong>
                {filtered.length
                  ? "Ticket listings"
                  : "No tickets found"}
              </strong>

              <span>
                {search
                  ? `Search: “${search}”`
                  : team === "all"
                    ? "NFL-wide demo inventory"
                    : "Showing your selected team"}
              </span>
            </div>
          </div>

          {filtered.length ? (
            <div className="stack">
              {filtered
                .slice(0, 10)
                .map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    prefs={prefs}
                  />
                ))}
            </div>
          ) : (
            <div className="empty-state">
              <TicketIcon size={28} />

              <h3>
                No listings match your filters
              </h3>

              <p>
                Try a higher budget, fewer tickets, or
                another seat area.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}