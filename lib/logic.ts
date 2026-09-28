import { Game, SeatArea, Ticket, teamBySlug } from "./data";

export type Preferences = {
  favoriteTeam: string;
  budget: number;
  ticketCount: number;
  seatArea: SeatArea | "Any";
  priority: "Best Overall Value" | "Lowest Price" | "Best Game";
  fanType: string;
  radius: number;
  homeAway?: "Either" | "Home" | "Away";
  location?: string;
};

export const DEFAULT_PREFERENCES: Preferences = {
  favoriteTeam: "kansas-city-chiefs",
  budget: 150,
  ticketCount: 2,
  seatArea: "Any",
  priority: "Best Overall Value",
  fanType: "Big game",
  radius: 500,
  homeAway: "Either",
  location: "",
};

export function profileGameScore(game: Game, prefs: Preferences) {
  let score = 50;
  if (game.home === prefs.favoriteTeam || game.away === prefs.favoriteTeam) score += 28;
  if (game.demand === "Premium") score += prefs.fanType === "Big game" ? 12 : 3;
  if (game.reason.toLowerCase().includes("rivalry") && prefs.fanType === "Rivalry atmosphere") score += 10;
  if (game.away === prefs.favoriteTeam) score += 2;
  if (prefs.homeAway === "Home" && game.home !== prefs.favoriteTeam) score -= 12;
  if (prefs.homeAway === "Away" && game.away !== prefs.favoriteTeam) score -= 8;
  if (prefs.radius <= 250) score += game.city.toLowerCase().includes((prefs.location || "").toLowerCase()) ? 8 : 0;
  if (prefs.radius >= 1000) score += 2;
  return Math.max(0, Math.min(99, score));
}

export function personalizedGames(games: Game[], prefs: Preferences) {
  return [...games].sort((a,b) => profileGameScore(b,prefs) - profileGameScore(a,prefs));
}

export function personalizedTickets(tickets: Ticket[], prefs: Preferences) {
  return tickets
    .filter(t => t.quantity >= prefs.ticketCount)
    .filter(t => prefs.seatArea === "Any" || t.seatArea === prefs.seatArea)
    .map(t => {
      const favoriteBoost = t.home === prefs.favoriteTeam ? 10 : t.away === prefs.favoriteTeam ? 8 : 0;
      const budgetBoost = t.price <= prefs.budget ? 10 : -Math.min(18, Math.round((t.price - prefs.budget) / 4));
      const priorityBoost = prefs.priority === "Lowest Price" ? Math.max(0, 18 - Math.round(t.price / 15)) : prefs.priority === "Best Game" ? (t.score >= 90 ? 10 : 4) : t.score / 10;
      return { ...t, profileScore: Math.max(0, Math.min(100, t.score + favoriteBoost + budgetBoost + priorityBoost)) };
    })
    .sort((a,b) => b.profileScore - a.profileScore);
}

export function explainTicket(ticket: Ticket, prefs: Preferences) {
  const reasons: string[] = [];
  if (ticket.price <= prefs.budget) reasons.push(`It fits your ${prefs.budget.toLocaleString()} USD budget.`);
  if (ticket.home === prefs.favoriteTeam) reasons.push(`It is a home game for your favorite team.`);
  else if (ticket.away === prefs.favoriteTeam) reasons.push(`Your favorite team is the visitor.`);
  if (prefs.seatArea === "Any" || ticket.seatArea === prefs.seatArea) reasons.push(`The seat area matches your preference.`);
  reasons.push(ticket.valueNote + ".");
  return reasons.slice(0,3);
}

export function stadiumDistanceHint(game: Game, prefs: Preferences) {
  const team = teamBySlug(game.home);
  if (!team) return "Location not set";
  if (prefs.radius >= 1000) return "Within your broad travel range";
  if (team.state === "GA") return "Nearby option";
  if (prefs.radius >= 500) return "Potential road-trip option";
  return "Likely outside your current range";
}
