from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()


def connect_db(app):
    db.app = app
    db.init_app(app)


class User(db.Model):
    """User Model"""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(100), nullable=False, unique=True)

    password = db.Column(db.String(100), nullable=False)

    teams = db.relationship("Team", backref="user")

    def __repr__(self):
        return f"<User #{self.id}: {self.username}"

    @classmethod
    def register(cls, username, password):
        """Register a new user"""

        hashed_pwd = bcrypt.generate_password_hash(password).decode("UTF-8")

        user = User(
            username=username,
            password=hashed_pwd
        )

        db.session.add(user)
        return user

    @classmethod
    def authenticate(cls, username, password):
        """Finder user with 'username' and 'password'"""

        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False


class Team(db.Model):
    """Team Model"""

    __tablename__ = "teams"

    id = db.Column(db.Integer, primary_key=True)
    pokemon_ids = db.Column(db.JSON, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=True)

    def __repr__(self):
        return f"<{self.user_id}'s team: team #{self.id}, pokemon {self.pokemon_ids} >"
