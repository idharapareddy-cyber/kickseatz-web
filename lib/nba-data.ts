export type NbaTeam = {
  slug: string;
  name: string;
  city: string;
  abbr: string;
  logo: string;
};

export type NbaGame = {
  id: string;
  away: string;
  home: string;
  date: string;
  time: string;
  demand: "Medium" | "High" | "Premium";
};

const team = (name: string, city: string, abbr: string, logo: string): NbaTeam => ({ slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, city, abbr, logo: `https://a.espncdn.com/i/teamlogos/nba/500/${logo}.png` });

export const NBA_TEAMS: NbaTeam[] = [
  team("Atlanta Hawks", "Atlanta", "ATL", "atl"), team("Boston Celtics", "Boston", "BOS", "bos"), team("Brooklyn Nets", "Brooklyn", "BKN", "bkn"),
  team("Charlotte Hornets", "Charlotte", "CHA", "cha"), team("Chicago Bulls", "Chicago", "CHI", "chi"), team("Cleveland Cavaliers", "Cleveland", "CLE", "cle"),
  team("Dallas Mavericks", "Dallas", "DAL", "dal"), team("Denver Nuggets", "Denver", "DEN", "den"), team("Detroit Pistons", "Detroit", "DET", "det"),
  team("Golden State Warriors", "Golden State", "GSW", "gs"), team("Houston Rockets", "Houston", "HOU", "hou"), team("Indiana Pacers", "Indiana", "IND", "ind"),
  team("LA Clippers", "Los Angeles", "LAC", "lac"), team("Los Angeles Lakers", "Los Angeles", "LAL", "lal"), team("Memphis Grizzlies", "Memphis", "MEM", "mem"),
  team("Miami Heat", "Miami", "MIA", "mia"), team("Milwaukee Bucks", "Milwaukee", "MIL", "mil"), team("Minnesota Timberwolves", "Minnesota", "MIN", "min"),
  team("New Orleans Pelicans", "New Orleans", "NOP", "no"), team("New York Knicks", "New York", "NY", "ny"), team("Oklahoma City Thunder", "Oklahoma City", "OKC", "okc"),
  team("Orlando Magic", "Orlando", "ORL", "orl"), team("Philadelphia 76ers", "Philadelphia", "PHI", "phi"), team("Phoenix Suns", "Phoenix", "PHX", "phx"),
  team("Portland Trail Blazers", "Portland", "POR", "por"), team("Sacramento Kings", "Sacramento", "SAC", "sac"), team("San Antonio Spurs", "San Antonio", "SA", "sa"),
  team("Toronto Raptors", "Toronto", "TOR", "tor"), team("Utah Jazz", "Utah", "UTA", "utah"), team("Washington Wizards", "Washington", "WSH", "wsh"),
];

export const NBA_GAMES: NbaGame[] = [
  { id: "nba-2026-10-04-uta-den", away: "UTA", home: "DEN", date: "2026-10-04", time: "7:00 PM", demand: "High" },
  { id: "nba-2026-10-04-gsw-lac", away: "GSW", home: "LAC", date: "2026-10-04", time: "7:00 PM", demand: "Premium" },
  { id: "nba-2026-10-05-mem-atl", away: "MEM", home: "ATL", date: "2026-10-05", time: "7:00 PM", demand: "High" },
  { id: "nba-2026-10-05-ny-phi", away: "NY", home: "PHI", date: "2026-10-05", time: "7:00 PM", demand: "Premium" },
  { id: "nba-2026-10-05-lal-sac", away: "LAL", home: "SAC", date: "2026-10-05", time: "10:00 PM", demand: "Premium" },
  { id: "nba-2026-10-06-lal-gsw", away: "LAL", home: "GSW", date: "2026-10-06", time: "10:00 PM", demand: "Premium" },
  { id: "nba-2026-10-07-phx-chi", away: "PHX", home: "CHI", date: "2026-10-07", time: "8:00 PM", demand: "High" },
  { id: "nba-2026-10-08-bos-cle", away: "BOS", home: "CLE", date: "2026-10-08", time: "7:00 PM", demand: "Premium" },
  { id: "nba-2026-10-08-atl-sa", away: "ATL", home: "SA", date: "2026-10-08", time: "8:00 PM", demand: "High" },
  { id: "nba-2026-10-09-hou-dal", away: "HOU", home: "DAL", date: "2026-10-09", time: "8:00 PM", demand: "High" },
];

export function nbaTeam(abbr: string) { return NBA_TEAMS.find((team) => team.abbr === abbr); }
export function nbaTeamName(abbr: string) { return nbaTeam(abbr)?.name ?? abbr; }
