const express = require('express');
//express is being used for FrontEndServer
const socketio = require('socket.io');
const http = require('http');

const {addUser, removeUser, getUser, getUsersInRoom} = require('./groups');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();

const server = http.createServer(app);


const io = socketio(server);


//connections to a client here
io.on('connection', (socket) => {
  console.log("We have new connection");
  socket.on('join', ({name, room}, callback) => {
    const {error, user} = addUser({id:socket.id, name, room});
    if(error)
    {
      return callback(error)
    }
    socket.emit('message', {user: 'admin', text: `${user.name}, Welcome to the room ${user.room}}`})
    socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined`})
    socket.join(user.room);


    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);
      io.to(user.room).emit('message', {user:user.name, text: message})
    })
    callback();
  });
  //disconnect client
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if(user)
    {
      io.to(user.room).emit('message', {user:'admin', text: `${user.name} has left`})
    }
    console.log("user has left");
  })
})

app.use(router);

server.listen(PORT, () => console.log(`Server has started`));
