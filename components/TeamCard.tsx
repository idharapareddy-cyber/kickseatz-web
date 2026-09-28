import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Team } from "../lib/data";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link className="team-card" href={`/teams/${team.slug}`} style={{"--team": team.color} as CSSProperties}>
      <div className="team-mark">{team.abbr}</div>
      <div><strong>{team.name}</strong><span>{team.division}</span><small><MapPin size={12}/>{team.venue}</small></div>
      <ArrowRight size={16}/>
    </Link>
  );
}
