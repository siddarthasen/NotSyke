const Room = require('./room.js');
const User = require('./user.js');
const express = require('express');
//express is being used for FrontEndServer
const socketio = require('socket.io');
const http = require('http');

const {addUser, removeUser, getUser, getUsersInRoom, generateRoomID} = require('./groups');
const PORT = process.env.PORT || 5000;

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
      const user = new User(name)
      roomObj.userList.push(user);
      let members = roomList[room].userList.map(({name}) => name);
      socket.emit('user-info', {roomID: room, members: members, waiting: false, userID: user.id});

    }
    else if (roomList.hasOwnProperty(room)) {

      if (roomList[room].uniqueName(name)) {
        socket.join(room);
        if (roomList[room].inGame === false) {
        const user = new User(name);
        roomList[room].userList.push(user);
        let members = roomList[room].userList.map(({name}) => name);
        socket.emit('userID', {userID: user.id})
        socket.emit('user-info', {roomID: room, members: members, waiting: true, userID: user.id})
        io.in(room).emit('waiting-info', {roomID: room, members: members, waiting: false});
        }
        else {
          const user = new User(name);
          roomList[room].waitingRoom.push(user);
          let members = roomList[room].userList.map(({name}) => name);
          let temp = roomList[room].waitingRoom.map(({name}) => name);
          members = members.concat(temp);
          socket.emit('user-info', {roomID: room, members: members, waiting: true, userID: user.id})
        }
      } else {
        socket.emit('error1', {error: "Name is already taken"});
      }
    } else {
        socket.emit('error1', {error: 'No room found'});
      }
    
  });

  socket.on('start_game' , ({room, disconnect}) => {checkWaitingPeople(room, disconnect)}) 
  
  function checkWaitingPeople(room, disconnect){
    try{
        if(!disconnect){
        roomList[room].choices++;
        }
        if (roomList[room] && roomList[room].choices === roomList[room].userList.length) {
          roomList[room].userList = Room.randomizeList(roomList[room].userList);
          roomList[room].inGame = true
          roomList[room].choices = 0
          io.in(room).emit('start', {start: true});
        }
      }
      catch(err){
        console.log(err)
      }
  };

  socket.on('requestPrompt', function({room}) {
    try{
    if (roomList[room].isNextQuestion()) {
      let user = roomList[room].getNextPlayer().name;
      let phrase = roomList[room].getRandomQuestion();
      let question = phrase.first;
      question = question.concat(user, phrase.second)
      roomList[room].resetResponses();
      roomList[room].rounds--;
      for(i in roomList[room].userList){
        roomList[room].userList[i].answer = null
      }
      io.in(room).emit('sentPrompt', {question: question});
    }
    }
    catch(err){
      console.log(err)
    }
  });

 socket.on('submitAnswer' , ({room, name, answer, disconnect}) => {submitAnswer(room, name, answer, disconnect)});

 function submitAnswer(room, name, answer, disconnect) {
   try{
        if (!disconnect) {
          console.log(room, name, answer)
        roomList[room].userList.find((user) => user.name === name).answer = answer;
        roomList[room].answers++;
        }
        if (roomList[room].answers == roomList[room].userList.length) {
          answerInfo = Room.randomizeList(roomList[room].userList.map(user => ({id: user.id, answer: user.answer})));
          io.in(room).emit('displayAnswers', { answerInfo: answerInfo});
        };
      }
    catch(err){
        console.log(err)
      }
}

 socket.on('chooseAnswer', ({room, userID, disconnect}) => {chooseAnswer(room, userID, disconnect)}); 
 
 function chooseAnswer(room, userID, disconnect) {
   try{
      let exit
        if (!disconnect) {
          roomList[room].resetQuestionRequests();
          if(roomList[room].userList.find((user) => user.id === userID)){
            roomList[room].userList.find((user) => user.id === userID).points++;
          }
          roomList[room].choices++;
        }
        if (roomList[room].choices == roomList[room].userList.length) {
          roomList[room].choices = 0;
          exit = roomList[room].rounds === 0 ? true: false;

          io.in(room).emit('displayPoints', {choiceInfo: roomList[room].sortByPoints().map(each => ({name: each.name, points: each.points, answer: each.answer, exit: exit}))});
      }
    }
    catch(err){
      console.log(err)
    }
 };

 socket.on('ready',({room, disconnect, name }) => {favoriteAnswerChoice(room, disconnect, name)});
 
 function favoriteAnswerChoice(room, disconnect, name) {
   try{
      if (!disconnect) {
        console.log(room, disconnect, name)
        roomList[room].player_ready++;
        roomList[room].userList[roomList[room].userList.findIndex((user) => user.name === name)].done = true
      }
      if(roomList[room].player_ready === roomList[room].userList.length)
      {
      roomList[room].player_ready = 0
      for(i in roomList[room].userList){
        roomList[room].userList[i].done = false
      }
      if(roomList[room].waitingRoom.length){
        roomList[room].userList = roomList[room].userList.concat(roomList[room].waitingRoom);
        roomList[room].waitingRoom = [];
      }
      io.in(room).emit('next_question', {start: true});
      }
    }
    catch(err){
      console.log(err)
    }
}

 socket.on('remove_user', function({roomID, name, part}) {  
   try{
    let removeIndex
    if (roomList[roomID]) {
      //  if(roomList[roomID].userList.findIndex((user) => user.name === name) != -1){
      //   removeIndex = roomList[roomID].userList.findIndex((user) => user.name === name)
      //   roomList[roomID].userList.splice(removeIndex, 1);
      //  }
      if(part !== 'waiting'){
        //for the people who r in the wating room, emit who left
        if(roomList[roomID].userList[roomList[roomID].userList.findIndex((user) => user.name === name)].answers !== null && part === 'answers'){
          roomList[roomID].answers--;
        }
        else if(roomList[roomID].userList[roomList[roomID].userList.findIndex((user) => user.name === name)].player_ready === true && part === 'points'){
          roomList[roomID].player_ready--;
        }
        roomList[roomID].userList.splice(roomList[roomID].userList.findIndex((user) => user.name === name), 1);
      }
      roomList[roomID].userList.length || roomList[roomID].waitingRoom.length ? null : delete roomList[roomID];
      switch (part) {
        case 'waiting':
          if (roomList[roomID].userList.findIndex((user) => user.name === name) >= 0) {
            roomList[roomID].userList.splice(roomList[roomID].userList.findIndex((user) => user.name === name), 1);
            let members = roomList[roomID].userList.map(({name}) => name);
            io.in(roomID).emit('waiting-info', {roomID: roomID, members: members, waiting: false});
            checkWaitingPeople(roomID, true)
          }
          else {
            roomList[roomID].waitingRoom.splice(roomList[roomID].waitingRoom.findIndex((user) => user.name === name), 1);
          }
          break;
        case 'questions': //not answered the question yet
          submitAnswer(roomID,'', '', true)
          
          break;
        case 'answers':
          chooseAnswer(roomID, '', true);
          
          break;
        case 'points':
          favoriteAnswerChoice(roomID, true, name);
          
          break;
        default:
          break;
      };
      if ((roomList[roomID] && roomList[roomID].userList.length <= 1 && part !== 'end') || (roomList[roomID] && roomList[roomID].userList.length < 1 && part === 'end')) {
        if(roomList[roomID].waitingRoom.length >= 0) {
          io.in(roomID).emit('return_home');
        }
        //create endpoint for exiting
        delete roomList[roomID];
        return;
      }
    }
    socket.disconnect()
   }
   catch(err){
    console.log(err)
  }
 })
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started`));
