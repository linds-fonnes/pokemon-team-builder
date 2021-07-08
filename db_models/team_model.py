from db_models.model import db


class Team(db.Model):
    """Team Model"""

    __tablename__ = "teams"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    pokemon_ids = db.Column(db.JSON, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=True)

    def __repr__(self):
        return f"< User id {self.user_id}'s team: team id: {self.id}, name: {self.name}, pokemon_ids: {self.pokemon_ids} >"
