import requests


def getStats(req):
    """retrieves pokemon's stat names & stat values"""
    stats = []
    for stat in req.json()["stats"]:
        stat_name = (stat["stat"]["name"])
        base_stat = (stat["base_stat"])
        pair = {"stat_name": stat_name, "base_stat": base_stat}
        stats.append(pair)
    return stats


def getTypes(req):
    """Retrieves type/types for pokemon"""
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


def getWeakness(req):
    """Retrieves just the names of what types give double damage  against current pokemon's type aka weakness to those types"""
    names = []
    for relation in req.json()["damage_relations"]["double_damage_from"]:
        names.append(relation["name"])
    return names


def getImmuneTo(req):
    """Retrieves just the names of what types current pokemon is immune to"""
    names = []
    for relation in req.json()["damage_relations"]["no_damage_from"]:
        names.append(relation["name"])
    return names


def getResist(req):
    """Retrives just the names of what types of pokemon only give half damage against current pokemon's type"""
    names = []
    for relation in req.json()["damage_relations"]["half_damage_from"]:
        names.append(relation["name"])
    return names


def getDamageRelations(types):
    """Retrieves damage relations for each type on team"""
    damage_relations = {"damage_relations": []}
    for type in types:
        request = requests.get(f"https://pokeapi.co/api/v2/type/{type}/")
        response = {
            "type": type,
            "weak_against": getWeakness(request),
            "immune_to": getImmuneTo(request),
            "resists": getResist(request)
        }
        damage_relations["damage_relations"].append(response)
    return damage_relations
