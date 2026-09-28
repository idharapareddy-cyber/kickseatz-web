import json
import re
from pathlib import Path

source = Path("lib/data.ts")
output = Path("backend/data.json")

text = source.read_text(encoding="utf-8")

# -------------------------
# Extract TEAMS
# -------------------------

teams_marker = "export const TEAMS"
teams_start = text.find(teams_marker)

if teams_start == -1:
    raise ValueError("Could not find TEAMS in lib/data.ts")

teams_equals = text.find("=", teams_start)
teams_array_start = text.find("[", teams_equals)

if teams_array_start == -1:
    raise ValueError("Could not find TEAMS array")

depth = 0
teams_array_end = None

for i in range(teams_array_start, len(text)):
    if text[i] == "[":
        depth += 1
    elif text[i] == "]":
        depth -= 1

        if depth == 0:
            teams_array_end = i + 1
            break

if teams_array_end is None:
    raise ValueError("Could not find end of TEAMS array")

teams_text = text[teams_array_start:teams_array_end]
teams_text = re.sub(r",\s*]", "]", teams_text)

teams = json.loads(teams_text)

team_objects = []

for team in teams:
    team_objects.append({
        "slug": team[0],
        "name": team[1],
        "city": team[2],
        "abbr": team[3],
        "division": team[4],
        "venue": team[5],
        "state": team[6],
        "color": team[7],
    })


# -------------------------
# Extract gamePairs
# -------------------------

games_marker = "const gamePairs"
games_start = text.find(games_marker)

if games_start == -1:
    raise ValueError("Could not find gamePairs in lib/data.ts")

games_equals = text.find("=", games_start)
games_array_start = text.find("[", games_equals)

if games_array_start == -1:
    raise ValueError("Could not find gamePairs array")

depth = 0
games_array_end = None

for i in range(games_array_start, len(text)):
    if text[i] == "[":
        depth += 1
    elif text[i] == "]":
        depth -= 1

        if depth == 0:
            games_array_end = i + 1
            break

if games_array_end is None:
    raise ValueError("Could not find end of gamePairs array")

games_text = text[games_array_start:games_array_end]

# Convert TypeScript-style object keys into JSON-compatible keys.
games_text = re.sub(r"([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', games_text)

# Remove trailing commas.
games_text = re.sub(r",\s*]", "]", games_text)
games_text = re.sub(r",\s*}", "}", games_text)

game_pairs = json.loads(games_text)


# -------------------------
# Save backend data
# -------------------------

output.write_text(
    json.dumps(
        {
            "teams": team_objects,
            "gamePairs": game_pairs,
        },
        indent=2,
    ),
    encoding="utf-8",
)

print(f"Created {output}")
print(f"Teams converted: {len(team_objects)}")
print(f"Game pairs converted: {len(game_pairs)}")