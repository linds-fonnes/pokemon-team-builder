import os
from flask import Flask, session, g
from db_models.model import connect_db
from db_models.user_model import User
from routes.profile_routes import profile
from routes.teambuilder_routes import builder
from routes.entry_routes import entry

CURR_USER_KEY = "curr_user"

app = Flask(__name__)
app.register_blueprint(profile)
app.register_blueprint(builder)
app.register_blueprint(entry)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    'DATABASE_URL', "postgres:///team_builder_db").replace("://", "ql://", 1)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

app.config['SECRET_KEY'] = os.environ.get(
    "SECRET_KEY", "hfy92kadHgkk29fahjsu3j922v9sjwaucahf")
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

connect_db(app)


@app.before_request
def add_global_user():
    """If logged in, add current user to Flask global"""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])

    else:
        g.user = None


@ app.after_request
def add_header(req):
    """Add non-caching headers on every request."""

    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers['Cache-Control'] = 'public, max-age=0'
    return req
