"use client";

import Link from "next/link";
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

type TicketCategory = "all" | "thanksgiving" | "christmas" | "super-bowl" | "international" | "seasonal";

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  all: "NFL-wide demo inventory",
  thanksgiving: "Thanksgiving Day games",
  christmas: "Christmas Day games",
  "super-bowl": "Super Bowl LXI",
  international: "NFL International Series",
  seasonal: "NFL holidays & marquee games",
};

function gameMatchesCategory(game: ReturnType<typeof gameById>, category: TicketCategory) {
  if (!game || category === "all") return category === "all";

  const matchup = `${game.away}|${game.home}`;
  const thanksgiving = new Set([
    "green-bay-packers|los-angeles-rams",
    "chicago-bears|detroit-lions",
    "philadelphia-eagles|dallas-cowboys",
    "kansas-city-chiefs|buffalo-bills",
    "denver-broncos|pittsburgh-steelers",
  ]);
  const christmas = new Set([
    "green-bay-packers|chicago-bears",
    "buffalo-bills|denver-broncos",
    "los-angeles-rams|seattle-seahawks",
  ]);
  const international = new Set([
    "san-francisco-49ers|los-angeles-rams",
    "baltimore-ravens|dallas-cowboys",
    "indianapolis-colts|washington-commanders",
    "philadelphia-eagles|jacksonville-jaguars",
    "houston-texans|jacksonville-jaguars",
    "pittsburgh-steelers|new-orleans-saints",
    "cincinnati-bengals|atlanta-falcons",
    "new-england-patriots|detroit-lions",
    "minnesota-vikings|san-francisco-49ers",
  ]);

  if (category === "thanksgiving") return thanksgiving.has(matchup);
  if (category === "christmas") return christmas.has(matchup);
  if (category === "international") return international.has(matchup);
  if (category === "super-bowl") return game.date === "2027-02-14";
  if (category === "seasonal") return thanksgiving.has(matchup) || christmas.has(matchup) || game.date === "2027-02-14";
  return false;
}

export default function FindTicketsPage() {
  const [team, setTeam] = useState("all");
  const [gameId, setGameId] = useState("all");
  const [budget, setBudget] = useState(DEFAULT_PREFERENCES.budget);
  const [count, setCount] = useState(DEFAULT_PREFERENCES.ticketCount);
  const [seatArea, setSeatArea] = useState<Preferences["seatArea"]>("Any");
  const [priority, setPriority] = useState<Preferences["priority"]>(DEFAULT_PREFERENCES.priority);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TicketCategory>("all");
  const [queryLoaded, setQueryLoaded] = useState(false);

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem("kz_profile") || "null");
      if (profile) {
        setTeam(profile.favoriteTeam || "all");
        setBudget(Number(profile.budget) || DEFAULT_PREFERENCES.budget);
        setCount(Number(profile.ticketCount) || DEFAULT_PREFERENCES.ticketCount);
        setSeatArea(profile.seatArea || "Any");
        setPriority(profile.priority || DEFAULT_PREFERENCES.priority);
      }

      const params = new URLSearchParams(window.location.search);
      const qTeam = params.get("team");
      const qGame = params.get("game");
      const qSearch = params.get("search");
      const qCategory = params.get("category") as TicketCategory | null;

      if (qTeam) setTeam(qTeam);
      if (qGame) setGameId(qGame);
      if (qSearch) setSearch(qSearch);
      if (qCategory && Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, qCategory)) {
        setCategory(qCategory);
      }
    } catch {}
    setQueryLoaded(true);
  }, []);

  const categoryGames = useMemo(() => {
    if (category === "all") return GAMES;
    return GAMES.filter((game) => gameMatchesCategory(game, category));
  }, [category]);

  const gameOptions = useMemo(() => {
    const source = categoryGames;
    return team === "all"
      ? source
      : source.filter((game) => game.home === team || game.away === team);
  }, [categoryGames, team]);

  const prefs: Preferences = {
    favoriteTeam: team === "all" ? DEFAULT_PREFERENCES.favoriteTeam : team,
    budget,
    ticketCount: count,
    seatArea,
    priority,
    fanType: DEFAULT_PREFERENCES.fanType,
    radius: DEFAULT_PREFERENCES.radius,
  };

  const filtered = useMemo(() => {
    let items = TICKETS.filter((ticket) => ticket.price <= budget && ticket.quantity >= count);

    if (category !== "all") {
      items = items.filter((ticket) => gameMatchesCategory(gameById(ticket.gameId), category));
    }
    if (team !== "all") {
      items = items.filter((ticket) => ticket.home === team || ticket.away === team);
    }
    if (gameId !== "all") {
      items = items.filter((ticket) => ticket.gameId === gameId);
    }
    if (seatArea !== "Any") {
      items = items.filter((ticket) => ticket.seatArea === seatArea);
    }

    const normalizedSearch = search.trim().toLowerCase();
    if (normalizedSearch) {
      items = items.filter((ticket) => {
        const game = gameById(ticket.gameId);
        const haystack = [teamName(ticket.away), teamName(ticket.home), ticket.venue, game?.city ?? "", game?.reason ?? ""].join(" ").toLowerCase();
        return haystack.includes(normalizedSearch);
      });
    }

    if (priority === "Lowest Price") return [...items].sort((a, b) => a.price - b.price);
    if (priority === "Best Game") return [...items].sort((a, b) => b.score - a.score || a.price - b.price);

    return [...items].sort((a, b) =>
      b.score + (b.home === prefs.favoriteTeam ? 8 : b.away === prefs.favoriteTeam ? 5 : 0) -
      (a.score + (a.home === prefs.favoriteTeam ? 8 : a.away === prefs.favoriteTeam ? 5 : 0))
    );
  }, [category, team, gameId, budget, count, seatArea, priority, prefs.favoriteTeam, search]);

  if (!queryLoaded) {
    return (
      <div className="page marketplace-page">
        <div className="market-page-nav"><Link href="/">Home</Link><span>›</span><strong>Find Tickets</strong></div>
        <div className="empty-state" aria-live="polite"><Search size={28} /><h3>Loading ticket finder</h3><p>Applying your saved preferences and search filters.</p></div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Tickets</div>
          <h1>Find Tickets</h1>
          <p>Choose a team, set your budget, and compare available listings.</p>
          {category !== "all" && <div className="eyebrow" style={{ marginTop: 10 }}>{CATEGORY_LABELS[category]}</div>}
        </div>
        <div className="search-mini"><Search size={15} />{filtered.length} matches</div>
      </div>

      <div className="finder-layout">
        <aside className="filter-panel">
          <div className="filter-title"><SlidersHorizontal size={17} /><strong>Filter tickets</strong></div>
          <label>Team<select value={team} onChange={(event) => { setTeam(event.target.value); setGameId("all"); }}><option value="all">All NFL</option>{TEAMS.map((team) => <option key={team.slug} value={team.slug}>{team.name}</option>)}</select></label>
          <label>Matchup<select value={gameId} onChange={(event) => setGameId(event.target.value)}><option value="all">Any matchup</option>{gameOptions.map((game) => <option key={game.id} value={game.id}>{teamName(game.away)} @ {teamName(game.home)}</option>)}</select></label>
          <label>Max price <span className="range-value">${budget}</span><input type="range" min="35" max="350" step="5" value={budget} onChange={(event) => setBudget(Number(event.target.value))} /></label>
          <label>Tickets needed<select value={count} onChange={(event) => setCount(Number(event.target.value))}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></label>
          <label>Seat area<select value={seatArea} onChange={(event) => setSeatArea(event.target.value as Preferences["seatArea"])}><option>Any</option><option>Lower Bowl</option><option>Club</option><option>Upper Bowl</option></select></label>
          <label>Sort by<select value={priority} onChange={(event) => setPriority(event.target.value as Preferences["priority"])}><option>Best Overall Value</option><option>Lowest Price</option><option>Best Game</option></select></label>
          <button className="reset-button" onClick={() => { setTeam("all"); setGameId("all"); setBudget(DEFAULT_PREFERENCES.budget); setCount(DEFAULT_PREFERENCES.ticketCount); setSeatArea("Any"); setPriority(DEFAULT_PREFERENCES.priority); setSearch(""); setCategory("all"); window.history.replaceState(null, "", window.location.pathname); }}><Filter size={14} />Reset filters</button>
        </aside>

        <section>
          <div className="results-top"><div><strong>{filtered.length ? "Ticket listings" : "No tickets found"}</strong><span>{search ? `Search: “${search}”` : category !== "all" ? CATEGORY_LABELS[category] : team === "all" ? "NFL-wide demo inventory" : "Showing your selected team"}</span></div></div>
          {filtered.length ? <div className="stack">{filtered.slice(0, 10).map((ticket) => <TicketCard key={ticket.id} ticket={ticket} prefs={prefs} />)}</div> : <div className="empty-state"><TicketIcon size={28} /><h3>No listings match your filters</h3><p>Try a different category, higher budget, fewer tickets, or another seat area.</p></div>}
        </section>
      </div>
    </div>
  );
}
