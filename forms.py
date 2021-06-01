from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Length

class UserForm(FlaskForm):
    """Form to register a new user"""

    username = StringField("Username")
    password = PasswordField("Password")

