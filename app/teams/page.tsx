"use client";

import { useEffect, useState } from "react";

type Team = {
  slug: string;
  name: string;
  city: string;
  abbr: string;
  division: string;
  venue: string;
  state: string;
  color: string;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/teams")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load teams");
        }

        return response.json();
      })
      .then((data) => {
        setTeams(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not connect to the KickSeatz backend.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0A12] px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-white/60">Loading NFL teams...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0B0A12] px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-red-400">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0A12] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#8B6CFF]">
            KickSeatz
          </p>

          <h1 className="text-4xl font-bold">NFL Teams</h1>

          <p className="mt-3 text-white/60">
            Browse all 32 NFL teams and find tickets for upcoming games.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.map((team) => (
            <div
              key={team.slug}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="mb-5 flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl font-bold"
                  style={{
                    backgroundColor: `${team.color}22`,
                    color: team.color,
                  }}
                >
                  {team.abbr}
                </div>

                <div>
                  <h2 className="font-semibold">{team.name}</h2>
                  <p className="text-sm text-white/50">
                    {team.city}, {team.state}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-white/60">
                  <span className="text-white/40">Division:</span>{" "}
                  {team.division}
                </p>

                <p className="text-white/60">
                  <span className="text-white/40">Stadium:</span>{" "}
                  {team.venue}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}