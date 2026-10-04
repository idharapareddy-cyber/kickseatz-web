import fs from "node:fs";

const path = "app/page.tsx";
let source = fs.readFileSync(path, "utf8");

const nbaWeek = `
      <section className="kz-section kz-nba-home-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NBA · THIS WEEK</span><h2>NBA matchups to watch</h2></div><Link href="/nba">See all NBA games <ArrowRight size={15} /></Link></div><div className="kz-nba-home-grid">{NBA_HOME_GAMES.slice(0, 3).map((game) => <NbaHomeCard key={game.id} game={game} />)}</div></section>`;

const nbaTrending = `
      <section className="kz-section kz-nba-trending-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NBA · TRENDING</span><h2>Games basketball fans are watching</h2></div><Link href="/nba">Browse NBA <ArrowRight size={15} /></Link></div><div className="kz-nba-home-grid">{NBA_HOME_GAMES.slice(3, 6).map((game) => <NbaHomeCard key={game.id} game={game} />)}</div></section>`;

const nbaSpotlight = `
      <section className="kz-section kz-nba-spotlight-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NBA · SPOTLIGHT</span><h2>Matchups with the most energy</h2></div><Link href="/nba">Explore NBA <ArrowRight size={15} /></Link></div><div className="kz-nba-home-grid">{NBA_HOME_GAMES.slice(0, 3).map((game) => <NbaHomeCard key={game.id} game={game} />)}</div></section>`;

function removeSectionByClass(className) {
  let start;
  while ((start = source.indexOf(`      <section className="kz-section ${className}`)) !== -1) {
    const end = source.indexOf("</section>", start);
    if (end === -1) throw new Error(`${className} section end not found`);
    source = source.slice(0, start) + source.slice(end + "</section>".length);
  }
}

removeSectionByClass("kz-nba-home-section");
removeSectionByClass("kz-nba-trending-section");
removeSectionByClass("kz-nba-spotlight-section");

const nbaImageBlock = `\nconst nbaVenueImages: Record<string, string> = {\n  DEN: "https://commons.wikimedia.org/wiki/Special:FilePath/Ball_Arena%20Denver.jpg?width=1400",\n  LAC: "https://commons.wikimedia.org/wiki/Special:FilePath/Intuit_Dome.jpg?width=1400",\n  ATL: "https://commons.wikimedia.org/wiki/Special:FilePath/State_Farm_Arena_Atlanta.jpg?width=1400",\n  PHI: "https://commons.wikimedia.org/wiki/Special:FilePath/Wells_Fargo_Center.jpg?width=1400",\n  SAC: "https://commons.wikimedia.org/wiki/Special:FilePath/Golden_1_Center.jpg?width=1400",\n  GSW: "https://commons.wikimedia.org/wiki/Special:FilePath/Chase_Center.jpg?width=1400",\n  CHI: "https://commons.wikimedia.org/wiki/Special:FilePath/United_Center_Chicago.jpg?width=1400",\n  CLE: "https://commons.wikimedia.org/wiki/Special:FilePath/Rocket_Mortgage_FieldHouse.jpg?width=1400",\n  DAL: "https://commons.wikimedia.org/wiki/Special:FilePath/American_Airlines_Center.jpg?width=1400",\n  NY: "https://commons.wikimedia.org/wiki/Special:FilePath/Madison_Square_Garden_2015.jpg?width=1400",\n};\n`;
if (!source.includes("const nbaVenueImages")) {
  const marker = "function nbaLogo(abbr: string) {";
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) throw new Error("NBA logo helper not found");
  source = source.slice(0, markerIndex) + nbaImageBlock + "\n" + source.slice(markerIndex);
}

const oldNbaCardStart = source.indexOf("function NbaHomeCard({ game }");
if (oldNbaCardStart === -1) throw new Error("NBA home card not found");
const oldNbaCardEnd = source.indexOf("\n}\n\nfunction GameRow", oldNbaCardStart);
if (oldNbaCardEnd === -1) throw new Error("NBA home card end not found");
const nbaCard = `function NbaHomeCard({ game }: { game: (typeof NBA_GAMES)[number] }) {\n  const away = nbaTeam(game.away);\n  const home = nbaTeam(game.home);\n  const image = nbaVenueImages[game.home];\n  return (\n    <Link href="/nba" className="kz-nba-home-card">\n      <div className="kz-nba-home-art">\n        {image && <img src={image} alt={home ? `${home.name} arena` : "NBA arena"} />}\n        <div className="kz-nba-home-shade" />\n        <div className="kz-nba-home-team"><img src={nbaLogo(game.away)} alt="" /><span>{away?.abbr}</span></div>\n        <b>VS</b>\n        <div className="kz-nba-home-team"><img src={nbaLogo(game.home)} alt="" /><span>{home?.abbr}</span></div>\n      </div>\n      <div className="kz-nba-home-info">\n        <span>{game.date} · {game.time}</span>\n        <strong>{away?.name} @ {home?.name}</strong>\n        <small>{game.demand} demand · Explore NBA tickets</small>\n      </div>\n    </Link>\n  );\n}`;
source = source.slice(0, oldNbaCardStart) + nbaCard + source.slice(oldNbaCardEnd + 2);

source = source.replace(/NBA\s*·\s*COMING SOON/gi, "NBA");
source = source.replace(/NBA\s+coming\s+soon/gi, "NBA");
source = source.replace(/NBA\s+arrives\s+soon/gi, "NBA");

// NBA is now live, so remove the old basketball/"coming beyond football" card rather than presenting NBA as future content.
source = source.replace(/\{ name: "Basketball", kicker: "NBA", image: "[^"]+" \},\n\s*/, "");
source = source.replace(/<h2>Coming beyond football<\/h2>/, "<h2>More sports to explore</h2>");

const collegeMarker = '      <section className="kz-section kz-college-section">';
const collegeStart = source.indexOf(collegeMarker);
if (collegeStart === -1) throw new Error("College section marker not found");
source = source.slice(0, collegeStart) + nbaWeek + "\n\n" + nbaTrending + "\n\n" + nbaSpotlight + "\n\n" + source.slice(collegeStart);

fs.writeFileSync(path, source);
console.log("Balanced homepage with three equal NBA sections, real NBA arena photography, and no NBA coming-soon card.");
