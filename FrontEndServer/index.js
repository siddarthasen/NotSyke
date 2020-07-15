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

var roomList = {}
class User {
  constructor(name) {
    this.name = name
    this.points = 0;
    this.answer = ''
  }
}

io.on('connection', function(socket) {

  socket.on('join', function({type, name, room}) {
    name = name.trim().toLowerCase();
    if (type === 'Create') {
      room = generateRoomID().toString()
      while(roomList.hasOwnProperty(room)) {
        room = generateRoomID().toString()
      }
      socket.join(room);
      roomList[room] = []
      const user = new User(name)
      roomList[room].push(user)
      let members = roomList[room].map(({name}) => name)
      socket.emit('waiting-info', {roomID: room, members: members});
    }
    else if (roomList.hasOwnProperty(room)) {
      socket.join(room);
      const user = new User(name)
      roomList[room].push(user)
      let members = roomList[room].map(({name}) => name)
      io.in(room).emit('waiting-info', {roomID: room, members: members});
    }
  });

  socket.on('requestPrompt', function({room}) {
    //if(answer for each user is not empyy)-> clear it
    name = "Parshva"
    var question = `If ${name} was a 10 yr old, what would he play with?`
    io.in(room).emit('sentPrompt', {question: question});
  });

  socket.on('start_game' , function({room}) {
    io.in(room).emit('start', {start: true});
  });

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

 socket.on('submitAnswer' , function({room, name, answer}) {
   let user;
   for(i in roomList[room])
   {
     if(name === roomList[room][i].name)
     {
      roomList[room][i].answer = answer
     }
     console.log("The user is" , roomList[room][i].name)
     console.log("The user is" + roomList[room])
   }
   for(var i=0; i< roomList[room].length; i++)
   {
     console.log(roomList[room][i])
     if(roomList[room][i].answer === '')
     {
       break
     }
     if(i ===roomList[room].length-1)
     {
       //have to push answers here otherwise it might conflict with other rooms
       let answers = []
       for(i in roomList[room])
       {
         answers.push(roomList[room][i].answer)
       }
       io.in(room).emit('answers', {answers: answers});
       console.log("All answers r completed")

     }
   }
   console.log("ROOM IS" + room, "NAME IS", name, answer)
   //push the answe in the array and then check whetherall the answers have been submitted
   //if so, emit the function which release all the answers in the array and then clear
   //forgot we also need the user's name as well
 })

 socket.on('send_choice', function({room, name, choice}) {
   for(i in roomList[room])
   {
     if(choice === roomList[room][i].answer)
     {
       roomList[room][i].points += 1
     }
   }
 })

})

app.use(router);

server.listen(PORT, () => console.log(`Server has started`));