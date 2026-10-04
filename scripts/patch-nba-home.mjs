import fs from "node:fs";

const path = "app/page.tsx";
let source = fs.readFileSync(path, "utf8");

const nbaWeek = `
      <section className="kz-section kz-nba-home-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NBA · THIS WEEK</span><h2>NBA matchups to watch</h2></div><Link href="/nba">See all NBA games <ArrowRight size={15} /></Link></div><div className="kz-nba-home-grid">{NBA_HOME_GAMES.slice(0, 3).map((game) => <NbaHomeCard key={game.id} game={game} />)}</div></section>`;

const nbaTrending = `
      <section className="kz-section kz-nba-trending-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NBA · TRENDING</span><h2>Games basketball fans are watching</h2></div><Link href="/nba">Browse NBA <ArrowRight size={15} /></Link></div><div className="kz-nba-home-grid">{NBA_HOME_GAMES.slice(3, 6).map((game) => <NbaHomeCard key={game.id} game={game} />)}</div></section>`;

// Remove the standalone NBA section: NBA should replace existing NFL real estate, not make the homepage longer.
source = source.replace(/\n      <section className="kz-section kz-nba-home-section">.*?<\/section>\n/s, "\n");

// Replace the large NFL game-type block with one compact NBA section.
const gameTypeStart = source.indexOf('      <section className="kz-section kz-game-type-section">');
if (gameTypeStart !== -1) {
  const gameTypeEnd = source.indexOf("</section>", gameTypeStart);
  if (gameTypeEnd === -1) throw new Error("NFL game-type section end not found");
  source = source.slice(0, gameTypeStart) + nbaWeek + source.slice(gameTypeEnd + "</section>".length);
}

// Replace the NFL trending block by locating its stable heading instead of relying on brittle full-line regex matching.
const trendingStart = source.indexOf('      <section className="kz-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">TRENDING NOW · NFL</span>');
if (trendingStart !== -1) {
  const trendingEnd = source.indexOf("</section>", trendingStart);
  if (trendingEnd === -1) throw new Error("NFL trending section end not found");
  source = source.slice(0, trendingStart) + nbaTrending + source.slice(trendingEnd + "</section>".length);
}

fs.writeFileSync(path, source);
console.log("NBA homepage rebalanced: two repetitive NFL sections replaced with compact NBA sections.");
