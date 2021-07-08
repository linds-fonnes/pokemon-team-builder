# Pokemon Team Builder

## Description
---
[Pokemon Team Builder](https://pokemon-team-builder1.herokuapp.com/) is a website that allows Pokemon fans (casual or competitive) to create and save Pokemon teams along with viewing the overall team's damage relations. 

There aren't many team builder sites available to begin with, but a commonality with the ones that are available, is that there is not a way to save your teams. This means users have to create a new team every time you access their site, even if it's a team that you replicate frequently. By creating my Pokemon Team Builder, users now have the option to create an account and save their teams for easy reference when needed.

## Usage Example
---
![Gif of Pokemon Team Builder Website Usage](https://media.giphy.com/media/AxgG1OTZluwlL4ubxm/giphy.gif)



## Installation
---
Install [Python](https://www.python.org/downloads/) if not already installed on your machine.

Once the project is cloned onto your own machine and the main directory is open in the terminal, create and activate a virtual environment.

Mac OS:
```
python3 -m venv venv
source venv/bin/activate
```
Windows:
```
python -m venv venv
. venv/Scripts/activate
```

After activation of the virtual environment, install the dependencies that are necessary for the app to run.
```
pip install -r requirements.txt
```
Next, create the PostreSQL database for the users and teams to be saved

```
psql
createdb team_builder_db
```

Now that the dependencies are installed in the virtual environment and the database is created, the server can be started up.

```
flask run
```

## Resources & Technologies
---
- API
https://pokeapi.co/


 - JavaScript
 - HTML
 - CSS
 - Python
 - Flask
 - PostgreSQL
 - SQLAlchemy
 - Bulma
  


---
Pokémon characters and names are copyright © The Pokémon Company and/or Nintendo.
