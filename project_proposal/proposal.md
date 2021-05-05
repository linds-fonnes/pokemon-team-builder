# **Capstone Proposal**

## **Pokemon Team Builder**

### **Goal**

Pokemon Team Builder enables users to be able to both create and save Pokemon teams based off of their types, strengths, and weaknesses.

### **User Demographic**

The typical user is someone who plays Pokemon either casually or competitively on any gaming system. Their reason for using the site is to be able to plan out their teams to better improve their strategy in winning.

### **Data**

The PokeAPI will be the primary source of data, providing details about each Pokemon such as their types, their strengths & weaknesses, and any additional information on that Pokemon such as abilities and stats. Data will also be obtained from the user for a username and password.

### **Approach to building application**

**Database Schema**

-Users  
-Teams FK Users

The database schema will consist of a User which will hold user information such as the username, password, and any saved teams.
The Teams table will include the names and information of each Pokemon that is on the team and the User that the team belongs to.

**Potential API Issues**

Sword and Shield data might be inaccurate and lacking in various aspects due to the fact that it is not taken directly from Nintendo's Pokemon ROMs

**Sensitive Data**

Sensitive information that will need to be secured includes the user’s chosen password.

**Functionality**

- User: registration, login
- Type into search bar to add desired Pokemon to team
- Add up to 6 Pokemon to a team
- Name a created team and save it to profile to future reference
- Ability to edit user's saved teams

**User Flow**

1. Register/Login
2. Page will show form to input up to 6 Pokemon to team
3. As Pokemon are added to team, table will display both the individual Pokemon stats and the team's overall stats so that you can make adjustments accordingly
4. Click on Pokemon once added to team to view additional information on that Pokemon
5. Save team to user's list of teams once satisfied with newly built team
6. Teams page will show all of user's saved teams and option to edit team

**More than CRUD? Any stretch goals?**

- Password reset ability
- Various filters for Pokemon search instead of solely having to type in by name
- Be able to add what moves the Pokemon on your team knows and show total team strength based off of moves and not just types/strengths/weakness
- Make responsive for various screen sizes
