from flask import Blueprint
from flask import redirect, render_template, flash, redirect, g
from db_models.team_model import db, Team
from pokemon_data import getPokemonData, getDamageRelations, calculateDualTypeDamageRelations

profile = Blueprint("profile", __name__)


@profile.route("/profile")
def display_user_profile():
    """Allows user to view their saved teams on their profile page"""
    if g.user is None:
        flash("Please sign into your account to view your profile")
        return redirect("/")
    user = g.user
    return render_template("profile.html", teams=user.teams)


@profile.route("/profile/<int:team_id>")
def display_team(team_id):
    """Displays a saved team's details"""
    if g.user is None:
        flash("Please sign into your account to view your team")
        return redirect("/")
    team = Team.query.get_or_404(team_id)
    # allows us to display each pokemon's sprite
    team_data = []
    for id in team.pokemon_ids:
        team_data.append(getPokemonData(id))
    # obtains damage relations for each pokemon on the team
    data = {"data": []}
    for pokemon in team_data:
        relations = getDamageRelations(pokemon["types"])
        if len(pokemon["types"]) > 1:
            relations = calculateDualTypeDamageRelations(relations)
        data["data"].append(relations)

    return render_template("team_details.html", team_data=team_data, team=team, data=data)
    


@profile.route("/profile/<int:team_id>/delete", methods=["GET", "DELETE"])
def delete_team(team_id):
    """Deletes a team from db"""
    if g.user is None:
        flash("Please sign into your account to delete your team")
        return redirect("/")

    team = Team.query.get_or_404(team_id)
    db.session.delete(team)
    db.session.commit()
    return redirect("/profile")
