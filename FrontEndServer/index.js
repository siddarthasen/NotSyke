const express = require('express');
//express is being used for FrontEndServer
const socketio = require('socket.io');
const http = require('http');

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
    name = name.trim().toLowerCase();
    if (type === 'Create') {
      room = generateRoomID().toString()
      while(roomList.hasOwnProperty(room)) {
        room = generateRoomID().toString()
      }
      socket.join(room);
      const roomObj = new Room();
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

  socket.on('start_game' , function({room}) {
    io.in(room).emit('start', {start: true});
  });

  socket.on('requestPrompt', function({room}) {
    //if(answer for each user is not empyy)-> clear it
    roomList[room].answers = 0;
    roomList[room].choices = 0;
    name = "Parshva"
    var question = `If ${name} was a 10 yr old, what would he play with?`
    io.in(room).emit('sentPrompt', {question: question});
  });

 socket.on('submitAnswer' , function({room, name, answer}) {
   roomList[room][roomList[room].indexOf(name)].answer = answer;
   roomList[room].choiceList;
   roomList[room].answers++;
   if (roomList[room].answers == roomList[room].userList.length) {
    io.in(room).emit('answers', { answerInfo: roomList[room].userList.map(({id, answer}) => {id, answer})});
   };
 });

 socket.on('sendChoice', function({room, name, choice}) {
   roomList[room].choices++;
   roomList[room].userList[roomList[room].userList.indexOf(name)].points;
   if (roomList[room].choices == roomList[room].userList.length) {
    io.in(room).emit('choices', {choiceInfo: roomList[room].userList.map(({id, answer}) => {id, answer})})
   };
 })

 /*  On PLAYER-DISCONNECT, we remove the NAME in the list of members 
    from the particular room. Then we emit the updated member list. 
    We are broadcasting to send the updated member list everyone except the 
    disconnected user @Sid. */
 socket.on('player-disconnect', function({roomID, name}) {
   let temp = roomList[roomID];
   if (temp & temp.length) {
     temp.splice(temp.indexOf(name), 1);
     io.broadcast.emit('removal-update', {members: roomList[roomID]}); 
   }
 })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started`));