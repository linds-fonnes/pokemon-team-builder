from helpers import getStats, getTypes, getPokemonData, getWeakness, getImmuneTo, getResist, getDamageRelations
from unittest import TestCase
import requests

class RetrieveDataTestCases(TestCase):

    def test_get_stats(self):
        request = requests.get("https://pokeapi.co/api/v2/pokemon/ditto")
        response = getStats(request)

        self.assertIsInstance(response, list)
        self.assertTrue(response)

    def test_get_types(self):
        request = requests.get("https://pokeapi.co/api/v2/pokemon/ditto")
        response = getTypes(request)

        self.assertIsInstance(response, list)
        self.assertTrue(response)

    def test_get_pkmn_data(self):
        response = getPokemonData("ditto")

        self.assertIsInstance(response, dict)
        self.assertTrue(response)
    
    def test_get_weaknesses(self):
        request = requests.get("https://pokeapi.co/api/v2/type/normal/")
        response = getWeakness(request)

        self.assertIsInstance(response,list)
        self.assertTrue(response)

    def test_get_immunities(self):
        request = requests.get("https://pokeapi.co/api/v2/type/normal/")
        response = getImmuneTo(request)

        self.assertIsInstance(response,list)
        self.assertTrue(response)
    
    def test_get_resistances(self):
        request = requests.get("https://pokeapi.co/api/v2/type/normal/")
        response = getResist(request)

        self.assertIsInstance(response,list)
        self.assertFalse(response)

    def test_get_damage_relations(self):
        response = getDamageRelations(["water","normal"])

        self.assertIsInstance(response,dict)
        self.assertTrue(response)