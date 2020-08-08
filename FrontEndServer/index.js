const Room = require('./room.js');
const User = require('./user.js');
const express = require('express');
//express is being used for FrontEndServer
const socketio = require('socket.io');
const http = require('http');

const {addUser, removeUser, getUser, getUsersInRoom, generateRoomID} = require('./groups');
const PORT = process.env.PORT || 5000;
console.log(PORT)

const router = require('./router');
const { disconnect } = require('process');

const app = express();

const server = http.createServer(app);

const io = socketio(server);

var roomList = {};



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
    //is name exists in the roomList
    //socket.emit('error', {error: "Name is already taken"})
      if (roomList[room].uniqueName(name)) {
        socket.join(room);
        if(roomList[room].inGame === false){
        const user = new User(name);
        roomList[room].userList.push(user);
        let members = roomList[room].userList.map(({name}) => name);
        io.in(room).emit('waiting-info', {roomID: room, members: members});
        }
        else{
          const user = new User(name);
          roomList[room].waitingRoom.push(user)
          let members = roomList[room].userList.map(({name}) => name);
          socket.emit('waiting-info', {roomID: room, members: members})
        }
      } else {
        socket.emit('error1', {error: "Name is already taken"});
      }
    } else {
        socket.emit('error1', {error: 'no room found'});
      }
    
  });

  socket.on('start_game' , function({room}) { //will be reused for anytime
    /* @Sid */
    if (roomList[room]) {
      roomList[room].userList = Room.randomizeList(roomList[room].userList);
      roomList[room].inGame = true
      io.in(room).emit('start', {start: true});
    }
  });

  socket.on('requestPrompt', function({room}) {
    if (roomList[room].isNextQuestion()) {
      let user = roomList[room].getNextPlayer().name;
      let phrase = roomList[room].getRandomQuestion();
      let question = phrase.first;
      question = question.concat(user, phrase.second)
      roomList[room].resetResponses();
      roomList[room].rounds--;
      io.in(room).emit('sentPrompt', {question: question});
    }
  });

 socket.on('submitAnswer' , ({room, name, answer, disconnect}) => {submitAnswer(room, name, answer, disconnect)});

 function submitAnswer(room, name, answer, disconnect) {
  if (!disconnect) {
   roomList[room].userList.find((user) => user.name === name).answer = answer;
   roomList[room].answers++;
  }
  if (roomList[room].answers == roomList[room].userList.length) {
    answerInfo = Room.randomizeList(roomList[room].userList.map(user => ({id: user.id, answer: user.answer})));
    io.in(room).emit('displayAnswers', { answerInfo: answerInfo});
  };
}

 socket.on('chooseAnswer', ({room, userID, disconnect}) => {chooseAnswer(room, userID, disconnect)}); 
 
 function chooseAnswer(room, userID, disconnect) {
   let exit
    if (!disconnect) {
      roomList[room].resetQuestionRequests();
      roomList[room].userList.find((user) => user.id === userID).points++;
      roomList[room].choices++;
    }
    if (roomList[room].choices == roomList[room].userList.length) {
      roomList[room].choices = 0;
      exit = roomList[room].rounds === 0 ? true: false;
      console.log('exit ', exit);
      io.in(room).emit('displayPoints', {choiceInfo: roomList[room].userList.map(each => ({name: each.name, points: each.points, exit: exit}))});
      exit ? delete roomList[room] : null;
      console.log(roomList)
    };
 };

 socket.on('ready',({room, disconnect}) => {favoriteAnswerChoice(room, disconnect)});
 
 function favoriteAnswerChoice(room, disconnect) {
  if (!disconnect) {
    roomList[room].player_ready++;
  }
  if(roomList[room].player_ready === roomList[room].userList.length)
  {
   roomList[room].player_ready = 0
   if(roomList[room].waitingRoom.length){
     roomList[room].userList.concat(roomList[room].waitingRoom);
     roomList[room].waitingRoom = [];
   }
   io.in(room).emit('next_question', {start: true});
  }
}

 socket.on('remove_user', function({roomID, name, part}) {   
   if (roomList[roomID]) {
    roomList[roomID].userList.splice(roomList[roomID].userList.findIndex((user) => user.name === name), 1);
    // roomList[roomID].userList.length ? null : delete roomList[roomID];
    if (roomList[roomID].userList.length <= 0) {
      delete roomList[roomID];
      console.log(roomList);
      return;
    }
    console.log(roomList);
    switch (part) {
      case 'waiting':
        let members = roomList[roomID].userList.map(({name}) => name);
        io.in(roomID).emit('waiting-info', {roomID: roomID, members: members});
        break;
      case 'questions':
        submitAnswer(roomID,'', '', true)
        break;
      case 'answers':
        chooseAnswer(roomID, '', true);
        break;
      case 'points':
        favoriteAnswerChoice(roomID, true);
        break;
      default:
        break;
    }; 
   }
 })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started`));
