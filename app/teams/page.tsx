"use client";

import Link from "next/link";
import { Search, ArrowRight, MapPin, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TEAMS, Team } from "../../lib/data";
import type { CSSProperties } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

const divisionFilters = [
  "All",
  "AFC",
  "NFC",
  "AFC East",
  "AFC North",
  "AFC South",
  "AFC West",
  "NFC East",
  "NFC North",
  "NFC South",
  "NFC West",
] as const;

const logoIds: Record<string, number> = {
  ARI: 22, ATL: 1, BAL: 33, BUF: 2, CAR: 29, CHI: 3, CIN: 4, CLE: 5,
  DAL: 6, DEN: 7, DET: 8, GB: 9, HOU: 34, IND: 11, JAX: 30, KC: 12,
  LV: 13, LAC: 24, LAR: 14, MIA: 15, MIN: 16, NE: 17, NO: 18, NYG: 19,
  NYJ: 20, PHI: 21, PIT: 23, SF: 25, SEA: 26, TB: 27, TEN: 10, WAS: 28,
};

function logoUrl(abbr: string) {
  const id = logoIds[abbr];
  return id ? `https://a.espncdn.com/i/teamlogos/nfl/500/${id}.png` : "";
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [loading, setLoading] = useState(Boolean(apiBase));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof divisionFilters)[number]>("All");

  useEffect(() => {
    if (!apiBase) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 6000);

    fetch(`${apiBase}/api/teams`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load teams");
        return response.json();
      })
      .then((data: Team[]) => {
        if (!cancelled && Array.isArray(data) && data.length) setTeams(data);
      })
      .catch(() => {
        // Keep the built-in demo inventory when the optional backend is unavailable.
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const filteredTeams = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return teams.filter((team) => {
      const matchesQuery =
        !normalized ||
        team.name.toLowerCase().includes(normalized) ||
        team.city.toLowerCase().includes(normalized) ||
        team.abbr.toLowerCase().includes(normalized);
      const matchesFilter =
        filter === "All" ||
        filter === "AFC" ||
        filter === "NFC"
          ? filter === "All" ||
            team.division.startsWith(filter)
          : team.division === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, teams]);

  return (
    <main className="page teams-directory">
      <section className="teams-intro">
        <div>
          <div className="eyebrow">NFL Directory</div>
          <h1>Find your team.</h1>
          <p>Explore all 32 NFL teams, browse their home venues, and jump straight to tickets.</p>
        </div>
        <div className="teams-count">
          <strong>{filteredTeams.length}</strong>
          <span>of 32 teams</span>
        </div>
      </section>

      <section className="teams-toolbar" aria-label="Team filters">
        <label className="teams-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search teams, cities, or abbreviations"
            aria-label="Search teams"
          />
        </label>
        <div className="division-tabs" role="group" aria-label="Filter by conference or division">
          {divisionFilters.map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item ? "division-tab active" : "division-tab"}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="teams-section-head">
        <div>
          <div className="eyebrow">Team Directory</div>
          <h2>{filter === "All" ? "All 32 teams" : filter}</h2>
        </div>
        {loading ? <div className="search-mini">Loading team data</div> : <span>{filteredTeams.length} teams</span>}
      </div>

      {filteredTeams.length ? (
        <div className="team-grid teams-grid-upgraded">
          {filteredTeams.map((team) => (
            <Link
              key={team.slug}
              href={`/teams/${team.slug}`}
              className="team-card team-card-upgraded"
              style={{ "--team": team.color } as CSSProperties}
            >
              <div className="team-logo">
                <img
                  src={logoUrl(team.abbr)}
                  alt=""
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="team-card-copy">
                <div className="team-card-name">
                  <strong>{team.name}</strong>
                  <span>{team.abbr}</span>
                </div>
                <p>{team.city}, {team.state}</p>
                <small><MapPin size={12} />{team.venue}</small>
              </div>
              <div className="team-card-arrow">
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} />
          <h3>No teams found</h3>
          <p>Try a different team, city, abbreviation, or division.</p>
        </div>
      )}

      <section className="teams-bottom-panel">
        <div className="teams-bottom-icon"><Trophy size={21} /></div>
        <div>
          <div className="eyebrow">Built for ticket discovery</div>
          <h2>Pick a team, then find the right seats.</h2>
          <p>Every team page connects directly to upcoming games and KickSeatz demo ticket inventory.</p>
        </div>
      </section>

      <style jsx>{`
        .teams-intro {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 30px;
        }
        .teams-intro h1 {
          margin: 8px 0 10px;
          font-size: clamp(42px, 5vw, 62px);
          line-height: .98;
          letter-spacing: -.055em;
        }
        .teams-intro p {
          max-width: 650px;
          margin: 0;
          color: #918a9d;
          font-size: 15px;
        }
        .teams-count {
          min-width: 120px;
          padding: 14px 16px;
          border: 1px solid #2a2634;
          border-radius: 15px;
          background: #12101a;
          text-align: right;
        }
        .teams-count strong {
          display: block;
          font-size: 27px;
          letter-spacing: -.04em;
        }
        .teams-count span {
          color: #777080;
          font-size: 11px;
        }
        .teams-toolbar {
          display: grid;
          grid-template-columns: minmax(260px, 1fr) auto;
          gap: 14px;
          align-items: center;
          padding: 14px;
          margin-bottom: 34px;
          border: 1px solid #2a2634;
          border-radius: 17px;
          background: rgba(17,16,26,.88);
        }
        .teams-search {
          min-height: 46px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 13px;
          border: 1px solid #302b3b;
          border-radius: 12px;
          background: #191721;
          color: #777080;
        }
        .teams-search:focus-within {
          border-color: #6d58f3;
          box-shadow: 0 0 0 3px rgba(91,46,255,.11);
        }
        .teams-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #f4f1f8;
          font-size: 13px;
        }
        .teams-search input::placeholder { color: #6f6878; }
        .division-tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .division-tab {
          min-height: 38px;
          padding: 0 10px;
          border: 1px solid #302b3b;
          border-radius: 9px;
          background: #17151f;
          color: #847d90;
          cursor: pointer;
          font-size: 10px;
          font-weight: 800;
          transition: .16s ease;
        }
        .division-tab:hover { border-color: #4a405b; color: #ddd7e7; }
        .division-tab.active {
          border-color: #6d58f3;
          background: rgba(91,46,255,.16);
          color: #eeeaff;
        }
        .teams-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 17px;
        }
        .teams-section-head h2 {
          margin: 5px 0 0;
          font-size: 27px;
          letter-spacing: -.035em;
        }
        .teams-section-head > span { color: #6f6878; font-size: 11px; }
        .teams-grid-upgraded { gap: 13px; }
        .team-card-upgraded {
          min-height: 112px;
          padding: 16px;
          gap: 13px;
          background: linear-gradient(145deg, rgba(19,18,28,.96), rgba(15,14,22,.96));
          border-color: #292532;
          transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease;
        }
        .team-card-upgraded:hover {
          transform: translateY(-3px);
          border-color: color-mix(in srgb, var(--team) 45%, #393245);
          box-shadow: 0 18px 42px rgba(0,0,0,.24);
        }
        .team-logo {
          position: relative;
          flex: 0 0 57px;
          width: 57px;
          height: 57px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid color-mix(in srgb, var(--team) 50%, #312b3a);
          background: radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--team) 28%, #17151e), #111019 75%);
        }
        .team-logo img {
          width: 43px;
          height: 43px;
          object-fit: contain;
          position: relative;
          z-index: 2;
        }
        .team-card-copy { min-width: 0; flex: 1; }
        .team-card-name {
          display: flex !important;
          flex-direction: row !important;
          align-items: center;
          gap: 7px;
        }
        .team-card-name strong { font-size: 13px; }
        .team-card-name span {
          padding: 3px 5px;
          border-radius: 5px;
          background: rgba(255,255,255,.05);
          color: #80798a;
          font-size: 8px;
          font-weight: 900;
        }
        .team-card-copy p {
          margin: 3px 0 4px;
          color: #827b8d;
          font-size: 10px;
        }
        .team-card-copy small {
          color: #777080;
          font-size: 9px;
        }
        .team-card-arrow {
          margin-left: auto;
          color: #5e5868;
          transition: transform .16s ease, color .16s ease;
        }
        .team-card-upgraded:hover .team-card-arrow {
          transform: translateX(2px);
          color: #b9abff;
        }
        .teams-bottom-panel {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 42px;
          padding: 22px;
          border: 1px solid #2a2634;
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(24,20,35,.85), rgba(15,14,22,.92));
        }
        .teams-bottom-icon {
          width: 45px;
          height: 45px;
          flex: 0 0 45px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(139,108,255,.25);
          border-radius: 13px;
          background: rgba(91,46,255,.12);
          color: #b9abff;
        }
        .teams-bottom-panel h2 {
          margin: 4px 0 3px;
          font-size: 20px;
          letter-spacing: -.025em;
        }
        .teams-bottom-panel p {
          margin: 0;
          color: #7f7889;
          font-size: 11px;
        }
        @media (max-width: 1000px) {
          .teams-toolbar { grid-template-columns: 1fr; }
          .division-tabs { justify-content: flex-start; }
        }
        @media (max-width: 650px) {
          .teams-intro { align-items: flex-start; flex-direction: column; gap: 16px; }
          .teams-count { text-align: left; }
          .teams-toolbar { padding: 11px; }
          .division-tabs { flex-wrap: nowrap; overflow-x: auto; justify-content: flex-start; padding-bottom: 2px; scrollbar-width: none; }
          .division-tabs::-webkit-scrollbar { display: none; }
          .division-tab { flex: 0 0 auto; }
          .teams-bottom-panel { align-items: flex-start; }
        }
      `}</style>
    </main>
  );
}
