import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";

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