import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Flame,
  MapPin,
  Navigation,
  Search,
  Ticket,
  Trophy,
  Music2,
  Users,
  Sparkles,
} from "lucide-react";
import { GAMES, TEAMS, teamName } from "../lib/data";
import { NBA_GAMES, nbaTeam } from "../lib/nba-data";

const collegeFootball = [
  { name: "Georgia Bulldogs", short: "UGA", image: "https://a.espncdn.com/i/teamlogos/ncaa/500/61.png" },
  { name: "Alabama Crimson Tide", short: "BAMA", image: "https://a.espncdn.com/i/teamlogos/ncaa/500/333.png" },
  { name: "Ohio State Buckeyes", short: "OSU", image: "https://a.espncdn.com/i/teamlogos/ncaa/500/194.png" },
  { name: "Texas Longhorns", short: "TEXAS", image: "https://a.espncdn.com/i/teamlogos/ncaa/500/251.png" },
];

const sportCategories = [
  { name: "Basketball", kicker: "NBA", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=85" },
  { name: "Baseball", kicker: "MLB", image: "https://www.nikkansports.com/baseball/mlb/news/img/202401040000891-w1300_1.jpg" },
  { name: "Hockey", kicker: "NHL", image: "https://oeg.ca/assets/uploads/img/_800x450_crop_center-center_none/Hockey_RogersPlace_1600px.jpg" },
  { name: "Soccer", kicker: "MLS", image: "https://cdn.mos.cms.futurecdn.net/xjhbJv3TtXPSRw2mgjXukN-650-80.jpg" },
];

const logoIds: Record<string, number> = {
  ARI:22, ATL:1, BAL:33, BUF:2, CAR:29, CHI:3, CIN:4, CLE:5, DAL:6, DEN:7,
  DET:8, GB:9, HOU:34, IND:11, JAX:30, KC:12, LV:13, LAC:24, LAR:14,
  MIA:15, MIN:16, NE:17, NO:18, NYG:19, NYJ:20, PHI:21, PIT:23, SF:25,
  SEA:26, TB:27, TEN:10, WAS:28,
};

function logoUrl(slug: string) {
  const abbr = TEAMS.find((t) => t.slug === slug)?.abbr;
  const id = abbr ? logoIds[abbr] : undefined;
  return id ? `https://a.espncdn.com/i/teamlogos/nfl/500/${id}.png` : "";
}

function isUpcomingGame(game: (typeof GAMES)[number]) {
  const today = new Date();
  const gameDate = new Date(game.date + "T23:59:59");
  return gameDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

const UPCOMING_GAMES = GAMES.filter(isUpcomingGame);
const NBA_HOME_GAMES = NBA_GAMES.slice(0, 6);

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

const rivalryKeys = new Set([
  "kansas-city-chiefs-buffalo-bills",
  "dallas-cowboys-philadelphia-eagles",
  "san-francisco-49ers-seattle-seahawks",
  "green-bay-packers-chicago-bears",
  "baltimore-ravens-pittsburgh-steelers",
  "atlanta-falcons-new-orleans-saints",
]);

const stadiumImages: Record<string, string> = {
  "kansas-city-chiefs": "https://upload.wikimedia.org/wikipedia/commons/e/e2/Arrowhead_Stadium.jpg",
  "dallas-cowboys": "https://images.unsplash.com/photo-1628630470727-b726b8a15a9d?auto=format&fit=crop&w=1600&q=85",
  "green-bay-packers": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Lambeau_Field.jpg",
  "san-francisco-49ers": "https://upload.wikimedia.org/wikipedia/commons/7/79/Levi%27s_Stadium.JPG",
  "atlanta-falcons": "https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_Stadium%2C_Atlanta%2C_GA_%2846558862285%29.jpg?width=1600",
};

function gameFlags(game: (typeof GAMES)[number]) {
  const homeTeam = TEAMS.find((team) => team.slug === game.home);
  const awayTeam = TEAMS.find((team) => team.slug === game.away);
  const division = Boolean(homeTeam && awayTeam && homeTeam.division === awayTeam.division);
  const primetime = game.time.includes("8:20 PM") || game.time.includes("8:15 PM") || game.time.includes("8:00 PM");
  const rivalry = rivalryKeys.has(game.home + "-" + game.away) || rivalryKeys.has(game.away + "-" + game.home);
  const playoffWatch = game.date >= "2026-12-01";
  return { division, primetime, rivalry, playoffWatch };
}

function gameCategory(game: (typeof GAMES)[number]) {
  const flags = gameFlags(game);
  if (flags.primetime) return "PRIMETIME";
  if (flags.rivalry) return "RIVALRY";
  if (flags.division) return "DIVISION";
  if (flags.playoffWatch) return "PLAYOFF WATCH";
  return "GAME DAY";
}

function StadiumVisual({ game, hero = false }: { game: (typeof GAMES)[number]; hero?: boolean }) {
  const image = stadiumImages[game.home];
  if (!image) return <SimpleMatchupVisual game={game} hero={hero} />;
  return (
    <div className={"kz-stadium-visual" + (hero ? " kz-stadium-visual-hero" : "")}>
      <img src={image} alt={teamName(game.home) + " stadium"} />
      <div className="kz-stadium-shade" />
      <div className="kz-stadium-color" />
    </div>
  );
}

function GameVisual({ game, hero = false }: { game: (typeof GAMES)[number]; hero?: boolean }) {
  return <StadiumVisual game={game} hero={hero} />;
}

function SimpleMatchupVisual({ game, hero = false }: { game: (typeof GAMES)[number]; hero?: boolean }) {
  const away = TEAMS.find((team) => team.slug === game.away);
  const home = TEAMS.find((team) => team.slug === game.home);
  return (
    <div className={"kz-simple-matchup" + (hero ? " kz-simple-matchup-hero" : "")}>
      <div className="kz-simple-team"><img src={logoUrl(game.away)} alt="" /><span>{away?.abbr}</span></div>
      <div className="kz-simple-vs">VS</div>
      <div className="kz-simple-team"><img src={logoUrl(game.home)} alt="" /><span>{home?.abbr}</span></div>
    </div>
  );
}

function nbaLogo(abbr: string) {
  return nbaTeam(abbr)?.logo ?? "";
}

function NbaHomeCard({ game }: { game: (typeof NBA_GAMES)[number] }) {
  const away = nbaTeam(game.away);
  const home = nbaTeam(game.home);
  return (
    <Link href="/nba" className="kz-nba-home-card">
      <div className="kz-nba-home-art">
        <div className="kz-nba-home-court" />
        <div className="kz-nba-home-team"><img src={nbaLogo(game.away)} alt="" /><span>{away?.abbr}</span></div>
        <b>VS</b>
        <div className="kz-nba-home-team"><img src={nbaLogo(game.home)} alt="" /><span>{home?.abbr}</span></div>
      </div>
      <div className="kz-nba-home-info">
        <span>{game.date} · {game.time}</span>
        <strong>{away?.name} @ {home?.name}</strong>
        <small>{game.demand} demand · Explore NBA tickets</small>
      </div>
    </Link>
  );
}

function GameRow({ game }: { game: (typeof GAMES)[number] }) {
  return <Link href={`/find-tickets?game=${game.id}`} className="kz-game-row"><div className="kz-game-date"><strong>{new Date(`${game.date}T12:00:00`).toLocaleDateString("en-US", { month: "short" })}</strong><b>{new Date(`${game.date}T12:00:00`).getDate()}</b></div><div className="kz-game-matchup"><div><img src={logoUrl(game.away)} alt="" /><strong>{teamName(game.away)}</strong><span>@</span><strong>{teamName(game.home)}</strong><img src={logoUrl(game.home)} alt="" /></div><small><MapPin size={13} /> {game.venue} · {game.city} · {game.time}</small></div><span className="kz-demand">{game.demand}</span><span className="kz-ticket-link">Find Tickets <ArrowRight size={15} /></span></Link>;
}

function EventCard({ game }: { game: (typeof GAMES)[number] }) {
  return <Link href={`/find-tickets?game=${game.id}`} className="kz-event-card"><div className="kz-event-image"><GameVisual game={game} /><span className="kz-heart" aria-hidden="true">♡</span></div><div className="kz-event-info"><strong>{teamName(game.away)} @ {teamName(game.home)}</strong><span>{formatDate(game.date)} · {game.city}</span><small>{game.venue}</small></div></Link>;
}

export default function HomePage() {
  const featured = UPCOMING_GAMES.slice(0, 5);
  const trending = [...UPCOMING_GAMES].filter((game) => game.demand === "High" || game.demand === "Premium").slice(0, 6);
  const upcoming = UPCOMING_GAMES.slice(5, 12);
  const leadGame = featured[0];

  return <div className="page marketplace-home kz-home">
      <section className="kz-hero">
        <div className="kz-hero-image">
          <div className="kz-marketplace-hero-art">
            <div className="kz-marketplace-ticket-panel"><span className="kz-eyebrow">KICKSEATZ · LIVE SPORTS & EVENTS</span><strong>One place for every seat.</strong><span>Discover games, concerts, and live events across the sports you follow.</span></div>
            <div className="kz-marketplace-ticket-stack"><div className="kz-marketplace-ticket"><small>KickSeatz ticket</small><strong>Live sports & events</strong><span>Compare seats · Find your event · Explore tickets</span></div><div className="kz-marketplace-ticket"><small>Now discovering</small><strong>NBA · NFL · More</strong><span>One marketplace, more ways to go.</span></div></div>
          </div>
        </div>
        <div className="kz-hero-info"><div><span className="kz-eyebrow">TICKETS, WITHOUT THE GUESSWORK</span><h1>Find your seat <em>for the moment.</em></h1><p>Discover sports and live events, compare options, and find the experience that fits you.</p></div><Link href="/find-tickets" className="kz-primary-button">Explore Sports & Tickets <ArrowRight size={17} /></Link></div>
        <div className="kz-hero-search"><div><span className="kz-eyebrow">SEARCH KICKSEATZ</span><strong>What are you looking for?</strong></div><form action="/find-tickets" method="get" className="kz-search-box"><Search size={19} /><input name="search" type="search" placeholder="Team, sport, event, city, or stadium" aria-label="Search teams, games, cities, or stadiums" /><button type="submit">Search</button></form><div className="kz-search-links"><Link href="/find-tickets">All games</Link><Link href="/teams">All teams</Link><Link href="/find-my-game">Find My Game</Link></div></div>
      </section>

      <nav className="kz-category-rail" aria-label="Sports discovery"><Link className="active" href="/find-tickets">NFL</Link><Link href="/find-tickets?category=division">Division Rivalries</Link><Link href="/find-tickets?category=primetime">Primetime</Link><Link href="/find-tickets?category=playoff-watch">Playoff Watch</Link><Link href="/find-tickets?category=international">International Series</Link><Link href="/find-tickets?category=college-football">College Football</Link><Link className="kz-category-nba" href="/nba">NBA</Link><Link href="/find-tickets?category=baseball">Baseball</Link><Link href="/find-tickets?category=hockey">Hockey</Link><Link href="/find-tickets?category=soccer">Soccer</Link><Link href="/find-tickets?category=concerts">Concerts</Link></nav>

      {leadGame && <section className="kz-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NFL · FEATURED</span><h2>Games worth seeing</h2></div><Link href="/find-tickets">See all NFL games <ArrowRight size={15} /></Link></div><div className="kz-feature-grid"><Link href={`/find-tickets?game=${leadGame.id}`} className="kz-feature-main"><GameVisual game={leadGame} hero /><div className="kz-feature-copy"><span>{formatDate(leadGame.date)} · {leadGame.city}</span><h3>{teamName(leadGame.away)} @ {teamName(leadGame.home)}</h3><p>{leadGame.reason}</p><b>Find tickets <ArrowRight size={15} /></b></div></Link><div className="kz-feature-side">{featured.slice(1, 3).map((game) => <EventCard key={game.id} game={game} />)}</div></div></section>}


      <section className="kz-section kz-seasonal-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NFL · HOLIDAYS & MARQUEE</span><h2>Big NFL dates</h2></div><Link href="/find-tickets?category=seasonal">View all <ArrowRight size={15} /></Link></div><div className="kz-marquee-grid"><Link href="/find-tickets?category=thanksgiving" className="kz-marquee-card kz-marquee-holiday"><div className="kz-marquee-image"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Veterans_Day_ceremonies_at_NFL_game_in_Chicago_131110-G-PL299-128.jpg" alt="Chicago Bears and Detroit Lions NFL game" /></div><div className="kz-marquee-body"><div><small>THREE GAMES · NOV 26</small><strong>Thanksgiving Day</strong></div><div className="kz-marquee-games"><span>Bears @ Lions · 1:00 PM</span><span>Eagles @ Cowboys · 4:30 PM</span><span>Chiefs @ Bills · 8:20 PM</span></div></div></Link><Link href="/find-tickets?category=christmas" className="kz-marquee-card kz-marquee-holiday"><div className="kz-marquee-image"><img src="https://upload.wikimedia.org/wikipedia/commons/6/66/Packvbears.jpg" alt="Green Bay Packers and Chicago Bears NFL game" /></div><div className="kz-marquee-body"><div><small>THREE GAMES · DEC 25</small><strong>Christmas Day</strong></div><div className="kz-marquee-games"><span>Packers @ Bears · 1:00 PM</span><span>Bills @ Broncos · 4:30 PM</span><span>Rams @ Seahawks · 8:15 PM</span></div></div></Link><Link href="/find-tickets?category=super-bowl" className="kz-marquee-card kz-marquee-small"><div className="kz-marquee-image"><img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/SoFi_Stadium.jpg" alt="SoFi Stadium in Inglewood, California" /></div><div className="kz-marquee-small-body"><small>FEB 14, 2027 · INGLEWOOD</small><strong>Super Bowl LXI</strong><span>SoFi Stadium · Los Angeles</span></div></Link></div></section>

      <section className="kz-section kz-international-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NFL · INTERNATIONAL SERIES</span><h2>Games around the world</h2></div><Link href="/find-tickets?category=international">View all 9 games <ArrowRight size={15} /></Link></div><div className="kz-international-feature-grid kz-international-editorial-grid"><Link href="/find-tickets?category=international" className="kz-international-feature-card kz-international-lead"><img src="https://static.www.nfl.com/image/upload/f_auto/league/ixy8c3hynxmxz9vdrboj" alt="NFL 2026 Melbourne Game featuring the 49ers and Rams" /><div className="kz-international-photo-tag"><span>🇦🇺</span><b>MELBOURNE · NFL</b></div><div className="kz-international-card-copy"><strong>49ers vs Rams</strong><small>Sept 10 · Melbourne Cricket Ground</small></div></Link><Link href="/find-tickets?category=international" className="kz-international-feature-card"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c9/New_Maracana_Stadium.jpg" alt="Maracanã Stadium in Rio de Janeiro" /><div className="kz-international-photo-tag"><span>🇧🇷</span><b>RIO · NFL</b></div><div className="kz-international-card-copy"><strong>Ravens vs Cowboys</strong><small>Sept 27 · Maracanã Stadium</small></div></Link><Link href="/find-tickets?category=international" className="kz-international-feature-card"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Wembley_Stadium%2C_London%2C_UK.jpg" alt="Wembley Stadium in London" /><div className="kz-international-photo-tag"><span>🇬🇧</span><b>LONDON · NFL</b></div><div className="kz-international-card-copy"><strong>Texans vs Jaguars</strong><small>Oct 18 · Wembley Stadium</small></div></Link><Link href="/find-tickets?category=international" className="kz-international-feature-card"><img src="https://upload.wikimedia.org/wikipedia/commons/f/f4/Stade_de_France.jpg" alt="Stade de France in Paris" /><div className="kz-international-photo-tag"><span>🇫🇷</span><b>PARIS · NFL</b></div><div className="kz-international-card-copy"><strong>Steelers vs Saints</strong><small>Oct 25 · Stade de France</small></div></Link><Link href="/find-tickets?category=international" className="kz-international-feature-card"><img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Santiago_Bernabeu_Stadium.jpg" alt="Bernabéu Stadium in Madrid" /><div className="kz-international-photo-tag"><span>🇪🇸</span><b>MADRID · NFL</b></div><div className="kz-international-card-copy"><strong>Bengals vs Falcons</strong><small>Nov 8 · Bernabéu Stadium</small></div></Link><Link href="/find-tickets?category=international" className="kz-international-feature-card"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Allianz_Arena.jpg" alt="Allianz Arena in Munich" /><div className="kz-international-photo-tag"><span>🇩🇪</span><b>MUNICH · NFL</b></div><div className="kz-international-card-copy"><strong>Patriots vs Lions</strong><small>Nov 15 · FC Bayern Munich Arena</small></div></Link><Link href="/find-tickets?category=international" className="kz-international-feature-card"><img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Estadio_Azteca_2026_-_06.jpg" alt="Estadio Banorte in Mexico City after its 2026 renovation" /><div className="kz-international-photo-tag"><span>🇲🇽</span><b>MEXICO CITY · NFL</b></div><div className="kz-international-card-copy"><strong>Vikings vs 49ers</strong><small>Nov 22 · Estadio Banorte</small></div></Link><Link href="/find-tickets?category=international" className="kz-international-feature-card"><img src="https://stadiumdb.com/pictures/stadiums/eng/tottenham_hotspur_stadium/tottenham_hotspur_stadium05.jpg" alt="Tottenham Hotspur Stadium exterior in London" /><div className="kz-international-photo-tag"><span>🇬🇧</span><b>LONDON · NFL</b></div><div className="kz-international-card-copy"><strong>Colts vs Commanders</strong><small>Oct 4 · Tottenham Hotspur Stadium</small></div></Link><Link href="/find-tickets?category=international" className="kz-international-feature-card"><img src="https://static.independent.co.uk/2021/12/08/23/50bc4524002b921e7bbd1720f0743252Y29udGVudHNlYXJjaGFwaSwxNjM5MDkyOTkx-2.62046825.jpg" alt="Tottenham Hotspur Stadium interior in London" /><div className="kz-international-photo-tag"><span>🇬🇧</span><b>LONDON · NFL</b></div><div className="kz-international-card-copy"><strong>Eagles vs Jaguars</strong><small>Oct 11 · Tottenham Hotspur Stadium</small></div></Link></div></section>







      <section className="kz-section kz-nba-home-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NBA · THIS WEEK</span><h2>NBA matchups to watch</h2></div><Link href="/nba">See all NBA games <ArrowRight size={15} /></Link></div><div className="kz-nba-home-grid">{NBA_HOME_GAMES.slice(0, 3).map((game) => <NbaHomeCard key={game.id} game={game} />)}</div></section>


      <section className="kz-section kz-nba-trending-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NBA · TRENDING</span><h2>Games basketball fans are watching</h2></div><Link href="/nba">Browse NBA <ArrowRight size={15} /></Link></div><div className="kz-nba-home-grid">{NBA_HOME_GAMES.slice(3, 6).map((game) => <NbaHomeCard key={game.id} game={game} />)}</div></section>

      <section className="kz-section kz-college-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">NEXT UP</span><h2>College football</h2></div><Link href="/find-tickets?category=college-football">Explore college football <ArrowRight size={15} /></Link></div><div className="kz-college-grid">{collegeFootball.map((school)=><Link href="/find-tickets?category=college-football" className="kz-college-card" key={school.short}><img src={school.image} alt="" /><div className="kz-college-shade" /><div className="kz-college-copy"><span>COLLEGE FOOTBALL</span><strong>{school.name}</strong><small>Games, rivalries & game-day experiences</small></div></Link>)}</div></section>

      <section className="kz-section kz-sports-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">MORE SPORTS</span><h2>Coming beyond football</h2></div><span className="kz-section-note">One ticket destination, more live sports.</span></div><div className="kz-sports-grid">{sportCategories.map((sport)=><Link href={`/find-tickets?category=${sport.kicker.toLowerCase()}`} className="kz-sport-card" key={sport.kicker}><img src={sport.image} alt="" /><div className="kz-sport-shade" /><div><span>{sport.kicker}</span><strong>{sport.name}</strong><small>Explore tickets & events</small></div></Link>)}</div></section>

      <section className="kz-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">GAME DAY & BEYOND</span><h2>More than just the game</h2></div><Link href="/find-tickets">Explore events <ArrowRight size={15} /></Link></div><div className="kz-experience-grid"><Link href="/find-tickets" className="kz-experience-card kz-experience-concert"><div className="kz-experience-art"><img src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85" alt="" /><div className="kz-experience-shade" /><Music2 size={25} /></div><div className="kz-experience-copy"><span>LIVE MUSIC</span><strong>Concerts & game-day music</strong><small>Find live music experiences around major game weekends.</small></div></Link><Link href="/find-tickets" className="kz-experience-card"><div className="kz-experience-art"><img src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1400&q=90" alt="" /><div className="kz-experience-shade" /><Users size={25} /></div><div className="kz-experience-copy"><span>NFL EVENTS</span><strong>Fan festivals & football events</strong><small>Discover NFL-themed experiences beyond the stadium seats.</small></div></Link><Link href="/find-tickets" className="kz-experience-card"><div className="kz-experience-art"><img src="https://images.unsplash.com/photo-1668674768860-b6d34068042b?auto=format&fit=crop&w=1400&q=90" alt="" /><div className="kz-experience-shade" /><Sparkles size={25} /></div><div className="kz-experience-copy"><span>GAME WEEKEND</span><strong>Drafts, showcases & special events</strong><small>Keep an eye out for major football events and special weekends.</small></div></Link></div></section>



      <section className="kz-section"><div className="kz-section-heading"><div><span className="kz-eyebrow">EXPLORE BY DIVISION · NFL</span><h2>Find your part of the NFL</h2></div><Link href="/teams">Browse all teams <ArrowRight size={15} /></Link></div><div className="kz-division-grid">{["AFC East","AFC North","AFC South","AFC West","NFC East","NFC North","NFC South","NFC West"].map((division) => { const teams = TEAMS.filter((team) => team.division === division).slice(0, 4); return <Link href="/teams" className="kz-division-card" key={division}><div className="kz-division-top"><span>{division.startsWith("AFC") ? "AFC" : "NFC"}</span><ArrowRight size={16} /></div><strong>{division}</strong><div className="kz-division-logos">{teams.map((team) => <img key={team.slug} src={logoUrl(team.slug)} alt="" />)}</div><small>{teams.map((team) => team.abbr).join(" · ")}</small></Link>; })}</div></section>

      <section className="kz-section kz-discover"><div className="kz-section-heading"><div><span className="kz-eyebrow">DISCOVER MORE</span><h2>Explore KickSeatz</h2></div></div><div className="kz-discover-grid"><Link href="/find-tickets"><Flame /><strong>High-demand games</strong><span>See matchups with strong ticket interest.</span><ArrowRight /></Link><Link href="/find-tickets"><CalendarDays /><strong>This week</strong><span>Browse the next games on the schedule.</span><ArrowRight /></Link><Link href="/find-my-game"><Navigation /><strong>Find My Game</strong><span>Answer a few questions and discover a matchup.</span><ArrowRight /></Link><Link href="/teams"><Trophy /><strong>Browse teams</strong><span>Explore every NFL team and stadium.</span><ArrowRight /></Link></div></section>

      <section className="kz-info-strip"><div><span className="kz-eyebrow">KICKSEATZ</span><h2>Know what you’re buying.</h2></div><p>Compare price, seat location, availability, and game information in one place.</p><Link href="/find-tickets" className="kz-primary-button">Find tickets <Ticket size={16} /></Link></section>

      <p className="demo-disclaimer">Demo marketplace · Ticket listings are synthetic inventory for product testing and are not live availability.</p>
    </div>;
}
