from werkzeug.utils import validate_arguments
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length


class UserForm(FlaskForm):
    """Form to register a new user"""

    username = StringField("Username", validators=[DataRequired(), Length(
        min=6, message="Username must be at least 6 characters")])
    password = PasswordField("Password", validators=[DataRequired(), Length(
        min=8, message="Password must be at least 8 characters")])
