import { useEffect, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { TEAMS, Team } from "../../lib/data";
import Link from "next/link";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [loading, setLoading] = useState(Boolean(apiBase));

  useEffect(() => {
    if (!apiBase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch(`${apiBase}/api/teams`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load teams");
        return response.json();
      })
      .then((data: Team[]) => {
        if (!cancelled && Array.isArray(data) && data.length) {
          setTeams(data);
        }
      })
      .catch(() => {
        // Keep the built-in demo inventory when the optional backend is unavailable.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">KickSeatz</div>
          <h1>NFL Teams</h1>
          <p>Browse all 32 NFL teams and find tickets for upcoming games.</p>
        </div>
        {loading && <div className="search-mini">Loading team data</div>}
      </div>

      <div className="team-grid">
        {teams.map((team) => (
          <Link
            key={team.slug}
            href={`/teams/${team.slug}`}
            className="team-card"
            style={{ "--team": team.color } as React.CSSProperties}
          >
            <div className="team-mark">{team.abbr}</div>
            <div>
              <strong>{team.name}</strong>
              <span>{team.city}, {team.state}</span>
              <small><MapPin size={12} />{team.venue}</small>
            </div>
            <ArrowRight size={16} />
          </Link>
        ))}
      </div>
    </main>
  );
}
