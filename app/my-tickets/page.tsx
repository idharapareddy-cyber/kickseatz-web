"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bell, Heart, Star, Ticket as TicketIcon, Trash2 } from "lucide-react";
import { TICKETS, teamName } from "../../lib/data";

export default function MyTicketsPage() {
  const [watchIds, setWatchIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const refresh = () => {
    try { setWatchIds(JSON.parse(localStorage.getItem("kz_watches") || "[]")); setSavedIds(JSON.parse(localStorage.getItem("kz_saved_tickets") || "[]")); } catch {}
  };
  useEffect(() => { refresh(); window.addEventListener("storage", refresh); window.addEventListener("kz:saved-tickets", refresh); window.addEventListener("kz:watches", refresh); return () => {window.removeEventListener("storage", refresh);window.removeEventListener("kz:saved-tickets", refresh);window.removeEventListener("kz:watches", refresh);} }, []);
  const watches = useMemo(()=>TICKETS.filter(t=>watchIds.includes(t.id)),[watchIds]);
  const saved = useMemo(()=>TICKETS.filter(t=>savedIds.includes(t.id)),[savedIds]);
  function removeWatch(id:string){ const next=watchIds.filter(x=>x!==id); localStorage.setItem("kz_watches",JSON.stringify(next)); setWatchIds(next); }
  function removeSaved(id:string){ const next=savedIds.filter(x=>x!==id); localStorage.setItem("kz_saved_tickets",JSON.stringify(next)); setSavedIds(next); }
  return (
    <div className="page">
      <div className="page-head"><div><div className="eyebrow">Your activity</div><h1>My Tickets</h1><p>Keep saved listings, Price Watches, and ticket ideas in one place.</p></div></div>
      <div className="dashboard-grid">
        <section className="card large-card"><div className="section-heading compact"><div><div className="eyebrow">Price Watch</div><h2>Watched tickets</h2></div><div className="account-stat"><Bell size={14}/><strong>{watches.length}</strong></div></div>{watches.length ? <div className="watch-list">{watches.map(t=><div className="watch-row" key={t.id}><Bell size={15}/><div><strong>{teamName(t.away)} @ {teamName(t.home)}</strong><span>Sec {t.section} · ${t.price} each</span></div><span className="watch-status">Watching</span><button className="icon-button" aria-label="Remove price watch" onClick={()=>removeWatch(t.id)}><Trash2 size={15}/></button></div>)}</div> : <div className="empty-state small"><Bell size={24}/><h3>No Price Watches yet</h3><p>Save a listing from Find Tickets to watch it here.</p><Link href="/find-tickets" className="secondary-button" style={{marginTop:12}}>Find tickets</Link></div>}</section>
        <section className="card large-card"><div className="section-heading compact"><div><div className="eyebrow">Saved listings</div><h2>Tickets you kept</h2></div><div className="account-stat"><Heart size={14}/><strong>{saved.length}</strong></div></div>{saved.length ? <div className="watch-list">{saved.map(t=><div className="watch-row" key={t.id}><Heart size={15}/><div><strong>{teamName(t.away)} @ {teamName(t.home)}</strong><span>Sec {t.section} · {t.seatArea} · ${t.price}</span></div><Link href={`/ticket/${t.id}`} className="secondary-button">Open</Link><button className="icon-button" aria-label="Remove saved ticket" onClick={()=>removeSaved(t.id)}><Trash2 size={15}/></button></div>)}</div> : <div className="empty-state small"><Heart size={24}/><h3>No saved tickets yet</h3><p>Tap the heart on any listing to keep it here.</p></div>}</section>
      </div>
      <section className="card large-card" style={{marginTop:18}}><div className="section-heading compact"><div><div className="eyebrow">Rate My Ticket</div><h2>Already bought?</h2><p>Keep your demo-ticket feedback here for the future website.</p></div><Star size={28} color="#9b82ff"/></div><div className="rate-placeholder"><strong>Rate a ticket and keep your feedback locally.</strong><p>Choose a demo ticket, add a rating, and save your notes in this browser.</p><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Link href="/find-tickets" className="secondary-button"><TicketIcon size={15}/> Browse demo tickets</Link><Link href="/rate-ticket" className="primary-button"><Star size={15}/> Rate My Ticket</Link></div></div></section>
    </div>
  );
}
