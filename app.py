from flask.helpers import make_response
import requests
from flask import Flask, request, redirect, render_template, flash, redirect, session, g, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from secret import secret_key
from models import db, connect_db, User, Team
from forms import UserForm
from helpers import getPokemonData, getDamageRelations

CURR_USER_KEY = "curr_user"

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///team_builder_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

app.config['SECRET_KEY'] = secret_key
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

connect_db(app)
db.create_all()


@app.before_request
def add_global_user():
    """If logged in, add current user to Flask global"""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])
        print(g.user)
        print(session[CURR_USER_KEY])

    else:
        g.user = None


def login_user(user):
    """Login user"""
    session[CURR_USER_KEY] = user.id


def logout_user():
    """Logout user"""
    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]


@app.route("/")
def home_page():
    """Display home page"""
    if g.user:
        return redirect("/team_builder")
    return render_template("home.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Registers a new user: allowing user to have ability to save teams"""

    form = UserForm()

    if form.validate_on_submit():
        try:
            user = User.register(username=form.username.data,
                                 password=form.password.data)
            db.session.commit()
        except IntegrityError:
            flash("Username unavailable")
            return render_template("register.html", form=form)

        login_user(user)
        return redirect("/team_builder")

    else:
        return render_template("register.html", form=form)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Logins an existing user: allowing user to have ability to save teams"""
    form = UserForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data, form.password.data)

        if user:
            login_user(user)
            return redirect("/team_builder")

        flash("Username or password not valid")

    return render_template("login.html", form=form)


@app.route("/logout")
def logout():
    """Logouts user and redirect to main page"""
    logout_user()
    return redirect("/")


@app.route("/profile")
def display_user_profile():
    """Allows user to view their saved teams on their profile page"""
    if g.user is None:
        flash("Please sign into your account to view your profile")
        return redirect("/")
    user = g.user
    return render_template("profile.html", teams=user.teams)


@app.route("/profile/<int:team_id>")
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
        data["data"].append(relations)

    return render_template("team_details.html", team_data=team_data, team=team, data=data)


@app.route("/profile/<int:team_id>/delete", methods=["GET", "DELETE"])
def delete_team(team_id):
    """Deletes a team from db"""
    if g.user is None:
        flash("Please sign into your account to delete your team")
        return redirect("/")

    team = Team.query.get_or_404(team_id)
    db.session.delete(team)
    db.session.commit()
    return redirect("/profile")


@app.route("/team_builder")
def display_page():
    """Displays team building page"""
    return render_template("build_team.html")


@app.route("/team_builder/search_pokemon", methods=["POST"])
def search_pokemon():
    """Handle search request for a specific Pokemon"""
    name = request.json["name"]
    data = getPokemonData(name)
    return make_response(jsonify(data), 200)


@app.route("/team_builder/damage_relations", methods=["POST"])
def get_damage_relations():
    team_data = request.json["data"]

    data = {"data": []}
    for pokemon in team_data:
        relations = getDamageRelations(pokemon["types"])
        data["data"].append(relations)
    return make_response(jsonify(data), 200)


@ app.route("/team_builder/save_team", methods=["POST"])
def save_team():
    """Saves team to db associated with user"""
    try:
        team_data = request.json["data"]
        team = []
        for pokemon in team_data:
            team.append(pokemon["id"])
        name = request.json["team_name"]
        new_team = Team(name=name, pokemon_ids=team, user_id=g.user.id)
        db.session.add(new_team)
        db.session.commit()
        return make_response(jsonify({"message": "Team saved successfully"}), 200)
    except:
        return make_response(jsonify({"message": "Input is required"}), 400)


@ app.after_request
def add_header(req):
    """Add non-caching headers on every request."""

    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers['Cache-Control'] = 'public, max-age=0'
    return req
