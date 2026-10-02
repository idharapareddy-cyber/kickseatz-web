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

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}


function matchupKey(game: (typeof GAMES)[number]) {
  return game.away + "-" + game.home;
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
  if (!image) return <MatchupGraphic game={game} hero={hero} />;
  return (
    <div className={"kz-stadium-visual" + (hero ? " kz-stadium-visual-hero" : "")}>
      <img src={image} alt={teamName(game.home) + " stadium"} />
      <div className="kz-stadium-shade" />
      <div className="kz-stadium-color" style={{ background: TEAMS.find((team) => team.slug === game.home)?.color }} />
      <div className="kz-stadium-label"><span>{gameCategory(game)}</span><strong>{game.venue}</strong></div>
    </div>
  );
}

function GameVisual({ game, index, hero = false }: { game: (typeof GAMES)[number]; index: number; hero?: boolean }) {
  const useStadium = Boolean(stadiumImages[game.home]) && (hero || index % 3 === 0);
  return useStadium ? <StadiumVisual game={game} hero={hero} /> : <MatchupGraphic game={game} hero={hero} />;
}

function MatchupGraphic({ game, hero = false }: { game: (typeof GAMES)[number]; hero?: boolean }) {
  return (
    <div className={"kz-matchup-graphic" + (hero ? " kz-matchup-graphic-hero" : "")}>
      <div className="kz-matchup-panel kz-matchup-panel-away" />
      <div className="kz-matchup-panel kz-matchup-panel-home" />
      <div className="kz-matchup-accent" />
      <div className="kz-matchup-topline"><span>KICKSEATZ · NFL</span><b>{matchupLabel(game)}</b></div>
      <div className="kz-matchup-teams">
        <div className="kz-matchup-team">
          <div className="kz-matchup-logo"><img src={logoUrl(game.away)} alt="" /></div>
          <strong>{game.away}</strong>
          <small>{teamName(game.away)}</small>
        </div>
        <div className="kz-matchup-vs"><span>VS</span></div>
        <div className="kz-matchup-team">
          <div className="kz-matchup-logo"><img src={logoUrl(game.home)} alt="" /></div>
          <strong>{game.home}</strong>
          <small>{teamName(game.home)}</small>
        </div>
      </div>
      <div className="kz-matchup-bottom"><span>{formatDate(game.date)}</span><span>{game.city}</span><span>{game.time}</span></div>
    </div>
  );
}

function matchupLabel(game: (typeof GAMES)[number]) {
  const prime = game.time.includes("8:20 PM") || game.time.includes("8:15 PM");
  const rivalry = ["DAL-PHI","GB-CHI","BAL-PIT","ATL-NO","SF-SEA","KC-BUF","KC-LV"].includes(matchupKey(game));
  if (prime && rivalry) return "PRIMETIME RIVALRY";
  if (prime) return "PRIMETIME";
  if (rivalry) return "RIVALRY GAME";
  if (gameFlags(game).division) return "DIVISION GAME";
  if (gameFlags(game).playoffWatch) return "PLAYOFF WATCH";
  return "NFL GAME DAY";
}


function GameRow({ game }: { game: (typeof GAMES)[number] }) {
  return (
    <Link href={`/find-tickets?game=${game.id}`} className="kz-game-row">
      <div className="kz-game-date">
        <strong>{new Date(`${game.date}T12:00:00`).toLocaleDateString("en-US", { month: "short" })}</strong>
        <b>{new Date(`${game.date}T12:00:00`).getDate()}</b>
      </div>
      <div className="kz-game-matchup">
        <div>
          <img src={logoUrl(game.away)} alt="" />
          <strong>{teamName(game.away)}</strong>
          <span>@</span>
          <strong>{teamName(game.home)}</strong>
          <img src={logoUrl(game.home)} alt="" />
        </div>
        <small><MapPin size={13} /> {game.venue} · {game.city} · {game.time}</small>
      </div>
      <span className="kz-demand">{game.demand}</span>
      <span className="kz-ticket-link">Find Tickets <ArrowRight size={15} /></span>
    </Link>
  );
}

function EventCard({
  game,
  index,
  badge = "TRENDING",
}: {
  game: (typeof GAMES)[number];
  index: number;
  badge?: string;
}) {
  const homeTeam = TEAMS.find((team) => team.slug === game.home);
  const awayTeam = TEAMS.find((team) => team.slug === game.away);

  return (
    <Link
      href={`/find-tickets?game=${game.id}`}
      className="kz-event-card"
      style={{
        "--home-team-color": homeTeam?.color ?? "#6D28D9",
        "--away-team-color": awayTeam?.color ?? "#111827",
      } as React.CSSProperties}
    >
      <div className="kz-event-image">
        <GameVisual game={game} index={index} />
        <span className="kz-event-badge">{gameCategory(game)}</span>
        <span className="kz-heart" aria-hidden="true">♡</span>
      </div>
      <div className="kz-event-info">
        <strong>{teamName(game.away)} @ {teamName(game.home)}</strong>
        <span>{formatDate(game.date)} · {game.city}</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const featured = GAMES.slice(0, 5);
  const trending = [...GAMES]
    .filter((game) => game.demand === "High" || game.demand === "Premium")
    .slice(0, 6);
  const upcoming = GAMES.slice(5, 12);

  return (
    <div className="page marketplace-home kz-home">
      <section className="kz-hero">
        <div className="kz-hero-image">
          <GameVisual game={featured[0]} index={0} hero />
          <div className="kz-hero-copy">
            <span className="kz-eyebrow">KICKSEATZ · LIVE SPORTS & EVENTS</span>
            <h1>Find your seat<br /><em>for the game.</em></h1>
            <p>Discover NFL and college football now, with more sports and live events coming to KickSeatz.</p>
            <Link href="/find-tickets" className="kz-primary-button">Explore Sports & Tickets <ArrowRight size={17} /></Link>
          </div>
          <div className="kz-hero-game">
            <span>FEATURED GAME</span>
            <strong>{teamName(featured[0].away)} @ {teamName(featured[0].home)}</strong>
            <small>{formatDate(featured[0].date)} · {featured[0].city}</small>
          </div>
        </div>
        <div className="kz-hero-search">
          <div>
            <span className="kz-eyebrow">SEARCH KICKSEATZ</span>
            <strong>What game are you looking for?</strong>
          </div>
          <form action="/find-tickets" method="get" className="kz-search-box">
            <Search size={19} />
            <input name="search" type="search" placeholder="Team, sport, event, city, or stadium" aria-label="Search teams, games, cities, or stadiums" />
            <button type="submit">Search</button>
          </form>
          <div className="kz-search-links">
            <Link href="/find-tickets">All games</Link>
            <Link href="/teams">All teams</Link>
            <Link href="/find-my-game">Find My Game</Link>
          </div>
        </div>
      </section>

      <nav className="kz-category-rail" aria-label="Sports discovery">
        <Link className="active" href="/find-tickets">NFL</Link>
        <Link href="/find-tickets?category=division">Division Rivalries</Link>
        <Link href="/find-tickets?category=primetime">Primetime</Link>
        <Link href="/find-tickets?category=playoff-watch">Playoff Watch</Link>
        <Link href="/find-tickets?category=international">International Series</Link>
        <Link href="/find-tickets?category=college-football">College Football</Link>
        <Link href="/find-tickets?category=basketball">Basketball</Link>
        <Link href="/find-tickets?category=baseball">Baseball</Link>
        <Link href="/find-tickets?category=hockey">Hockey</Link>
        <Link href="/find-tickets?category=soccer">Soccer</Link>
        <Link href="/find-tickets?category=concerts">Concerts</Link>
      </nav>

      <section className="kz-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">FEATURED</span><h2>Games worth seeing</h2></div>
          <Link href="/find-tickets">See all games <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-feature-grid">
          <Link href={`/find-tickets?game=${featured[0].id}`} className="kz-feature-main">
            <GameVisual game={featured[0]} index={0} hero />
            <span className="kz-feature-badge">{gameCategory(featured[0])}</span>
            <div className="kz-feature-copy">
              <span>{formatDate(featured[0].date)} · {featured[0].city}</span>
              <h3>{teamName(featured[0].away)} @ {teamName(featured[0].home)}</h3>
              <p>{featured[0].reason}</p>
              <b>Find tickets <ArrowRight size={15} /></b>
            </div>
          </Link>
          <div className="kz-feature-side">
            {featured.slice(1, 3).map((game, i) => (
              <EventCard key={game.id} game={game} index={i + 2} badge={i === 0 ? "HIGH DEMAND" : "POPULAR"} />
            ))}
          </div>
        </div>
      </section>

      <section className="kz-section kz-game-type-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">SHOP BY GAME TYPE</span><h2>Every game has a different feel</h2></div>
          <Link href="/find-tickets">Browse the full NFL schedule <ArrowRight size={15} /></Link>
        </div>

        <div className="kz-game-type-grid">
          <div className="kz-game-type-block kz-game-type-division">
            <div className="kz-game-type-head"><span>DIVISION RIVALRIES</span><strong>Know the teams. Feel the history.</strong></div>
            <div className="kz-mini-card-grid">
              {GAMES.filter((game) => gameFlags(game).division).slice(0, 2).map((game, i) => <EventCard key={game.id} game={game} index={i + 10} />)}
            </div>
          </div>

          <div className="kz-game-type-block kz-game-type-prime">
            <div className="kz-game-type-head"><span>PRIMETIME</span><strong>Big matchups under the lights.</strong></div>
            <div className="kz-mini-card-grid">
              {GAMES.filter((game) => gameFlags(game).primetime).map((game, i) => <EventCard key={game.id} game={game} index={i + 20} />)}
            </div>
          </div>

          <div className="kz-game-type-block kz-game-type-playoff">
            <div className="kz-game-type-head"><span>PLAYOFF WATCH</span><strong>Late-season games with postseason stakes.</strong></div>
            <div className="kz-mini-card-grid">
              {GAMES.filter((game) => gameFlags(game).playoffWatch).slice(0, 2).map((game, i) => <EventCard key={game.id} game={game} index={i + 30} />)}
            </div>
          </div>

          <div className="kz-game-type-block kz-game-type-international">
            <div className="kz-game-type-head"><span>INTERNATIONAL SERIES</span><strong>NFL game days beyond the U.S.</strong></div>
            <div className="kz-international-grid">
              <Link href="/find-tickets?category=international" className="kz-international-card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Wembley_stadium.jpg" alt="Wembley Stadium in London" />
                <div><span>LONDON</span><strong>Wembley Stadium</strong><small>International NFL destination</small></div>
              </Link>
              <Link href="/find-tickets?category=international" className="kz-international-card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Allianz_Arena.jpg" alt="Allianz Arena in Munich" />
                <div><span>MUNICH</span><strong>Allianz Arena</strong><small>International NFL destination</small></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="kz-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">TRENDING NOW</span><h2>Games people are watching</h2></div>
          <Link href="/find-tickets">Browse all <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-card-grid">
          {trending.slice(0, 3).map((game, i) => <EventCard key={game.id} game={game} index={i} />)}
        </div>
      </section>

      <section className="kz-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">GAME DAY & BEYOND</span><h2>More than just the game</h2></div>
          <Link href="/find-tickets">Explore events <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-experience-grid">
          <Link href="/find-tickets" className="kz-experience-card kz-experience-concert">
            <div className="kz-experience-art">
              <img src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85" alt="" />
              <div className="kz-experience-shade" />
              <Music2 size={25} />
            </div>
            <div className="kz-experience-copy">
              <span>LIVE MUSIC</span>
              <strong>Concerts & game-day music</strong>
              <small>Find live music experiences around major game weekends.</small>
            </div>
          </Link>
          <Link href="/find-tickets" className="kz-experience-card">
            <div className="kz-experience-art"><img src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1400&q=90" alt="" /><div className="kz-experience-shade" /><Users size={25} /></div>
            <div className="kz-experience-copy"><span>NFL EVENTS</span><strong>Fan festivals & football events</strong><small>Discover NFL-themed experiences beyond the stadium seats.</small></div>
          </Link>
          <Link href="/find-tickets" className="kz-experience-card">
            <div className="kz-experience-art"><img src="https://images.unsplash.com/photo-1668674768860-b6d34068042b?auto=format&fit=crop&w=1400&q=90" alt="" /><div className="kz-experience-shade" /><Sparkles size={25} /></div>
            <div className="kz-experience-copy"><span>GAME WEEKEND</span><strong>Drafts, showcases & special events</strong><small>Keep an eye out for major football events and special weekends.</small></div>
          </Link>
        </div>
      </section>

      <section className="kz-section kz-college-section">
        <div className="kz-section-heading"><div><span className="kz-eyebrow">NEXT UP</span><h2>College football</h2></div><Link href="/find-tickets?category=college-football">Explore college football <ArrowRight size={15} /></Link></div>
        <div className="kz-college-grid">{collegeFootball.map((school)=><Link href="/find-tickets?category=college-football" className="kz-college-card" key={school.short}><img src={school.image} alt="" /><div className="kz-college-shade" /><div className="kz-college-copy"><span>COLLEGE FOOTBALL</span><strong>{school.name}</strong><small>Games, rivalries & game-day experiences</small></div></Link>)}</div>
      </section>

      <section className="kz-section kz-team-strip-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">EXPLORE</span><h2>Popular NFL teams</h2></div>
          <Link href="/teams">See all 32 teams <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-team-strip">
          {TEAMS.slice(0, 8).map((team) => (
            <Link
              href={`/teams/${team.slug}`}
              key={team.slug}
              className="kz-team-tile"
              style={{ "--team-color": team.color } as React.CSSProperties}
            >
              <div className="kz-team-color" />
              <img src={logoUrl(team.slug)} alt="" />
              <span>{team.abbr}</span>
              <strong>{team.name}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="kz-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">EXPLORE BY DIVISION</span><h2>Find your part of the NFL</h2></div>
          <Link href="/teams">Browse all teams <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-division-grid">
          {["AFC East","AFC North","AFC South","AFC West","NFC East","NFC North","NFC South","NFC West"].map((division) => {
            const teams = TEAMS.filter((team) => team.division === division).slice(0, 4);
            return (
              <Link href="/teams" className="kz-division-card" key={division}>
                <div className="kz-division-top">
                  <span>{division.startsWith("AFC") ? "AFC" : "NFC"}</span>
                  <ArrowRight size={16} />
                </div>
                <strong>{division}</strong>
                <div className="kz-division-logos">
                  {teams.map((team) => <img key={team.slug} src={logoUrl(team.slug)} alt="" />)}
                </div>
                <small>{teams.map((team) => team.abbr).join(" · ")}</small>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="kz-section">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">UPCOMING</span><h2>More NFL games</h2></div>
          <Link href="/find-tickets">View all tickets <ArrowRight size={15} /></Link>
        </div>
        <div className="kz-game-list">
          {upcoming.map((game) => <GameRow key={game.id} game={game} />)}
        </div>
      </section>

      <section className="kz-section kz-sports-section">
        <div className="kz-section-heading"><div><span className="kz-eyebrow">MORE SPORTS</span><h2>Coming beyond football</h2></div><span className="kz-section-note">One ticket destination, more live sports.</span></div>
        <div className="kz-sports-grid">{sportCategories.map((sport)=><Link href={`/find-tickets?category=${sport.kicker.toLowerCase()}`} className="kz-sport-card" key={sport.kicker}><img src={sport.image} alt="" /><div className="kz-sport-shade" /><div><span>{sport.kicker}</span><strong>{sport.name}</strong><small>Explore tickets & events</small></div></Link>)}</div>
      </section>

      <section className="kz-section kz-discover">
        <div className="kz-section-heading">
          <div><span className="kz-eyebrow">DISCOVER MORE</span><h2>Explore KickSeatz</h2></div>
        </div>
        <div className="kz-discover-grid">
          <Link href="/find-tickets"><Flame /><strong>High-demand games</strong><span>See matchups with strong ticket interest.</span><ArrowRight /></Link>
          <Link href="/find-tickets"><CalendarDays /><strong>This week</strong><span>Browse the next games on the schedule.</span><ArrowRight /></Link>
          <Link href="/find-my-game"><Navigation /><strong>Find My Game</strong><span>Answer a few questions and discover a matchup.</span><ArrowRight /></Link>
          <Link href="/teams"><Trophy /><strong>Browse teams</strong><span>Explore every NFL team and stadium.</span><ArrowRight /></Link>
        </div>
      </section>

      <section className="kz-info-strip">
        <div><span className="kz-eyebrow">KICKSEATZ</span><h2>Know what you’re buying.</h2></div>
        <p>Compare price, seat location, availability, and game information in one place.</p>
        <Link href="/find-tickets" className="kz-primary-button">Find tickets <Ticket size={16} /></Link>
      </section>

      <p className="demo-disclaimer">Demo marketplace · Ticket listings are synthetic inventory for product testing and are not live availability.</p>
    </div>
  );
}
