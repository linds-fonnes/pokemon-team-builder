import requests

URL = "https://pokeapi.co/api/v2"


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
    request = requests.get(f"{URL}/pokemon/{name}")
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
        request = requests.get(f"{URL}/type/{type}/")
        response = {
            "type": type,
            "weak_against": getWeakness(request),
            "immune_to": getImmuneTo(request),
            "resists": getResist(request)
        }
        damage_relations["damage_relations"].append(response)
    return damage_relations


def calculateDualTypeDamageRelations(relations):
    """calculation for dual type pokemon's damage relations. when a single pokemon has two types, the resistances/weaknesses/immunities often overlap and it has to be calculated which ones will cancel each other out. if there is overlap between weakness-resists they cancel each other out.if there is overlap between an immunity with a weakness/resist it only counts as an immunity makes sure not to double count if there are two of the same resists/immunities/weaknesses - will only count for one of them"""
    temp_weaknesses = []
    temp_resistances = []
    temp_immunities = []
    # for each type of current pokemon push weakness, into a single list
    for type in relations:
        for weakness in relations[type]:
            for val in weakness["weak_against"]:
                temp_weaknesses.append(val)

    # for each type of current pokemon, push immunities into single list
    for type in relations:
        for immunity in relations[type]:
            for val in immunity["immune_to"]:
                temp_immunities.append(val)

    # for each type of current pokemon, push resistances into a single list
    for type in relations:
        for resistance in relations[type]:
            for val in resistance["resists"]:
                temp_resistances.append(val)

    # print("TEMP LISTS", temp_immunities, temp_weaknesses, temp_resistances)
    # filter through the weakness and immunities and return only the type names that aren't in the immunity list
    new_weaknesses = list(filter(
        (lambda x: x not in temp_immunities), temp_weaknesses))

    # filter through the resistances and immunities and return only the type names that aren't in immunity list
    new_resistances = list(filter(
        (lambda x: x not in temp_immunities), temp_resistances))

    # filter through new resistances list and new weaknesses list and remove any overlaps from the new resistance list
    final_resistances = list(
        filter((lambda x: x not in new_weaknesses), new_resistances))
    final_weaknesses = list(
        filter((lambda x: x not in new_resistances), new_weaknesses))

    immune = list(set(temp_immunities))
    weaknesses = list(set(final_weaknesses))
    resist = list(set(final_resistances))

    return {"damage_relations": [{"weak_against": weaknesses, "resists": resist, "immune_to": immune}]}
