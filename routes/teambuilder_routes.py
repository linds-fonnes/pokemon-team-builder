from flask import Blueprint
from flask.helpers import make_response
from flask import request, render_template, g, jsonify
from db_models.team_model import db, Team
from pokemon_data import getPokemonData, getDamageRelations, calculateDualTypeDamageRelations

builder = Blueprint("builder", __name__)


@builder.route("/team_builder")
def display_page():
    """Displays team building page"""
    return render_template("build_team.html")


@builder.route("/team_builder/search_pokemon", methods=["POST"])
def search_pokemon():
    """Handle search request for a specific Pokemon"""
    name = request.json["name"]
    data = getPokemonData(name)
    return make_response(jsonify(data), 200)


@builder.route("/team_builder/damage_relations", methods=["POST"])
def get_damage_relations():
    """retrieves damage relations data for each pokemon on team"""
    team_data = request.json["data"]

    data = {"data": []}
    for pokemon in team_data:
        relations = getDamageRelations(pokemon["types"])
        if len(pokemon["types"]) > 1:
            relations = calculateDualTypeDamageRelations(relations)
        data["data"].append(relations)
    return make_response(jsonify(data), 200)


@builder.route("/team_builder/save_team", methods=["POST"])
def save_team():
    """Saves team to db associated with user"""
    name = request.json["team_name"]
    if name:
        try:
            team_data = request.json["data"]
            team = []
            for pokemon in team_data:
                team.append(pokemon["id"])
            new_team = Team(name=name, pokemon_ids=team, user_id=g.user.id)
            db.session.add(new_team)
            db.session.commit()
            return make_response(jsonify({"message": "Team saved successfully"}), 200)
        except:
            return make_response(jsonify({"message": "Error, please try again"}), 400)
    return make_response(jsonify({"message": "Input is required"}), 400)
