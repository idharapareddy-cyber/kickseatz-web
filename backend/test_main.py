import unittest

from main import api_test, get_games, get_teams, health


class KickSeatzApiContractTests(unittest.TestCase):
    def test_health_contract(self):
        self.assertEqual(health(), {"status": "ok"})

    def test_api_test_contract(self):
        self.assertEqual(api_test(), {"message": "KickSeatz backend connected"})

    def test_teams_contract(self):
        teams = get_teams()
        self.assertEqual(len(teams), 32)
        slugs = [team["slug"] for team in teams]
        self.assertEqual(len(slugs), len(set(slugs)))
        for team in teams:
            self.assertTrue(team["name"])
            self.assertTrue(team["venue"])
            self.assertTrue(team["city"])

    def test_games_contract(self):
        teams = {team["slug"] for team in get_teams()}
        games = get_games()
        self.assertGreater(len(games), 0)
        ids = [game["id"] for game in games]
        self.assertEqual(len(ids), len(set(ids)))
        for game in games:
            self.assertIn(game["home"], teams)
            self.assertIn(game["away"], teams)
            self.assertTrue(game["date"])
            self.assertTrue(game["time"])
            self.assertTrue(game["venue"])
            self.assertTrue(game["city"])


if __name__ == "__main__":
    unittest.main()
