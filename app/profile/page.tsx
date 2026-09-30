"use client";
import { useEffect, useState } from "react";
import { Check, MapPin, Save, UserRound } from "lucide-react";
import { DEFAULT_PREFERENCES, Preferences } from "../../lib/logic";
import { TEAMS } from "../../lib/data";

export default function ProfilePage() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFERENCES);
  const [location, setLocation] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("kz_profile") || "null");
      if (existing) { setPrefs({...DEFAULT_PREFERENCES, ...existing}); setLocation(existing.location || ""); }
    } catch {}
  }, []);

  function save() {
    localStorage.setItem("kz_profile", JSON.stringify({...prefs, location}));
    setSaved(true);
    setTimeout(()=>setSaved(false), 1800);
  }

  return (
    <div className="page narrow">
      <div className="page-head"><div><div className="eyebrow">Personal settings</div><h1>Your Profile</h1><p>Save your preferences so KickSeatz can personalize discovery and ticket results.</p></div><div className="profile-avatar"><UserRound/></div></div>
      <section className="card form-card">
        <div className="form-section"><h2>Game preferences</h2><div className="form-grid">
          <label>Favorite team<select value={prefs.favoriteTeam} onChange={e=>setPrefs({...prefs,favoriteTeam:e.target.value})}>{TEAMS.map(t=><option key={t.slug} value={t.slug}>{t.name}</option>)}</select></label>
          <label>Home / away<select value={(prefs as any).homeAway || "Either"} onChange={e=>setPrefs({...prefs, homeAway: e.target.value} as Preferences)}><option>Either</option><option>Home</option><option>Away</option></select></label>
          <label>Preferred seat area<select value={prefs.seatArea} onChange={e=>setPrefs({...prefs,seatArea:e.target.value as Preferences["seatArea"]})}><option>Any</option><option>Lower Bowl</option><option>Club</option><option>Upper Bowl</option></select></label>
          <label>Priority<select value={prefs.priority} onChange={e=>setPrefs({...prefs,priority:e.target.value as Preferences["priority"]})}><option>Best Overall Value</option><option>Lowest Price</option><option>Best Game</option></select></label>
        </div></div>
        <div className="form-section"><h2>Ticket budget</h2><div className="form-grid">
          <label>Typical budget <span className="range-value">${prefs.budget}</span><input type="range" min="35" max="350" step="5" value={prefs.budget} onChange={e=>setPrefs({...prefs,budget:Number(e.target.value)})}/></label>
          <label>Tickets needed<select value={prefs.ticketCount} onChange={e=>setPrefs({...prefs,ticketCount:Number(e.target.value)})}><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
        </div></div>
        <div className="form-section"><h2>Location & travel</h2><div className="form-grid">
          <label>City or ZIP <span className="range-value"><MapPin size={12}/></span><input className="text-input" value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. Atlanta, GA or 30303"/></label>
          <label>Travel preference<select value={prefs.radius} onChange={e=>setPrefs({...prefs,radius:Number(e.target.value)})}><option value={100}>Nearby games</option><option value={250}>Regional games</option><option value={500}>Broad travel range</option><option value={1000}>Anywhere in the U.S.</option></select></label>
        </div></div>
        <div className="save-row"><span>Stored locally in this demo browser.</span><button className="primary-button" onClick={save}>{saved ? <><Check size={16}/> Saved</> : <><Save size={16}/> Save preferences</>}</button></div>
      </section>
    </div>
  );
}
