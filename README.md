# Pokemon Team Builder

[Pokemon Team Builder](https://pokemon-team-builder1.herokuapp.com/) is a website that allows Pokemon fans (casual or competitive) to create and save Pokemon teams along with viewing the overall team's damage relations. 

There aren't many team builder sites available to begin with, but a commonality with the ones that are available, is that there is not a way to save your teams. This means users have to create a new team every time you access their site, even if it's a team that you replicate frequently. By creating my Pokemon Team Builder, users now have the option to create an account and save their teams for easy reference when needed.

The standard flow of the website is a landing page which give users the options of registering a new account, logging into an existing account, or just jump straight into team building without an account. Once the user is on the team building page, they are able to input a Pokemon name into the search bar. A modal will then pop up displaying the Pokemon's name, types, and base stats. If chosen to be added to the team, it will add a sprite of the pokemon to the team section and the table that show's the overall team's damage relations (resistances, weaknesses, and immunities) will be updated. Once the user is satisfied with their team and the team's strengths & weaknesses, they can save the team to their profile if they are logged in. When the user is logged they can click on their profile page to display a list of all saved team names. By clicking on a team name, it will show the saved team's pokemon sprites and the table of the damage relations. User's also have the option to delete any teams as desired.

The API used for this project was https://pokeapi.co/. Technologies used include Python, Flask, PostgreSQL, SQLAlchemy, JavaScript, HTML, CSS, and Bulma.

If bugs are found, please report them to me at linds.fonnes@gmail.com. 

Pokémon characters and names are copyright © The Pokémon Company and/or Nintendo.
