import type { Game } from "./data";

/**
 * Safe checked-in fallback for the hourly NFL sync.
 *
 * The scheduled GitHub Action normally replaces this file with the current
 * ESPN NFL schedule. The fallback keeps display metadata non-empty so a
 * temporary sync failure never produces broken-looking rows.
 */
export const LIVE_NFL_GAMES: Game[] = [
  ["indianapolis-colts","washington-commanders","2026-10-04","9:30 AM","High","NFL International Series · London"],
  ["tennessee-titans","baltimore-ravens","2026-10-04","1:00 PM","Medium","AFC matchup"],
  ["new-england-patriots","buffalo-bills","2026-10-04","1:00 PM","High","AFC East matchup"],
  ["new-york-jets","chicago-bears","2026-10-04","1:00 PM","Medium","AFC-NFC matchup"],
  ["jacksonville-jaguars","cincinnati-bengals","2026-10-04","1:00 PM","High","AFC matchup"],
  ["dallas-cowboys","houston-texans","2026-10-04","1:00 PM","High","Texas matchup"],
  ["arizona-cardinals","new-york-giants","2026-10-04","1:00 PM","Medium","NFC matchup"],
  ["los-angeles-rams","philadelphia-eagles","2026-10-04","1:00 PM","High","NFC matchup"],
  ["green-bay-packers","tampa-bay-buccaneers","2026-10-04","1:00 PM","High","NFC matchup"],
  ["miami-dolphins","minnesota-vikings","2026-10-04","4:05 PM","Medium","AFC-NFC matchup"],
  ["kansas-city-chiefs","las-vegas-raiders","2026-10-04","4:25 PM","Premium","AFC West rivalry"],
  ["los-angeles-chargers","seattle-seahawks","2026-10-04","4:25 PM","High","AFC-NFC matchup"],
  ["denver-broncos","san-francisco-49ers","2026-10-04","4:25 PM","High","AFC-NFC matchup"],
  ["detroit-lions","carolina-panthers","2026-10-04","8:20 PM","High","Sunday Night Football"],
  ["atlanta-falcons","new-orleans-saints","2026-10-05","8:15 PM","High","Monday Night Football · NFC South"],
  ["tampa-bay-buccaneers","dallas-cowboys","2026-10-08","8:15 PM","High","Thursday Night Football"],
  ["philadelphia-eagles","jacksonville-jaguars","2026-10-11","9:30 AM","High","NFL International Series · London"],
  ["cincinnati-bengals","miami-dolphins","2026-10-11","1:00 PM","Medium","AFC matchup"],
  ["las-vegas-raiders","new-england-patriots","2026-10-11","1:00 PM","Medium","AFC matchup"],
  ["minnesota-vikings","new-orleans-saints","2026-10-11","1:00 PM","Medium","NFC matchup"],
  ["cleveland-browns","new-york-jets","2026-10-11","1:00 PM","Medium","AFC matchup"],
  ["indianapolis-colts","pittsburgh-steelers","2026-10-11","1:00 PM","High","AFC matchup"],
  ["houston-texans","tennessee-titans","2026-10-11","1:00 PM","High","AFC South matchup"],
  ["new-york-giants","washington-commanders","2026-10-11","1:00 PM","High","NFC East matchup"],
  ["chicago-bears","green-bay-packers","2026-10-11","1:00 PM","Premium","NFC North rivalry"],
  ["denver-broncos","los-angeles-chargers","2026-10-11","4:05 PM","High","AFC West matchup"],
  ["detroit-lions","arizona-cardinals","2026-10-11","4:25 PM","Medium","NFC matchup"],
  ["san-francisco-49ers","seattle-seahawks","2026-10-11","4:25 PM","Premium","NFC West rivalry"],
  ["baltimore-ravens","atlanta-falcons","2026-10-11","8:20 PM","High","Sunday Night Football"],
  ["buffalo-bills","los-angeles-rams","2026-10-12","8:15 PM","Premium","Monday Night Football"],
].map(([home, away, date, time, demand, reason], index) => ({
  id: `fallback-game-${index + 1}`,
  home,
  away,
  date,
  time,
  venue: "NFL venue",
  city: "United States",
  demand: demand as Game["demand"],
  reason,
}));
