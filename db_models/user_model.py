from db_models.model import db
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()


class User(db.Model):
    """User Model"""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(100), nullable=False, unique=True)

    password = db.Column(db.String(100), nullable=False)

    teams = db.relationship("Team", backref="user")

    def __repr__(self):
        return f"<User #{self.id}: {self.username}>"

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
