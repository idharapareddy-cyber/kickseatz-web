from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json

app = FastAPI(title="KickSeatz API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = Path(__file__).parent / "data.json"


def load_data():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


@app.get("/")
def root():
    return {"message": "KickSeatz API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/test")
def api_test():
    return {"message": "KickSeatz backend connected"}


@app.get("/api/teams")
def get_teams():
    data = load_data()
    return data["teams"]
@app.get("/api/games")
def get_games():
    data = load_data()

    teams = {
        team["slug"]: team
        for team in data["teams"]
    }

    games = []

    for index, game in enumerate(data["gamePairs"]):
        home, away, date, time, demand, reason = game

        home_team = teams[home]

        games.append({
            "id": f"game-{index + 1}",
            "home": home,
            "away": away,
            "date": date,
            "time": time,
            "venue": home_team["venue"],
            "city": home_team["city"],
            "demand": demand,
            "reason": reason,
        })

    return games