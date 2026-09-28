import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return <div className="page narrow"><section className="empty-state page-not-found"><Search size={26}/><div className="eyebrow">404</div><h1>That page isn’t here.</h1><p>Try heading back to KickSeatz and start with a game, team, or ticket search.</p><div className="not-found-actions"><Link href="/" className="primary-button"><ArrowLeft size={16}/> Back home</Link><Link href="/find-tickets" className="secondary-button">Find Tickets</Link></div></section></div>;
}
