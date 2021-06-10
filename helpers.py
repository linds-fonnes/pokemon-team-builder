import requests


def getStats(req):
    stats = []
    for stat in req.json()["stats"]:
        stat_name = (stat["stat"]["name"])
        base_stat = (stat["base_stat"])
        pair = {"stat_name": stat_name, "base_stat": base_stat}
        stats.append(pair)
    return stats


def getTypes(req):
    types = []
    for type in req.json()["types"]:
        types.append(type["type"]["name"])
    return types


def getPokemonData(name):
    """Retrieves data for searched Pokemon"""
    request = requests.get(f"https://pokeapi.co/api/v2/pokemon/{name}")
    response = {
        "id": request.json()["id"],
        "name": request.json()["name"],
        "image": request.json()["sprites"]["other"]["dream_world"]["front_default"],
        "sprite": request.json()["sprites"]["front_default"],
        "stats": getStats(request),
        "types": getTypes(request)
    }
    return response
