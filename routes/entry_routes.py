from flask import Blueprint
from flask import redirect, render_template, flash, redirect, session, g
from sqlalchemy.exc import IntegrityError
from db_models.user_model import db, User
from userform import UserForm


entry = Blueprint("entry", __name__)

CURR_USER_KEY = "curr_user"


def login_user(user):
    """Login user"""
    session[CURR_USER_KEY] = user.id


def logout_user():
    """Logout user"""
    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]


@entry.route("/")
def home_page():
    """Display home page"""
    if g.user:
        return redirect("/team_builder")
    return render_template("home.html")


@entry.route("/register", methods=["GET", "POST"])
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


@entry.route("/login", methods=["GET", "POST"])
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


@entry.route("/logout")
def logout():
    """Logouts user and redirect to main page"""
    logout_user()
    return redirect("/")
