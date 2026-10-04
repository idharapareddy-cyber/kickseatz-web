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

const NBA_LOGOS: Record<string, number> = {
  ATL: 1, BOS: 2, BKN: 17, CHA: 30, CHI: 4, CLE: 5, DAL: 6, DEN: 7,
  DET: 8, GSW: 9, HOU: 10, IND: 11, LAC: 12, LAL: 13, MEM: 29, MIA: 14,
  MIL: 15, MIN: 16, NOP: 3, NYK: 20, OKC: 25, ORL: 19, PHI: 20, PHX: 21,
  POR: 22, SAC: 23, SAS: 24, TOR: 28, UTA: 26, WAS: 27,
};

const team = (name: string, city: string, abbr: string): NbaTeam => ({
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  city,
  abbr,
  logo: `https://a.espncdn.com/i/teamlogos/nba/500/${NBA_LOGOS[abbr]}.png`,
});

export const NBA_TEAMS: NbaTeam[] = [
  team("Atlanta Hawks", "Atlanta", "ATL"),
  team("Boston Celtics", "Boston", "BOS"),
  team("Brooklyn Nets", "Brooklyn", "BKN"),
  team("Charlotte Hornets", "Charlotte", "CHA"),
  team("Chicago Bulls", "Chicago", "CHI"),
  team("Cleveland Cavaliers", "Cleveland", "CLE"),
  team("Dallas Mavericks", "Dallas", "DAL"),
  team("Denver Nuggets", "Denver", "DEN"),
  team("Detroit Pistons", "Detroit", "DET"),
  team("Golden State Warriors", "Golden State", "GSW"),
  team("Houston Rockets", "Houston", "HOU"),
  team("Indiana Pacers", "Indiana", "IND"),
  team("LA Clippers", "Los Angeles", "LAC"),
  team("Los Angeles Lakers", "Los Angeles", "LAL"),
  team("Memphis Grizzlies", "Memphis", "MEM"),
  team("Miami Heat", "Miami", "MIA"),
  team("Milwaukee Bucks", "Milwaukee", "MIL"),
  team("Minnesota Timberwolves", "Minnesota", "MIN"),
  team("New Orleans Pelicans", "New Orleans", "NOP"),
  team("New York Knicks", "New York", "NYK"),
  team("Oklahoma City Thunder", "Oklahoma City", "OKC"),
  team("Orlando Magic", "Orlando", "ORL"),
  team("Philadelphia 76ers", "Philadelphia", "PHI"),
  team("Phoenix Suns", "Phoenix", "PHX"),
  team("Portland Trail Blazers", "Portland", "POR"),
  team("Sacramento Kings", "Sacramento", "SAC"),
  team("San Antonio Spurs", "San Antonio", "SAS"),
  team("Toronto Raptors", "Toronto", "TOR"),
  team("Utah Jazz", "Utah", "UTA"),
  team("Washington Wizards", "Washington", "WAS"),
];

export const NBA_GAMES: NbaGame[] = [
  { id: "nba-2026-10-04-uta-den", away: "UTA", home: "DEN", date: "2026-10-04", time: "7:00 PM", demand: "High" },
  { id: "nba-2026-10-04-gsw-lac", away: "GSW", home: "LAC", date: "2026-10-04", time: "7:00 PM", demand: "Premium" },
  { id: "nba-2026-10-05-mem-atl", away: "MEM", home: "ATL", date: "2026-10-05", time: "7:00 PM", demand: "High" },
  { id: "nba-2026-10-05-nyk-phi", away: "NYK", home: "PHI", date: "2026-10-05", time: "7:00 PM", demand: "Premium" },
  { id: "nba-2026-10-05-lal-sac", away: "LAL", home: "SAC", date: "2026-10-05", time: "10:00 PM", demand: "Premium" },
  { id: "nba-2026-10-06-lal-gsw", away: "LAL", home: "GSW", date: "2026-10-06", time: "10:00 PM", demand: "Premium" },
  { id: "nba-2026-10-07-phx-chi", away: "PHX", home: "CHI", date: "2026-10-07", time: "8:00 PM", demand: "High" },
  { id: "nba-2026-10-08-bos-cle", away: "BOS", home: "CLE", date: "2026-10-08", time: "7:00 PM", demand: "Premium" },
  { id: "nba-2026-10-08-atl-sas", away: "ATL", home: "SAS", date: "2026-10-08", time: "8:00 PM", demand: "High" },
  { id: "nba-2026-10-09-hou-dal", away: "HOU", home: "DAL", date: "2026-10-09", time: "8:00 PM", demand: "High" },
];

export function nbaTeam(abbr: string) {
  return NBA_TEAMS.find((team) => team.abbr === abbr);
}

export function nbaTeamName(abbr: string) {
  return nbaTeam(abbr)?.name ?? abbr;
}
