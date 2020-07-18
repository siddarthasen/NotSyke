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
    io.in(room).emit('start', {start: true});
  });

  socket.on('requestPrompt', function({room}) {
    //if(answer for each user is not empyy)-> clear it
    roomList[room].answers = 0
    roomList[room].choice = 0
    name = "Parshva"
    var question = `If ${name} was a 10 yr old, what would he play with?`
    io.in(room).emit('sentPrompt', {question: question});
  });

 socket.on('submitAnswer' , function({room, name, answer}) {
   console.log(name + "answer is" + answer)

   for(i in roomList[room].userList)
   {
     console.log(roomList[room].userList[i].name + " the name passed in is" + name)
     if(name === roomList[room].userList[i].name)
     {
      roomList[room].userList[i].answer = answer;
      roomList[room].answers++;
      break;
     }
   }
   console.log(roomList[room].answers)
   if (roomList[room].answers == roomList[room].userList.length) {
     let answerInfo = []
     roomList[room].userList.forEach(function(member)
     {
        answerInfo.push(
          {
            id: member.id,
            answer: member.answer
          }
        )
     })
     console.log(answerInfo)
    io.in(room).emit('answers', { answerInfo: answerInfo });
   };
 });

 socket.on('sendChoice', function({room, userID}) {
   console.log(room, userID)
   for(i in roomList[room].userList)
   {
     if(roomList[room].userList[i].id === userID)
     {
      roomList[room].userList[i].points++
      roomList[room].choices++;
     }
   }
   if (roomList[room].choices == roomList[room].userList.length) {
    roomList[room].choices = 0
    let finalInfo = []
    roomList[room].userList.forEach(function(member)
    {
       finalInfo.push(
         {
           points: member.points,
           name: member.name
         }
       )
    })
    console.log(finalInfo)
    io.in(room).emit('choices', {choiceInfo: finalInfo} )
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