from app import app
from unittest import TestCase
from models import db, connect_db, User, Team

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///team_builder_test'

db.create_all()

class UserModelTestCase(TestCase):
    def setUp(self):
        User.query.delete()

    def test_user_model(self):
        user = User(id=9999,username="testuser", password="TEST_PASSWORD")
        db.session.add(user)
        db.session.commit()
        
        self.assertEqual(len(user.teams),0)

    def test_register_user(self):
        user = User.register(username="testuser",password="TEST_PASSWORD")

        self.assertTrue(user)
        self.assertEqual(user.__repr__(), "<User #None: testuser>")

    def test_authenticate_user(self):
        user = User.register(username="testuser",password="TEST_PASSWORD")    

        self.assertEqual(User.authenticate("testuser", "TEST_PASSWORD"),user)
        self.assertFalse(User.authenticate("testuser","TEsT_PASSWORD"))
        self.assertFalse(User.authenticate("testUser","TEST_PASSWORD"))

class TeamModelTestCase(TestCase):

    def setUp(self):
        Team.query.delete()
    
    def test_team_model(self):
        team = Team(id=9999,name="test_team",pokemon_ids=[1,2,3,4],user_id=9999)
        db.session.add(team)
        db.session.commit()

        self.assertEqual(team.__repr__(),"< User id 9999's team: team id: 9999, name: test_team, pokemon_ids: [1, 2, 3, 4] >")
    
    

