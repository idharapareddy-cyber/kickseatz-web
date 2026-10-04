import { readFile, writeFile } from "node:fs/promises";

const TEAM_SLUGS = {
  ARI: "arizona-cardinals", ATL: "atlanta-falcons", BAL: "baltimore-ravens", BUF: "buffalo-bills",
  CAR: "carolina-panthers", CHI: "chicago-bears", CIN: "cincinnati-bengals", CLE: "cleveland-browns",
  DAL: "dallas-cowboys", DEN: "denver-broncos", DET: "detroit-lions", GB: "green-bay-packers",
  HOU: "houston-texans", IND: "indianapolis-colts", JAX: "jacksonville-jaguars", KC: "kansas-city-chiefs",
  LV: "las-vegas-raiders", LAC: "los-angeles-chargers", LAR: "los-angeles-rams", MIA: "miami-dolphins",
  MIN: "minnesota-vikings", NE: "new-england-patriots", NO: "new-orleans-saints", NYG: "new-york-giants",
  NYJ: "new-york-jets", PHI: "philadelphia-eagles", PIT: "pittsburgh-steelers", SF: "san-francisco-49ers",
  SEA: "seattle-seahawks", TB: "tampa-bay-buccaneers", TEN: "tennessee-titans", WSH: "washington-commanders",
};

const now = new Date();
const seasonStart = `${now.getUTCFullYear()}0101`;
const nextYear = now.getUTCFullYear() + 1;
const seasonEnd = `${nextYear}0115`;
const query = `dates=${seasonStart}-${seasonEnd}&limit=1000`;

const endpoints = [
  `https://site.web.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?${query}`,
  `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?${query}`,
];

async function fetchScoreboard() {
  let lastError;
  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "KickSeatz-Schedule-Sync/1.0", accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload.events)) throw new Error("ESPN response did not include an events array");
      console.log(`NFL schedule feed: ${new URL(url).hostname}`);
      return payload;
    } catch (error) {
      lastError = error;
      console.warn(`NFL schedule feed failed: ${url}`);
      console.warn(error instanceof Error ? error.message : String(error));
    }
  }
  throw new Error(`All NFL schedule feeds failed. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

const payload = await fetchScoreboard();
const events = payload.events;

const games = events
  .map((event) => {
    const competition = event.competitions?.[0];
    const competitors = competition?.competitors ?? [];
    const home = competitors.find((item) => item.homeAway === "home");
    const away = competitors.find((item) => item.homeAway === "away");
    const homeSlug = TEAM_SLUGS[home?.team?.abbreviation];
    const awaySlug = TEAM_SLUGS[away?.team?.abbreviation];
    if (!homeSlug || !awaySlug || !competition?.date) return null;

    const date = new Date(competition.date);
    const status = event.status?.type?.name ?? "STATUS_SCHEDULED";
    const demand = ["STATUS_IN_PROGRESS", "STATUS_SCHEDULED"].includes(status) ? "Medium" : "Low";
    const reason = status === "STATUS_POSTPONED" ? "Schedule change" : status === "STATUS_CANCELED" ? "Canceled event" : "NFL matchup";

    return {
      id: `espn-${event.id}`,
      home: homeSlug,
      away: awaySlug,
      date: date.toISOString().slice(0, 10),
      time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }).format(date),
      venue: competition.venue?.fullName ?? "",
      city: competition.venue?.address?.city ?? "",
      demand,
      reason,
    };
  })
  .filter(Boolean)
  .filter((game) => game.date >= now.toISOString().slice(0, 10));

games.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

if (games.length < 10) {
  throw new Error(`NFL feed returned only ${games.length} usable future games; refusing to replace the existing schedule.`);
}

const content = `import type { Game } from "./data";\n\n/** Generated automatically by scripts/sync-nfl.mjs. */\nexport const LIVE_NFL_GAMES: Game[] = ${JSON.stringify(games, null, 2)};\n`;
const target = "lib/live-games.ts";
const current = await readFile(target, "utf8").catch(() => "");
if (current === content) {
  console.log(`NFL schedule unchanged (${games.length} games).`);
  process.exit(0);
}
await writeFile(target, content, "utf8");
console.log(`NFL schedule updated: ${games.length} games.`);