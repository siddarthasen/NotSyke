const express = require('express');
//express is being used for FrontEndServer
const socketio = require('socket.io');
const http = require('http');
var questions = require('./questions/questions.json')

const {addUser, removeUser, getUser, getUsersInRoom, generateRoomID} = require('./groups');
const PORT = process.env.PORT || 5000;
console.log(PORT)

const router = require('./router');

const app = express();

const server = http.createServer(app);

const io = socketio(server);

var roomList = {};

class Room {
  constructor() {
    this.userList = [];
    this.choiceList = {};
    this.answers = 0;
    this.choices = 0;
    this.player_num = -1;
  }

  /* @Sid */
  getNextPlayer() {
    this.player_num += 1
    this.player_num == this.player_num % this.userList.length;
    return this.userList[this.player_num];
  }

  /* @Sid */
  static randomizeList(lst) {
    let temp, newList
    temp = Array.from(lst);
    newList = [];
    while (temp.length != 0) {
      newList.push(temp.splice(Math.floor(Math.random() * Math.floor(temp.length)), 1)[0]);
    }
    return newList;
  }
}

class User {
  constructor(name) {
    this.name = name;
    this.points = 0;
    this.answer = '';
    this.id = generateRoomID().toString(); //used for checking which user was picked 
    this.done = false; //used to check whether all parties have answered
  }
};

io.on('connection', function(socket) {

  socket.on('join', function({type, name, room}) {
    // name = name.trim().toLowerCase();
    if (type === 'Create') {
      room = generateRoomID().toString()
      while(roomList.hasOwnProperty(room)) {
        room = generateRoomID().toString()
      }
      socket.join(room);
      const roomObj = new Room(); //contains info about the room; the key is still room id
      roomList[room] = roomObj
      roomObj.userList.push(new User(name));
      let members = roomList[room].userList.map(({name}) => name);
      socket.emit('waiting-info', {roomID: room, members: members});

    }
    else if (roomList.hasOwnProperty(room)) {
      socket.join(room);
      const user = new User(name);
      roomList[room].userList.push(user);
      let members = roomList[room].userList.map(({name}) => name);
      io.in(room).emit('waiting-info', {roomID: room, members: members});
    }
  });

  socket.on('start_game' , function({room}) { //will be reused for anytime
    /* @Sid */
    roomList[room].userList = Room.randomizeList(roomList[room].userList);
    io.in(room).emit('start', {start: true});
  });

  socket.on('requestPrompt', function({room}) {
    //if(answer for each user is not empyy)-> clear it
    console.log(Math.floor(Math.random() * 10))
    // let user = roomList[room].userList[(Math.floor(Math.random() * 100) % (roomList[room].userList.length - 1))].name
    let user = roomList[room].getNextPlayer.name;
    let random = (Math.floor(Math.random() * 100) % 100) - 1
    let phrase = questions.questions[38]
    let question = phrase.first
    console.log(user)
    question = question.concat(user, phrase.second)
    console.log('questions ', question);
    roomList[room].answers = 0
    roomList[room].choices = 0
    io.in(room).emit('sentPrompt', {question: question});
  });

 socket.on('submitAnswer' , function({room, name, answer}) {
  roomList[room].userList.find((user) => user.name === name).answer = answer;
   roomList[room].answers++;
   console.log(roomList[room].answers)
   if (roomList[room].answers == roomList[room].userList.length) {

    /* @Sid */
     answerInfo = Room.randomizeList(roomList[room].userList.map(user => ({id: user.id, answer: user.answer})));
     io.in(room).emit('answers', { answerInfo: answerInfo});
   };
 });

 socket.on('sendChoice', function({room, userID}) {
  roomList[room].userList.find((user) => user.id === userID).points++;
  roomList[room].choices++;
  if (roomList[room].choices == roomList[room].userList.length) {
    roomList[room].choices = 0
    io.in(room).emit('choices', {choiceInfo: roomList[room].userList.map(each => ({name: each.name, points: each.points}))});
   };
 })

 socket.on('ready', function({room}) {
   roomList[room].choices++
   if(roomList[room].choices === roomList[room].userList.length)
   {
    roomList[room].choices = 0
    io.in(room).emit('next_question', {start: true});
   }
 })

 /*  On PLAYER-DISCONNECT, we remove the NAME in the list of members 
    from the particular room. Then we emit the updated member list. 
    We are broadcasting to send the updated member list everyone except the 
    disconnected user @Sid. */
//  socket.on('disconnect' {
//     //  temp.splice(temp.indexOf(name), 1);
//     //  io.broadcast.emit('removal-update', {members: roomList[roomID]}); 
//  })

 socket.on('remove_user', function({roomID, name, type, page}) {
   // we need the type of user (creator or joiner) 
   // if a joiner leaves, then process normal, decrerase the num of players, 
   // and then use the page var to act accordingly
        //check if they r on the waiting(user)page
        //check if they r on waiting page for submitting answers
        //or on the waiting page for best choice answer
        // also on the page where they havr to submit an answer
   //if a creator leaves, u have to set another user to be a creator
   console.log(roomID, name)
  let temp = roomList[roomID];
  roomList[roomID].userList.splice(roomList[room].userList.find((user) => user.name === name), 1)
  let members = roomList[roomID].userList.map(({name}) => name);
    io.in(room).emit('waiting-info', {roomID: room, members: members});
 })
});

//handle

app.use(router);

server.listen(PORT, () => console.log(`Server has started`));