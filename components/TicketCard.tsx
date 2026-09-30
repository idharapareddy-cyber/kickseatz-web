"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, ChevronRight, Heart, ShieldCheck } from "lucide-react";
import { Ticket, teamName } from "../lib/data";
import { explainTicket, Preferences } from "../lib/logic";

export function TicketCard({ ticket, prefs }: { ticket: Ticket; prefs: Preferences }) {
  const reasons = explainTicket(ticket, prefs);
  const [watching, setWatching] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const watches: string[] = JSON.parse(localStorage.getItem("kz_watches") || "[]");
      const savedTickets: string[] = JSON.parse(localStorage.getItem("kz_saved_tickets") || "[]");
      setWatching(watches.includes(ticket.id));
      setSaved(savedTickets.includes(ticket.id));
    } catch {
      setWatching(false);
      setSaved(false);
    }
  }, [ticket.id]);

  function toggleWatch() {
    try {
      const current: string[] = JSON.parse(localStorage.getItem("kz_watches") || "[]");
      const next = watching ? current.filter(id => id !== ticket.id) : Array.from(new Set([...current, ticket.id]));
      localStorage.setItem("kz_watches", JSON.stringify(next));
      setWatching(!watching);
      window.dispatchEvent(new Event("kz:watches"));
    } catch {
      // demo storage unavailable
    }
  }

  function toggleSaved() {
    try {
      const current: string[] = JSON.parse(localStorage.getItem("kz_saved_tickets") || "[]");
      const next = saved ? current.filter(id => id !== ticket.id) : Array.from(new Set([...current, ticket.id]));
      localStorage.setItem("kz_saved_tickets", JSON.stringify(next));
      setSaved(!saved);
      window.dispatchEvent(new Event("kz:saved-tickets"));
    } catch {
      // demo storage unavailable
    }
  }

  return (
    <article className="card ticket-card">
      <div className="ticket-main">
        <div>
          <div className="eyebrow">{ticket.seatArea} · Sec {ticket.section} · Row {ticket.row}</div>
          <h3>{teamName(ticket.away)} <span>@</span> {teamName(ticket.home)}</h3>
          <div className="ticket-tags"><span>{ticket.quantity} tickets</span><span><ShieldCheck size={14}/> Demo verified</span></div>
        </div>
        <div className="price-block"><strong>${ticket.price}</strong><span>each</span></div>
      </div>
      <div className="ticket-score-row"><div className="score-ring"><strong>{ticket.score}</strong><span>KS</span></div><div><strong>KickSeatz Score</strong><p>{reasons[0]}</p></div></div>
      <details className="explain"><summary>Explain why <ChevronRight size={16}/></summary><div>{reasons.map((r,i)=><p key={i}>• {r}</p>)}</div></details>
      <div className="card-bottom ticket-actions">
        <span className="muted">{ticket.source}</span>
        <div>
          <button className="icon-button" title={saved ? "Remove saved ticket" : "Save ticket"} aria-label={saved ? "Remove saved ticket" : "Save ticket"} onClick={toggleSaved}><Heart size={17} fill={saved ? "currentColor" : "none"}/></button>
          <Link className="secondary-button" href={`/ticket/${ticket.id}`}>View ticket</Link>
          <button className={watching ? "secondary-button watching" : "primary-button"} onClick={toggleWatch}><Bell size={16}/> {watching ? "Watching" : "Price Watch"}</button>
        </div>
      </div>
    </article>
  );
}
