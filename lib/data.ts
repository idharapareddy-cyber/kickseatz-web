export type Division = "AFC North" | "AFC South" | "AFC East" | "AFC West" | "NFC North" | "NFC South" | "NFC East" | "NFC West";
export type SeatArea = "Lower Bowl" | "Club" | "Upper Bowl";

export type Team = {
  slug: string;
  name: string;
  city: string;
  abbr: string;
  division: Division;
  venue: string;
  state: string;
  color: string;
};

export type Game = {
  id: string;
  home: string;
  away: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  demand: "Low" | "Medium" | "High" | "Premium";
  reason: string;
};

export type Ticket = {
  id: string;
  gameId: string;
  home: string;
  away: string;
  venue: string;
  section: string;
  row: string;
  seatArea: SeatArea;
  quantity: number;
  price: number;
  score: number;
  source: string;
  valueNote: string;
};

export const TEAMS: Team[] = [
  ["arizona-cardinals","Arizona Cardinals","Glendale","ARI","NFC West","State Farm Stadium","AZ","#97233F"],
  ["atlanta-falcons","Atlanta Falcons","Atlanta","ATL","NFC South","Mercedes-Benz Stadium","GA","#A71930"],
  ["baltimore-ravens","Baltimore Ravens","Baltimore","BAL","AFC North","M&T Bank Stadium","MD","#241773"],
  ["buffalo-bills","Buffalo Bills","Buffalo","BUF","AFC East","Highmark Stadium","NY","#00338D"],
  ["carolina-panthers","Carolina Panthers","Charlotte","CAR","NFC South","Bank of America Stadium","NC","#0085CA"],
  ["chicago-bears","Chicago Bears","Chicago","CHI","NFC North","Soldier Field","IL","#0B162A"],
  ["cincinnati-bengals","Cincinnati Bengals","Cincinnati","CIN","AFC North","Paycor Stadium","OH","#FB4F14"],
  ["cleveland-browns","Cleveland Browns","Cleveland","CLE","AFC North","Huntington Bank Field","OH","#311D00"],
  ["dallas-cowboys","Dallas Cowboys","Arlington","DAL","NFC East","AT&T Stadium","TX","#041E42"],
  ["denver-broncos","Denver Broncos","Denver","DEN","AFC West","Empower Field at Mile High","CO","#FB4F14"],
  ["detroit-lions","Detroit Lions","Detroit","DET","NFC North","Ford Field","MI","#0076B6"],
  ["green-bay-packers","Green Bay Packers","Green Bay","GB","NFC North","Lambeau Field","WI","#203731"],
  ["houston-texans","Houston Texans","Houston","HOU","AFC South","NRG Stadium","TX","#03202F"],
  ["indianapolis-colts","Indianapolis Colts","Indianapolis","IND","AFC South","Lucas Oil Stadium","IN","#002C5F"],
  ["jacksonville-jaguars","Jacksonville Jaguars","Jacksonville","JAX","AFC South","EverBank Stadium","FL","#101820"],
  ["kansas-city-chiefs","Kansas City Chiefs","Kansas City","KC","AFC West","GEHA Field at Arrowhead Stadium","MO","#E31837"],
  ["las-vegas-raiders","Las Vegas Raiders","Las Vegas","LV","AFC West","Allegiant Stadium","NV","#000000"],
  ["los-angeles-chargers","Los Angeles Chargers","Los Angeles","LAC","AFC West","SoFi Stadium","CA","#0080C6"],
  ["los-angeles-rams","Los Angeles Rams","Inglewood","LAR","NFC West","SoFi Stadium","CA","#003594"],
  ["miami-dolphins","Miami Dolphins","Miami Gardens","MIA","AFC East","Hard Rock Stadium","FL","#008E97"],
  ["minnesota-vikings","Minnesota Vikings","Minneapolis","MIN","NFC North","U.S. Bank Stadium","MN","#4F2683"],
  ["new-england-patriots","New England Patriots","Foxborough","NE","AFC East","Gillette Stadium","MA","#002244"],
  ["new-orleans-saints","New Orleans Saints","New Orleans","NO","NFC South","Caesars Superdome","LA","#D3BC8D"],
  ["new-york-giants","New York Giants","East Rutherford","NYG","NFC East","MetLife Stadium","NJ","#0B2265"],
  ["new-york-jets","New York Jets","East Rutherford","NYJ","AFC East","MetLife Stadium","NJ","#125740"],
  ["philadelphia-eagles","Philadelphia Eagles","Philadelphia","PHI","NFC East","Lincoln Financial Field","PA","#004C54"],
  ["pittsburgh-steelers","Pittsburgh Steelers","Pittsburgh","PIT","AFC North","Acrisure Stadium","PA","#FFB612"],
  ["san-francisco-49ers","San Francisco 49ers","Santa Clara","SF","NFC West","Levi's Stadium","CA","#AA0000"],
  ["seattle-seahawks","Seattle Seahawks","Seattle","SEA","NFC West","Lumen Field","WA","#002244"],
  ["tampa-bay-buccaneers","Tampa Bay Buccaneers","Tampa","TB","NFC South","Raymond James Stadium","FL","#D50A0A"],
  ["tennessee-titans","Tennessee Titans","Nashville","TEN","AFC South","Nissan Stadium","TN","#0C2340"],
  ["washington-commanders","Washington Commanders","Landover","WAS","NFC East","Northwest Stadium","MD","#5A1414"],
].map(([slug,name,city,abbr,division,venue,state,color]) => ({ slug,name,city,abbr,division: division as Division,venue,state,color }));

const gamePairs = [
  ["kansas-city-chiefs","buffalo-bills","2026-10-04","1:00 PM","High","Division battle"],
  ["dallas-cowboys","philadelphia-eagles","2026-10-04","4:25 PM","Premium","Rivalry atmosphere"],
  ["san-francisco-49ers","seattle-seahawks","2026-10-11","8:20 PM","High","Division battle"],
  ["green-bay-packers","chicago-bears","2026-10-18","1:00 PM","Premium","Historic rivalry"],
  ["baltimore-ravens","pittsburgh-steelers","2026-10-25","1:00 PM","Premium","Physical rivalry"],
  ["miami-dolphins","new-york-jets","2026-11-01","1:00 PM","Medium","Division matchup"],
  ["atlanta-falcons","new-orleans-saints","2026-11-08","1:00 PM","High","Division rivalry"],
  ["buffalo-bills","new-england-patriots","2026-11-15","4:25 PM","High","Division matchup"],
  ["denver-broncos","kansas-city-chiefs","2026-11-22","4:05 PM","High","Division battle"],
  ["philadelphia-eagles","new-york-giants","2026-11-29","1:00 PM","Medium","Division matchup"],
  ["detroit-lions","green-bay-packers","2026-12-06","4:25 PM","High","Division battle"],
  ["houston-texans","jacksonville-jaguars","2026-12-13","1:00 PM","Medium","Division matchup"],
  ["los-angeles-rams","san-francisco-49ers","2026-12-20","4:25 PM","High","NFC West matchup"],
  ["cincinnati-bengals","cleveland-browns","2026-12-20","1:00 PM","Medium","In-state rivalry"],
  ["tampa-bay-buccaneers","carolina-panthers","2026-12-27","1:00 PM","Medium","Division matchup"],
  ["minnesota-vikings","detroit-lions","2027-01-03","1:00 PM","High","Division battle"],
  ["arizona-cardinals","los-angeles-rams","2026-10-04","4:05 PM","Medium","NFC West matchup"],
  ["indianapolis-colts","houston-texans","2026-10-11","1:00 PM","High","Division matchup"],
  ["las-vegas-raiders","denver-broncos","2026-10-18","4:05 PM","High","AFC West matchup"],
  ["los-angeles-chargers","kansas-city-chiefs","2026-10-25","4:25 PM","Premium","High-demand matchup"],
  ["tennessee-titans","jacksonville-jaguars","2026-11-08","1:00 PM","Medium","Division matchup"],
  ["washington-commanders","philadelphia-eagles","2026-11-15","1:00 PM","High","NFC East matchup"],
] as const;

export const GAMES: Game[] = gamePairs.map(([home,away,date,time,demand,reason], index) => {
  const homeTeam = TEAMS.find(t => t.slug === home)!;
  return { id: `game-${index + 1}`, home, away, date, time, venue: homeTeam.venue, city: homeTeam.city, demand: demand as Game["demand"], reason };
});

const sectionSets: Record<SeatArea, string[]> = {
  "Lower Bowl": ["102","108","115","124","131","139"],
  "Club": ["201C","210C","220C","230C"],
  "Upper Bowl": ["315","325","337","348","359","372"],
};

function priceFor(index: number, area: SeatArea, demand: Game["demand"]) {
  const base = demand === "Premium" ? 170 : demand === "High" ? 125 : demand === "Medium" ? 90 : 65;
  const areaAdd = area === "Lower Bowl" ? 80 : area === "Club" ? 115 : 0;
  return Math.max(35, base + areaAdd + ((index * 17) % 55) - (index % 4) * 5);
}

export const TICKETS: Ticket[] = GAMES.flatMap((game, gameIndex) => {
  const home = TEAMS.find(t => t.slug === game.home)!;
  const away = TEAMS.find(t => t.slug === game.away)!;
  return (Object.keys(sectionSets) as SeatArea[]).flatMap((area, areaIndex) => sectionSets[area].map((section, index) => {
    const price = priceFor(gameIndex + index, area, game.demand);
    const score = Math.max(72, Math.min(98, 84 + (area === "Lower Bowl" ? 7 : area === "Club" ? 8 : 2) - (index % 5) + (game.demand === "Premium" ? 2 : 0)));
    return {
      id: `${game.id}-${areaIndex}-${index + 1}`,
      gameId: game.id,
      home: home.slug,
      away: away.slug,
      venue: home.venue,
      section,
      row: area === "Upper Bowl" ? `${8 + (index % 7)}` : `${3 + (index % 6)}`,
      seatArea: area,
      quantity: 1 + ((index + gameIndex) % 4),
      price,
      score,
      source: "KickSeatz Demo Inventory",
      valueNote: area === "Club" ? "Premium seating with strong value for this matchup" : area === "Lower Bowl" ? "Closer view with above-average score" : "Lower entry price with solid game-day value",
    } satisfies Ticket;
  }));
});

export function teamBySlug(slug: string) { return TEAMS.find(t => t.slug === slug); }
export function gameById(id: string) { return GAMES.find(g => g.id === id); }
export function gamesForTeam(slug: string) { return GAMES.filter(g => g.home === slug || g.away === slug); }
export function teamName(slug: string) { return teamBySlug(slug)?.name ?? slug; }

export type PlayerSpotlight = {
  name: string;
  team: string;
  position: string;
  number: string;
};

export const PLAYER_SPOTLIGHTS: PlayerSpotlight[] = [
  { name: "Patrick Mahomes", team: "kansas-city-chiefs", position: "Quarterback", number: "15", image: "https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png" },
  { name: "Josh Allen", team: "buffalo-bills", position: "Quarterback", number: "17", image: "https://a.espncdn.com/i/headshots/nfl/players/full/3918298.png" },
  { name: "Lamar Jackson", team: "baltimore-ravens", position: "Quarterback", number: "8", image: "https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png" },
  { name: "Jalen Hurts", team: "philadelphia-eagles", position: "Quarterback", number: "1", image: "https://a.espncdn.com/i/headshots/nfl/players/full/4040715.png" },
  { name: "Christian McCaffrey", team: "san-francisco-49ers", position: "Running Back", number: "23", image: "https://a.espncdn.com/i/headshots/nfl/players/full/2976212.png" },
  { name: "Tyreek Hill", team: "miami-dolphins", position: "Wide Receiver", number: "10", image: "https://a.espncdn.com/i/headshots/nfl/players/full/3116406.png" },
  { name: "Myles Garrett", team: "cleveland-browns", position: "Defensive End", number: "95", image: "https://a.espncdn.com/i/headshots/nfl/players/full/3055182.png" },
  { name: "T.J. Watt", team: "pittsburgh-steelers", position: "Linebacker", number: "90", image: "https://a.espncdn.com/i/headshots/nfl/players/full/3045282.png" },
];

export const FEATURED_STADIUMS = TEAMS.slice(0, 12);
\n