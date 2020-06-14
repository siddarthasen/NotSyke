const express = require('express');
//express is being used for FrontEndServer
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();

const server = http.createServer(app);


const io = socketio(server);

io.on('connection', (socket) => {
  console.log("We aheva new connection");
  socket.on()
})

app.use(router);

server.listen(PORT, () => console.log(`Server has started`));
