import fs from "node:fs";

const path = "app/page.tsx";
let source = fs.readFileSync(path, "utf8");

const nbaWeek = `
      <section className="kz-section kz-nba-home-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NBA · THIS WEEK</span><h2>NBA matchups to watch</h2></div><Link href="/nba">See all NBA games <ArrowRight size={15} /></Link></div><div className="kz-nba-home-grid">{NBA_HOME_GAMES.slice(0, 3).map((game) => <NbaHomeCard key={game.id} game={game} />)}</div></section>`;

const nbaTrending = `
      <section className="kz-section kz-nba-trending-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NBA · TRENDING</span><h2>Games basketball fans are watching</h2></div><Link href="/nba">Browse NBA <ArrowRight size={15} /></Link></div><div className="kz-nba-home-grid">{NBA_HOME_GAMES.slice(3, 6).map((game) => <NbaHomeCard key={game.id} game={game} />)}</div></section>`;

function removeSectionByClass(className) {
  const start = source.indexOf(`      <section className="kz-section ${className}`);
  if (start === -1) return;
  const end = source.indexOf("</section>", start);
  if (end === -1) throw new Error(`${className} section end not found`);
  source = source.slice(0, start) + source.slice(end + "</section>".length);
}

// Remove any previous NBA inserts so this repair is idempotent.
removeSectionByClass("kz-nba-home-section");
removeSectionByClass("kz-nba-trending-section");

// The previous pass made the hero a CSS-only ticket. Replace it with a simple, real marketplace visual in JSX.
const heroStart = source.indexOf('      <section className="kz-hero">');
if (heroStart === -1) throw new Error("Hero section not found");
const heroEnd = source.indexOf("</section>", heroStart);
if (heroEnd === -1) throw new Error("Hero section end not found");
const neutralHero = `      <section className="kz-hero">
        <div className="kz-hero-image">
          <div className="kz-marketplace-hero-art">
            <div className="kz-marketplace-ticket-panel"><span className="kz-eyebrow">KICKSEATZ · LIVE SPORTS & EVENTS</span><strong>One place for every seat.</strong><span>Discover games, concerts, and live events across the sports you follow.</span></div>
            <div className="kz-marketplace-ticket-stack"><div className="kz-marketplace-ticket"><small>KickSeatz ticket</small><strong>Live sports & events</strong><span>Compare seats · Find your event · Explore tickets</span></div><div className="kz-marketplace-ticket"><small>Now discovering</small><strong>NBA · NFL · More</strong><span>One marketplace, more ways to go.</span></div></div>
          </div>
        </div>
        <div className="kz-hero-info"><div><span className="kz-eyebrow">TICKETS, WITHOUT THE GUESSWORK</span><h1>Find your seat <em>for the moment.</em></h1><p>Discover sports and live events, compare options, and find the experience that fits you.</p></div><Link href="/find-tickets" className="kz-primary-button">Explore Sports & Tickets <ArrowRight size={17} /></Link></div>
        <div className="kz-hero-search"><div><span className="kz-eyebrow">SEARCH KICKSEATZ</span><strong>What are you looking for?</strong></div><form action="/find-tickets" method="get" className="kz-search-box"><Search size={19} /><input name="search" type="search" placeholder="Team, sport, event, city, or stadium" aria-label="Search teams, games, cities, or stadiums" /><button type="submit">Search</button></form><div className="kz-search-links"><Link href="/find-tickets">All games</Link><Link href="/teams">All teams</Link><Link href="/find-my-game">Find My Game</Link></div></div>
      </section>`;
source = source.slice(0, heroStart) + neutralHero + source.slice(heroEnd + "</section>".length);

// Replace repetitive NFL team browsing real estate with NBA discovery instead of extending the page.
removeSectionByClass("kz-team-strip-section");
removeSectionByClass("kz-division-grid");

const collegeMarker = '      <section className="kz-section kz-college-section">';
const collegeStart = source.indexOf(collegeMarker);
if (collegeStart === -1) throw new Error("College section marker not found");
source = source.slice(0, collegeStart) + nbaWeek + "\n\n" + nbaTrending + "\n\n" + source.slice(collegeStart);

fs.writeFileSync(path, source);
console.log("Rebalanced homepage: neutral marketplace hero, two compact NBA sections, and removed repetitive NFL team/division blocks.");
