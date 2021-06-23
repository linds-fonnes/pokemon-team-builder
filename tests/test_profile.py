from app import CURR_USER_KEY, app
from flask import session, g
from unittest import TestCase
from models import db, connect_db, User, Team

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///team_builder_test'
app.config['WTF_CSRF_ENABLED'] = False

connect_db(app)

class ProfileViewsTestCase(TestCase):

    def setUp(self):
        db.drop_all()
        db.create_all()

        self.user= User(id=9999, username="testuser",password="HASHED_PASSWORD")
        self.user_id = self.user.id
        db.session.add(self.user)

        self.team = Team(id=9999, name="test_team", pokemon_ids=[1, 2, 3, 4], user_id=9999)
        self.team_id = self.team.id
        db.session.add(self.team)
        db.session.commit()
    
    def tearDown(self):
        db.session.rollback()

    def test_display_profile(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session[CURR_USER_KEY] = self.user_id
            
            res = client.get("/profile")
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn("<h1>testuser's Teams</h1>", html)

    def test_no_user_profile(self):
        with app.test_client() as client:
            res = client.get("/profile", follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn("<h1>Pokemon Team Builder</h1>",html)

    def test_team_profile(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session[CURR_USER_KEY] = self.user_id
            
            res = client.get(f"/profile/{self.team_id}")
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn("<h1>test_team</h1>", html)
    
    def test_team_no_profile(self):
        with app.test_client() as client:
            res = client.get(f"/profile/{self.team_id}", follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn("<h1>Pokemon Team Builder</h1>",html)
    
    def test_delete_team(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session[CURR_USER_KEY] = self.user_id
            
            res = client.get(f"/profile/{self.team_id}/delete", follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn("<h1>testuser's Teams</h1>",html)
            self.assertNotIn("<a>test_team</a>", html)
    
    def test_delete_team_no_user(self):
        with app.test_client() as client:
            res = client.get(f"/profile/{self.team_id}/delete", follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn("<h1>Pokemon Team Builder</h1>",html)
