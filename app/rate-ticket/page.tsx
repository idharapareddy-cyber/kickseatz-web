"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, Star, Ticket as TicketIcon } from "lucide-react";
import { TICKETS, teamName } from "../../lib/data";

export default function RateTicketPage() {
  const [ticketId,setTicketId]=useState(TICKETS[0]?.id || "");
  const [rating,setRating]=useState(5);
  const [comment,setComment]=useState("");
  const [saved,setSaved]=useState(false);
  const ticket=TICKETS.find(t=>t.id===ticketId);
  function submit(){
    if (!ticketId || !ticket || !Number.isInteger(rating) || rating < 1 || rating > 5) return;
    try {
      const current = JSON.parse(
        localStorage.getItem("kz_ratings") || "[]"
      );
      const next = [
        ...current.filter((entry: { ticketId?: string }) => entry.ticketId !== ticketId),
        { ticketId, rating, comment: comment.trim(), createdAt: new Date().toISOString() },
      ];
      localStorage.setItem("kz_ratings", JSON.stringify(next));
      setSaved(true); setTimeout(()=>setSaved(false),1800);
    } catch {}
  }
  return <div className="page narrow"><div className="page-head"><div><div className="eyebrow">Customer feedback</div><h1>Rate My Ticket</h1><p>Rate a demo listing and keep your feedback locally.</p></div><div className="profile-avatar"><Star/></div></div><section className="card form-card"><div className="form-section"><h2>Select a ticket</h2><label>Ticket<select value={ticketId} onChange={e=>setTicketId(e.target.value)}>{TICKETS.slice(0,80).map(t=><option key={t.id} value={t.id}>{teamName(t.away)} @ {teamName(t.home)} · Sec {t.section} · ${t.price}</option>)}</select></label>{ticket&&<div className="quiz-summary" style={{marginTop:16}}><TicketIcon size={15}/><div><strong>{teamName(ticket.away)} @ {teamName(ticket.home)}</strong><p>{ticket.seatArea} · Sec {ticket.section} · Row {ticket.row} · ${ticket.price}</p></div></div>}</div><div className="form-section"><h2>Your rating</h2><label>Rating<select value={rating} onChange={e=>setRating(Number(e.target.value))}><option value={5}>5 — Excellent</option><option value={4}>4 — Good</option><option value={3}>3 — Okay</option><option value={2}>2 — Disappointing</option><option value={1}>1 — Poor</option></select></label><label>Notes<textarea className="text-area" value={comment} onChange={e=>setComment(e.target.value)} placeholder="What did you think about the price, seats, and game-day experience?" rows={5}/></label></div><div className="save-row"><span>Stored locally in this demo browser.</span><button className="primary-button" onClick={submit}>{saved?<><Check size={16}/> Saved</>:<><Star size={16}/> Save rating</>}</button></div></section><div style={{marginTop:14}}><Link href="/my-tickets" className="secondary-button">Back to My Tickets</Link></div></div>;
}
