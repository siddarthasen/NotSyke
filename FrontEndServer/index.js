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
    this.question_requests = 0;
    this.inGame = false;
    this.waitingRoom = [];
  }

  isNextQuestion() {
    this.question_requests += 1;
    return this.question_requests == this.userList.length;
  }

  getNextPlayer() {
    this.player_num += 1;
    this.player_num = this.player_num % this.userList.length;
    return this.userList[this.player_num];
  }

  resetQuestionRequests() {
    this.question_requests = 0;
  }

  resetResponses() {
    this.answers = 0;
    this.choices = 0;
  }

  uniqueName(name) {
    return this.userList.findIndex((user) => user.name === name) === -1;
  }

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
        socket.emit('error', {error: "Name is already taken"});
      }
    } else {
      try {
        socket.emit('error', {error: 'no room found'});
      }
      catch {
        console.log('Room not created yet.');
        socket.emit('error', {error: 'no room found'});
      }
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
    //if(answer for each user is not empyy)-> clear it
    console.log('');
    console.log(Math.floor(Math.random() * 10))
    // let user = roomList[room].userList[(Math.floor(Math.random() * 100) % (roomList[room].userList.length - 1))].name
    if (roomList[room].isNextQuestion()) {
      let user = roomList[room].getNextPlayer().name;
      let random = (Math.floor(Math.random() * 100) % 100) - 1
      let phrase = questions.questions[38]
      let question = phrase.first
      question = question.concat(user, phrase.second)
      roomList[room].resetResponses();
      io.in(room).emit('sentPrompt', {question: question});
    }
  });

 socket.on('submitAnswer' , ({room, name, answer, disconnect}) => {submitAnswer(room, name, answer, disconnect)});

 function submitAnswer(room, name, answer, disconnect) {
  console.log('');
  console.log('in submitAnswer');
  console.log('disconnect: ', disconnect);
  if (!disconnect) {
   roomList[room].userList.find((user) => user.name === name).answer = answer;
   roomList[room].answers++;
  }
  if (roomList[room].answers == roomList[room].userList.length) {
    console.log('in submit if');
    answerInfo = Room.randomizeList(roomList[room].userList.map(user => ({id: user.id, answer: user.answer})));
    console.log('room, ', roomList);
    io.in(room).emit('displayAnswers', { answerInfo: answerInfo});
  };
}

 socket.on('chooseAnswer', ({room, userID, disconnect}) => {chooseAnswer(room, userID, disconnect)}); 
 
 function chooseAnswer(room, userID, disconnect) {
   console.log('');
    if (!disconnect) {
      console.log('chooseAnswerNotDisconnect');
      roomList[room].resetQuestionRequests();
      console.log('room, userID: ', room, ', ', userID);
      console.log('name' , roomList[room].userList.find((user) => user.id === userID).name);
      roomList[room].userList.find((user) => user.id === userID).points++;
      roomList[room].choices++;
    }
    if (roomList[room].choices == roomList[room].userList.length) {
      console.log('chooseAnswerIf: ', roomList[room].userList.length, roomList[room].choices);
      roomList[room].choices = 0;
      io.in(room).emit('displayPoints', {choiceInfo: roomList[room].userList.map(each => ({name: each.name, points: each.points}))});
    };
 };

 socket.on('ready',({room}) => {favoriteAnswerChoice(room)});
 
 function favoriteAnswerChoice(room) {
  roomList[room].choices++
  if(roomList[room].choices === roomList[room].userList.length)
  {
   roomList[room].choices = 0
   if(roomList[room].waitingRoom.length){
     roomList[room].userList.concat(roomList[room].waitingRoom)
     roomList[room].waitingRoom = []
   }
   io.in(room).emit('next_question', {start: true});
  }
}

 socket.on('remove_user', function({roomID, name, part}) {
   /* Harry's code
    console.log('name before removal ', name);
    if (roomList[roomID]) 
    {
      console.log('removed member: ', roomList[roomID].userList.splice(roomList[roomID].userList.findIndex((user) => user.name === name), 1));
      let members = roomList[roomID].userList.map(({name}) => name);
      io.in(roomID).emit('waiting-info', {roomID: roomID, members: members});
    }
   */
   
   if (roomList[roomID]) {
    console.log('someone is being deleted');
    switch (part) {
      case 'waiting':
        roomList[roomID].userList.splice(roomList[roomID].userList.findIndex((user) => user.name === name), 1);
        let members = roomList[roomID].userList.map(({name}) => name);
        io.in(roomID).emit('waiting-info', {roomID: roomID, members: members});
        break;
      case 'questions':
        console.log('');
        console.log('in questions')
        roomList[roomID].userList.splice(roomList[roomID].userList.findIndex((user) => user.name === name), 1);
        console.log('user list: ', roomList[roomID].userList);
        submitAnswer(roomID,'', '', true)
        break;
      case 'answers':
        console.log('in answers');
        roomList[roomID].userList.splice(roomList[roomID].userList.findIndex((user) => user.name === name), 1);
        chooseAnswer(roomID, '', true);
        break;
      case 'points':
        console.log('in points');
        roomList[roomID].userList.splice(roomList[roomID].userList.findIndex((user) => user.name === name), 1);
        favoriteAnswerChoice(roomID);
        break;
    }; 
   }
 })
});
/* 
  4 people in a game
  1 person has asnwered, and then after 1 person decides to leave
  -> 3 people in the room
  4 people in a game
  3 have answer, and then the last person decides to leave
*/


app.use(router);

server.listen(PORT, () => console.log(`Server has started`));