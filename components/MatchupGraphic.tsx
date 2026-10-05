import type { Game } from "../lib/data";
import { TEAMS } from "../lib/data";

type Player = { name: string; team: string; image: string };

const players: Player[] = [
  { name: "Patrick Mahomes", team: "kansas-city-chiefs", image: "https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png" },
  { name: "Josh Allen", team: "buffalo-bills", image: "https://a.espncdn.com/i/headshots/nfl/players/full/3918298.png" },
  { name: "Lamar Jackson", team: "baltimore-ravens", image: "https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png" },
  { name: "Joe Burrow", team: "cincinnati-bengals", image: "https://a.espncdn.com/i/headshots/nfl/players/full/3915511.png" },
  { name: "Dak Prescott", team: "dallas-cowboys", image: "https://a.espncdn.com/i/headshots/nfl/players/full/2577417.png" },
  { name: "Jalen Hurts", team: "philadelphia-eagles", image: "https://a.espncdn.com/i/headshots/nfl/players/full/4040715.png" },
];

const marqueePairs: [string, string][] = [
  ["kansas-city-chiefs", "buffalo-bills"],
  ["baltimore-ravens", "cincinnati-bengals"],
  ["dallas-cowboys", "philadelphia-eagles"],
];

function getTeam(slug: string) {
  return TEAMS.find((team) => team.slug === slug);
}

function getPlayer(team: string) {
  return players.find((player) => player.team === team);
}

function isPair(game: Game, pair: [string, string]) {
  return (
    (game.away === pair[0] && game.home === pair[1]) ||
    (game.away === pair[1] && game.home === pair[0])
  );
}

export function MatchupGraphic({ game, hero = false }: { game: Game; hero?: boolean }) {
  const away = getTeam(game.away);
  const home = getTeam(game.home);
  if (!away || !home) return null;

  const marquee = marqueePairs.find((pair) => isPair(game, pair));
  const awayPlayer = marquee ? getPlayer(game.away) : undefined;
  const homePlayer = marquee ? getPlayer(game.home) : undefined;

  return (
    <div
      className={`kz-matchup-graphic${hero ? " kz-matchup-graphic-hero" : ""}`}
      style={{ "--away-color": away.color, "--home-color": home.color } as React.CSSProperties}
    >
      <div className="kz-matchup-glow kz-matchup-glow-away" />
      <div className="kz-matchup-glow kz-matchup-glow-home" />
      <div className="kz-matchup-team kz-matchup-team-away">
        {awayPlayer ? <img src={awayPlayer.image} alt={awayPlayer.name} /> : <div className="kz-matchup-logo-fallback">{away.abbr}</div>}
        <div className="kz-matchup-team-label"><strong>{away.abbr}</strong>{awayPlayer && <span>{awayPlayer.name}</span>}</div>
      </div>
      <div className="kz-matchup-center" aria-hidden="true"><span>VS</span></div>
      <div className="kz-matchup-team kz-matchup-team-home">
        {homePlayer ? <img src={homePlayer.image} alt={homePlayer.name} /> : <div className="kz-matchup-logo-fallback">{home.abbr}</div>}
        <div className="kz-matchup-team-label"><strong>{home.abbr}</strong>{homePlayer && <span>{homePlayer.name}</span>}</div>
      </div>
      <div className="kz-matchup-bottom"><span>{away.name}</span><i>vs</i><span>{home.name}</span></div>
    </div>
  );
}
