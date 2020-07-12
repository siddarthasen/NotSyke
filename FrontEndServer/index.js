const express = require('express');
//express is being used for FrontEndServer
const socketio = require('socket.io');
const http = require('http');

const {addUser, removeUser, getUser, getUsersInRoom, generateRoomID} = require('./groups');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();

const server = http.createServer(app);

const io = socketio(server);

var roomNum = 1;

var roomList = {}

io.on('connection', function(socket) {

  socket.on('join', function({type, name, room}) {
    if (type === 'Create') {
      room = generateRoomID().toString()
      while(roomList.hasOwnProperty(room)) {
        room = generateRoomID().toString()
      }
      socket.join(room);
      console.log("socket.rooms: ", socket.adapter.rooms);
      console.log("////////////////////////////")
      roomList[room] = [] //list of users
      roomList[room].push(name)
      socket.emit('waiting-info', {roomID: room, members: roomList[room]});
    }
    else if (roomList.hasOwnProperty(room)) {
      // console.log("All people: " , socket.adapter.rooms);
      // @error check if person's name is unique
      socket.join(room);
      roomList[room].push(name);
      console.log("socket.rooms: ", socket.adapter.rooms);
      console.log("////////////////////////////")
      // socket.emit('waiting-info', {roomID: room, members: roomList[room]})
      io.in(room).emit('waiting-info', {roomID: room, members: roomList[room]});
    }
  })

  // console.log("socket.rooms: " + socket.adapter.rooms); // contains an object with all of the roomnames as keys and values

  // var clientsOne = io.sockets.clients();
  
 

  // console.log(clientsOne);
  // console.log(clients);
  // console.log(clientsTwo);
})

//connections to a client here
//add all the logic for the members in this function
// io.on('connection', socket => {
//   // console.log(socket);
//   // console.log("^this is socket");
//   // socket.on('check', ({name, room}) => {
//   //
//   // })
//   //create a function that ONLY CHECKS whether the room/name is valid

//   //for create a room just join Room below is fine
//   //this function actually inserts the name into the key in the hashmap to make sure the user is in the group
//   socket.on('join', ({name, room}, callback) => {
//     const {error, user} = addUser({id:socket.id, name, room}); //inserts name
//     // if(error) {
//       console.log(socket.rooms)
//       return callback(error) //return the error
//     // }
//     // else {
//     //   socket.join(room);
//     //   console.log("User " + name + 'has joined ' + room)
//     // }
//     //https://stackoverflow.com/questions/19150220/creating-rooms-in-socket-io#:~:text=Rooms%20in%20Socket.IO%20don,function%20(room)%20%7B%20socket.
//     // socket.on("add_user", name => {
//     //   name: "testing",
//     //   message: "Welcome, it works"
//     // })
//     console.log(socket.id)
//     destination = socket.id
//     socket.emit('message', {user: 'admin', text: `${user.name}, Welcome to the room ${user.room}}`}) //sends the message to the client as soon as they join
//     // socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined`})
//     // socket.join(user.room);

//     //ENDING OF USED CODE
//     //AFTER THIS ADD FUNCTIONALITY FOR:
//       //broadcasting list of members everytime a new user joins
//       //creating a room (check whether room is taken) and returning the generwted id


      
//     //..............................................//
//     // socket.on('create', function (room) {
//     //   socket.join(room)
//     // });
    

//     socket.on('sendMessage', (message, callback) => {
//       const user = getUser(socket.id);
//       io.to(user.room).emit('message', {user:user.name, text: message})
//     })
//     callback();
//   });

//   //disconnect client
//   socket.on('disconnect', () => {
//     const user = removeUser(socket.id)
//     if(user)
//     {
//       io.to(user.room).emit('message', {user:'admin', text: `${user.name} has left`})
//     }
//     console.log("user has left");
//   })
// });

app.use(router);

server.listen(PORT, () => console.log(`Server has started`));


      // if(io.sockets.adapter.rooms['123'])
      // {
      //   var clients = io.sockets.adapter.rooms['123'].length;
      //   console.log("there are " + clients + " in room 1")
      // }
      // if(io.sockets.adapter.rooms['456'])
      // {
      //   var clients = io.sockets.adapter.rooms['456'].length;
      //   console.log("there are " + clients + " in room 2")
      // }
      // console.log("All people: " , socket.adapter.rooms);
      // console.log("All people: "  ,io.sockets.clients());
      
      // var clientsTwo = io.sockets.adapter.rooms['456'];
      // console.log("there are " + clientsTwo + " in room 2")

            // if(io.sockets.adapter.rooms['123'])
      // {
      //   var clients = io.sockets.adapter.rooms['123'].length;
      //   console.log("there are " + clients + " in room 1")
      // }
      // if(io.sockets.adapter.rooms['456'])
      // {
      //   var clients = io.sockets.adapter.rooms['456'].length;
      //   console.log("there are " , clients,  " in room 2")
      // }