"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, ChevronRight, Heart, ShieldCheck } from "lucide-react";
import { Ticket, TEAMS, teamName } from "../lib/data";
import { explainTicket, Preferences } from "../lib/logic";

const logoIds: Record<string, number> = { ARI:22, ATL:1, BAL:33, BUF:2, CAR:29, CHI:3, CIN:4, CLE:5, DAL:6, DEN:7, DET:8, GB:9, HOU:34, IND:11, JAX:30, KC:12, LV:13, LAC:24, LAR:14, MIA:15, MIN:16, NE:17, NO:18, NYG:19, NYJ:20, PHI:21, PIT:23, SF:25, SEA:26, TB:27, TEN:10, WAS:28 };
function logoUrl(slug: string) {
  const abbr = TEAMS.find((t) => t.slug === slug)?.abbr;
  return abbr && logoIds[abbr] ? `https://a.espncdn.com/i/teamlogos/nfl/500/${logoIds[abbr]}.png` : "";
}

export function TicketCard({ ticket, prefs }: { ticket: Ticket; prefs: Preferences }) {
  const reasons = explainTicket(ticket, prefs);
  const away = TEAMS.find((t) => t.slug === ticket.away);
  const home = TEAMS.find((t) => t.slug === ticket.home);
  const [watching, setWatching] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const watches: string[] = JSON.parse(localStorage.getItem("kz_watches") || "[]");
      const savedTickets: string[] = JSON.parse(localStorage.getItem("kz_saved_tickets") || "[]");
      setWatching(watches.includes(ticket.id)); setSaved(savedTickets.includes(ticket.id));
    } catch { setWatching(false); setSaved(false); }
  }, [ticket.id]);

  function toggleWatch() {
    try {
      const current: string[] = JSON.parse(localStorage.getItem("kz_watches") || "[]");
      const next = watching ? current.filter(id => id !== ticket.id) : Array.from(new Set([...current, ticket.id]));
      localStorage.setItem("kz_watches", JSON.stringify(next)); setWatching(!watching); window.dispatchEvent(new Event("kz:watches"));
    } catch {}
  }
  function toggleSaved() {
    try {
      const current: string[] = JSON.parse(localStorage.getItem("kz_saved_tickets") || "[]");
      const next = saved ? current.filter(id => id !== ticket.id) : Array.from(new Set([...current, ticket.id]));
      localStorage.setItem("kz_saved_tickets", JSON.stringify(next)); setSaved(!saved); window.dispatchEvent(new Event("kz:saved-tickets"));
    } catch {}
  }

  return (
    <article className="card ticket-card">
      <div className="ticket-matchup-art" style={{ "--away-color": away?.color ?? "#111827", "--home-color": home?.color ?? "#6D28D9" } as React.CSSProperties} aria-hidden="true">
        <div className="ticket-art-glow ticket-art-glow-away" />
        <div className="ticket-art-glow ticket-art-glow-home" />
        <div className="ticket-art-team"><img src={logoUrl(ticket.away)} alt="" /><span>{away?.abbr ?? "AWAY"}</span></div>
        <div className="ticket-art-vs">VS</div>
        <div className="ticket-art-team"><img src={logoUrl(ticket.home)} alt="" /><span>{home?.abbr ?? "HOME"}</span></div>
      </div>
      <div className="ticket-main">
        <div className="ticket-main-copy">
          <div className="eyebrow">{ticket.seatArea} · Sec {ticket.section} · Row {ticket.row}</div>
          <h3>{teamName(ticket.away)} <span>@</span> {teamName(ticket.home)}</h3>
          <div className="ticket-tags"><span>{ticket.quantity} tickets</span><span><ShieldCheck size={14}/> Demo listing</span></div>
        </div>
        <div className="price-block"><strong>${ticket.price}</strong><span>each</span></div>
      </div>
      <div className="ticket-score-row"><div className="score-ring"><strong>{ticket.score}</strong><span>KS</span></div><div className="ticket-score-copy"><strong>KickSeatz Score</strong><p>{reasons[0]}</p></div></div>
      <details className="explain"><summary>Explain why <ChevronRight size={16}/></summary><div>{reasons.map((r,i)=><p key={i}>• {r}</p>)}</div></details>
      <div className="card-bottom ticket-actions"><span className="muted">{ticket.source}</span><div className="ticket-action-group">
        <button className="icon-button" title={saved ? "Remove saved ticket" : "Save ticket"} aria-label={saved ? "Remove saved ticket" : "Save ticket"} aria-pressed={saved} onClick={toggleSaved}><Heart size={17} fill={saved ? "currentColor" : "none"}/></button>
        <Link className="secondary-button" href={`/ticket/${ticket.id}`}>View ticket</Link>
        <button className={watching ? "secondary-button watching" : "primary-button"} aria-pressed={watching} onClick={toggleWatch}><Bell size={16}/> {watching ? "Watching" : "Price Watch"}</button>
      </div></div>
    </article>
  );
}
