
from flask import Flask, request, redirect, render_template, flash, redirect, session, g
from flask_debugtoolbar import DebugToolbarExtension
import secrets
from models import db, connect_db, User, Team


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///team_builder_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
db.create_all()

secret_key = secrets.token_hex(16)
app.config['SECRET_KEY'] = secret_key
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)

@app.route("/")
def home_page():
    """Home Page to Login/Register"""
    return