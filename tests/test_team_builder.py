from app import CURR_USER_KEY, app
from flask import session, jsonify
from unittest import TestCase
from models import db, connect_db, User, Team

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///team_builder_test'
app.config['WTF_CSRF_ENABLED'] = False

connect_db(app)

class TeamBuilderViewsTestCase(TestCase):

    def setUp(self):
        db.drop_all()
        db.create_all()

        self.user= User(id=9999, username="testuser",password="HASHED_PASSWORD")
        self.user_id = self.user.id
        db.session.add(self.user)
        db.session.commit()
    
    def tearDown(self):
        db.session.rollback()
    
    def test_display_tb(self):
        with app.test_client() as client:
            
            res = client.get("/team_builder")
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn("<h1>Build Your Pokemon Team</h1>",html)

    def test_search_pokemon(self):
        with app.test_client() as client:

            res = client.post("/team_builder/search_pokemon", json={"name": "charizard"})
            data = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertTrue(data)
    
    def test_damage_relations(self):
        with app.test_client() as client:
            
            res = client.post("/team_builder/damage_relations", json={"data": [{"types": ["fire"]}]})
            data = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertTrue(data)

    
    def test_save_team(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session[CURR_USER_KEY] = self.user_id

            res = client.post("/team_builder/save_team", json={"data": [{"id": 1}], "team_name": "test_team"})
            data = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn('{"message":"Team saved successfully"}', data)

    def test_save_nameless_team(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session[CURR_USER_KEY] = self.user_id
            
        res = client.post("/team_builder/save_team", json={"data": [{"id": 1}], "team_name": None})
        data = res.get_data(as_text=True)    

        self.assertEqual(res.status_code,400)
        self.assertIn('{"message":"Input is required"}', data)