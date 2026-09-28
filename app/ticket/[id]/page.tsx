"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bell, Check, Heart, MapPin, Sparkles, Ticket as TicketIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { gameById, TICKETS, teamName } from "../../../lib/data";
import { DEFAULT_PREFERENCES, explainTicket } from "../../../lib/logic";

export default function TicketDetailPage() {
  const params = useParams<{id:string}>();
  const ticket = useMemo(()=>TICKETS.find(t=>t.id===params.id),[params.id]);
  const [watching,setWatching]=useState(false);
  const [saved,setSaved]=useState(false);
  useEffect(()=>{
    try { setWatching(JSON.parse(localStorage.getItem("kz_watches")||"[]").includes(ticket?.id)); setSaved(JSON.parse(localStorage.getItem("kz_saved_tickets")||"[]").includes(ticket?.id)); } catch {}
  },[ticket?.id]);
  if(!ticket) return <div className="page"><div className="empty-state"><TicketIcon size={30}/><h3>Ticket not found</h3><p>That demo listing doesn't exist.</p><Link href="/find-tickets" className="secondary-button" style={{marginTop:12}}>Back to tickets</Link></div></div>;
  const game=gameById(ticket.gameId);
  const reasons=explainTicket(ticket,DEFAULT_PREFERENCES);
  function toggle(key:string,setter:(v:boolean)=>void,state:boolean){ try {const cur:string[]=JSON.parse(localStorage.getItem(key)||"[]");const next=state?cur.filter(id=>id!==ticket.id):Array.from(new Set([...cur,ticket.id]));localStorage.setItem(key,JSON.stringify(next));setter(!state);window.dispatchEvent(new Event("kz:saved-tickets"));} catch {} }
  return <div className="page narrow"><Link href="/find-tickets" className="back-link"><ArrowLeft size={15}/> Back to tickets</Link><section className="card form-card" style={{marginTop:18}}><div className="page-head" style={{marginBottom:20}}><div><div className="eyebrow">Ticket details · Demo inventory</div><h1>{teamName(ticket.away)} @ {teamName(ticket.home)}</h1><p><MapPin size={14}/> {ticket.venue} · {game?.date} · {game?.time}</p></div><div className="score-chip"><Sparkles size={14}/>{ticket.score}/100 KickSeatz Score</div></div><div className="ticket-tags"><span>{ticket.seatArea}</span><span>Section {ticket.section}</span><span>Row {ticket.row}</span><span>{ticket.quantity} tickets available</span></div><div className="signal-list" style={{marginTop:24}}><div><span>Price</span><strong>${ticket.price} each</strong></div><div><span>Value</span><strong>{ticket.valueNote}</strong></div><div><span>Source</span><strong>{ticket.source}</strong></div></div><div className="rate-placeholder"><strong>Why this ticket?</strong>{reasons.map((r,i)=><p key={i}>• {r}</p>)}</div><div style={{display:"flex",gap:9,flexWrap:"wrap",marginTop:18}}><button className="primary-button" onClick={()=>toggle("kz_watches",setWatching,watching)}><Bell size={16}/>{watching?"Watching":"Price Watch"}</button><button className="secondary-button" onClick={()=>toggle("kz_saved_tickets",setSaved,saved)}><Heart size={16} fill={saved?"currentColor":"none"}/>{saved?"Saved":"Save Ticket"}</button><button className="secondary-button" onClick={()=>navigator.clipboard?.writeText(window.location.href)}><Check size={16}/> Copy link</button></div></section></div>;
}
