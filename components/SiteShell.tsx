"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, Search, Ticket, UserRound, Users } from "lucide-react";

const nav = [
  { href: "/", label: "Home", icon: Compass },
  { href: "/find-tickets", label: "Find Tickets", icon: Ticket },
  { href: "/find-my-game", label: "Find My Game", icon: Search },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/my-tickets", label: "My Tickets", icon: Heart },
];

export function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand" aria-label="KickSeatz home">
            <span className="brand-logo" aria-label="KickSeatz">
              <Image
                src="/kickseatz-logo.png"
                alt="KickSeatz"
                width={225}
                height={65}
                priority
              />
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link ${active ? "active" : ""}`}
                >
                  <Icon size={16} strokeWidth={2} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/profile"
            className={`profile-pill ${
              pathname.startsWith("/profile") ? "active" : ""
            }`}
            aria-current={
              pathname.startsWith("/profile") ? "page" : undefined
            }
          >
            <UserRound size={16} strokeWidth={2} />
            <span>Profile</span>
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {[
          ...nav,
          { href: "/profile", label: "Profile", icon: UserRound },
        ].map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={active ? "active" : ""}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <footer className="footer">
        <div className="footer-brand">
          <span>KickSeatz</span>
          <small>Demo marketplace · synthetic inventory</small>
        </div>

        <div className="footer-links">
          <Link href="/teams">All teams</Link>
          <Link href="/find-tickets">Find Tickets</Link>
          <Link href="/find-my-game">Find My Game</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <span>Smarter discovery. Better ticket decisions.</span>
      </footer>
    </div>
  );
}
