from app import CURR_USER_KEY, app
from flask import session
from unittest import TestCase
from models import db, connect_db, User, Team

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///team_builder_test'
app.config['WTF_CSRF_ENABLED'] = False

connect_db(app)

class UserViewsTestCase(TestCase):

    def setUp(self):
        db.drop_all()
        db.create_all()
    
    def tearDown(self):
        db.session.rollback()

    def test_display_home(self):
        with app.test_client() as client:
            res = client.get("/")
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn("<h1>Pokemon Team Builder</h1>", html)
    
    def test_display_register(self):
        with app.test_client() as client:
            res = client.get("/register")
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn("<h1>Register User</h1>", html)

    def test_register_user(self):
        with app.test_client() as client:
            res = client.post("/register", data={"username":"testtest", "password": "testtesttest"}, follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertEqual(session[CURR_USER_KEY],1)
            self.assertIn("<h1>Build Your Pokemon Team</h1>", html)

    def test_display_login(self):
        with app.test_client() as client:
            res = client.get("/login")
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn("<h1>Login User</h1>", html)
    
    def test_login_user(self):
        with app.test_client() as client:
            user = User.register(username="testtest", password="test1234test")
            res = client.post("/login", data={"username":"testtest", "password": "test1234test"}, follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertEqual(session[CURR_USER_KEY],1)
            self.assertIn("<h1>Build Your Pokemon Team</h1>", html)

    def test_logout_user(self):
        with app.test_client() as client:
            res = client.get("/logout", follow_redirects=True)
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code,200)
            self.assertIn("<h1>Pokemon Team Builder</h1>", html)