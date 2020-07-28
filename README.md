A multiplayer online game that allows friends to answer interesting questions about each other. The idea came about when my friends and I were bored during the COVID pandemic, and we needed a game to keep us occupied. I decided to take the lead and build this app using a Node.js backend, and a React.js frontend. Socket.io was also used to connect multiple players in a room, and Express.js was the framework for connecting all the respective parts of the app. The app is currently in the beta testing phase, where I am tweaking all the minor bugs and UI complications. Node.js backend is actively running on an AWS EC2 instance.

Stack:
In order to built out our app, we decided to build a React.js frontend with a node.js backend. We used Express.js to 


Waiting.JPG //waiting for players
ShownAnswrs.JPG // list of shown answers
score.JPG // shows scores of users after eveyrone pica thier fav
Question.JPG //self-explantory
Home.JPG //home page

Start of the Game: Home Page
(Insert Home.JPG HERE)
Player chooses between create game or join game option. The host will choose the option called create game, which will take them to the waiting screen. Other players will select the join room option and use a designated room code to join the lobby, upon which they will be taken to the waiting page.

Waiting for Players to Join Page
(Insert Waiting.JPG)
Players who joined the host's room using the designated code will be listed in the box. Players who joined a room will wait until host starts the game. Host will start the game once all players have joined.

Question Page
(Insert QuestionJPG.JPG)
A question will appear on the top of the screen with a random player's name inserted in the question. In the box below, all players will type an answer. Once each player is finished, they can select the submit button to move on to the shown answers page.

Shown Answers Page
(Insert Question.JPG)
A list of answers given by each player will be shown. Each player must select their favorite answer. A message appears if players chose their own answer, and they will be forced to chose another one. Once an answer is selected, the player will be taken to the score page.

Score Page
(insert score.jpg)
Each players name will be listed with a number to the right of their ID, indicating their score. Their score represents how many players selected their answer. Over multiple rounds, the score will accumulate, taking the sum of the previous round with the current round, to display the total score. When the host is ready to start the next game, they can select "Next Question"
