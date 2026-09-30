import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Game, teamName } from "../lib/data";

/*
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

export function GameCard({
  game,
  badge,
  score,
}: {
  game: Game;
  badge?: string;
  score?: number;
}) {
  return (
    <article className="card game-card">
      <div className="card-topline">
        <span>{badge ?? game.demand}</span>
        <span>{game.date}</span>
      </div>

      <div className="matchup-row">
        <div>
          <small>Away</small>
          <strong>{teamName(game.away)}</strong>
        </div>

        <div className="vs">@</div>

        <div className="home-team">
          <small>Home</small>
          <strong>{teamName(game.home)}</strong>
        </div>
      </div>

      <div className="game-meta">
        <span>
          <MapPin size={15} />
          {game.city}
        </span>

        <span>{game.time}</span>
      </div>

      <div className="card-bottom">
        <span className="muted">{game.reason}</span>

        {score !== undefined && (
          <span className="score-chip">
            <Sparkles size={14} />
            {score}/100 match
          </span>
        )}

        <Link
          href={`/find-tickets?game=${game.id}`}
          className="text-button"
        >
          Tickets
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}