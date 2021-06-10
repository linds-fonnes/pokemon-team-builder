from flask.helpers import make_response
import requests
from flask import Flask, request, redirect, render_template, flash, redirect, session, g, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from secret import secret_key
from models import db, connect_db, User, Team
from forms import UserForm, PokemonForm
from helpers import getPokemonData
import pokepy

CURR_USER_KEY = "curr_user"
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///team_builder_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

app.config['SECRET_KEY'] = secret_key
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)
connect_db(app)
db.create_all()


@app.before_request
def add_global_user():
    """If logged in, add current user to Flask global"""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

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
        return redirect("/")

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
            return redirect("/teambuilder")

        flash("Username or password not valid")

    return render_template("login.html", form=form)


@app.route("/logout")
def logout():
    """Logouts user and redirect to main page"""
    logout_user()
    return redirect("/")


@app.route("/profile")
def user_profile():
    """Allows user to view their saved teams on their profile page"""
    return render_template("profile.html")


@app.route("/teambuilder")
def display_page():
    """Displays team building page"""
    return render_template("build_team.html")


@app.route("/search_pokemon", methods=["POST"])
def search_pokemon():
    """Handle search request for a specific Pokemon"""
    name = request.json["name"]
    data = getPokemonData(name)
    return make_response(jsonify(data), 200)


@app.route("/add_pokemon", methods=["POST"])
def add_pokemon():
    """Adds a pokemon to a team"""
