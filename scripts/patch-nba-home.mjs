import fs from "node:fs";

const path = "app/page.tsx";
let source = fs.readFileSync(path, "utf8");

if (source.includes("const NBA_HOME_GAMES")) {
  console.log("NBA homepage already integrated");
  process.exit(0);
}

source = source.replace(
  'import { GAMES, TEAMS, teamName } from "../lib/data";',
  'import { GAMES, TEAMS, teamName } from "../lib/data";\nimport { NBA_GAMES, nbaTeam } from "../lib/nba-data";'
);

const helpers = `\nconst NBA_HOME_GAMES = NBA_GAMES.slice(0, 6);\n\nfunction nbaLogo(abbr: string) {\n  return nbaTeam(abbr)?.logo ?? "";\n}\n\nfunction NbaHomeCard({ game }: { game: (typeof NBA_GAMES)[number] }) {\n  const away = nbaTeam(game.away);\n  const home = nbaTeam(game.home);\n  return (\n    <Link href="/nba" className="kz-nba-home-card">\n      <div className="kz-nba-home-art">\n        <div className="kz-nba-home-court" />\n        <div className="kz-nba-home-team"><img src={nbaLogo(game.away)} alt="" /><span>{away?.abbr}</span></div>\n        <b>VS</b>\n        <div className="kz-nba-home-team"><img src={nbaLogo(game.home)} alt="" /><span>{home?.abbr}</span></div>\n      </div>\n      <div className="kz-nba-home-info">\n        <span>{game.date} · {game.time}</span>\n        <strong>{away?.name} @ {home?.name}</strong>\n        <small>{game.demand} demand · Explore NBA tickets</small>\n      </div>\n    </Link>\n  );\n}\n`;

source = source.replace("function GameRow", helpers + "\nfunction GameRow");

const heroOld = "Discover NFL and college football now, with more sports and live events coming to KickSeatz.";
source = source.replace(heroOld, "Discover NFL and NBA now, with more sports and live events coming to KickSeatz.");

const gamesWorthSeeing = `      {leadGame && <section className="kz-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">FEATURED</span><h2>Games worth seeing</h2></div><Link href="/find-tickets">See all games <ArrowRight size={15} /></Link></div><div className="kz-feature-grid"><Link href={`/find-tickets?game=${leadGame.id}`} className="kz-feature-main"><GameVisual game={leadGame} hero /><div className="kz-feature-copy"><span>{formatDate(leadGame.date)} · {leadGame.city}</span><h3>{teamName(leadGame.away)} @ {teamName(leadGame.home)}</h3><p>{leadGame.reason}</p><b>Find tickets <ArrowRight size={15} /></b></div></Link><div className="kz-feature-side">{featured.slice(1, 3).map((game) => <EventCard key={game.id} game={game} />)}</div></div></section>}`;

const nbaSection = `\n\n      <section className="kz-section kz-nba-home-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NBA · NOW LIVE ON KICKSEATZ</span><h2>Games worth seeing in basketball</h2></div><Link href="/nba">Explore NBA <ArrowRight size={15} /></Link></div><div className="kz-nba-home-grid">{NBA_HOME_GAMES.slice(0, 3).map((game) => <NbaHomeCard key={game.id} game={game} />)}</div></section>`;

if (!source.includes(nbaSection.trim())) {
  source = source.replace(gamesWorthSeeing, gamesWorthSeeing + nbaSection);
}

const moreNfl = `      <section className="kz-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">UPCOMING</span><h2>More NFL games</h2></div><Link href="/find-tickets">View all tickets <ArrowRight size={15} /></Link></div><div className="kz-game-list">{upcoming.map((game) => <GameRow key={game.id} game={game} />)}</div></section>\n`;
source = source.replace(moreNfl, "");

fs.writeFileSync(path, source);
console.log("NBA homepage integration applied");
