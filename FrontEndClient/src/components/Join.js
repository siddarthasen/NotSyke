import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import io from 'socket.io-client'
import { Button, Alert } from '@material-ui/core';
let socket
const Join = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const ENDPOINT = 'localhost:5000'
  let error = false

const checkValid = () =>
{
  socket = io(ENDPOINT);
  socket.emit('join', {name, room}, (error) => {
  });
  return false
  return() => {
    socket.emit('disconnect');

    socket.off();
  }
}

  return(
    <div>
        <h1 className="heading">Join</h1>
          <input placeholder="Name" onChange={(event) => setName(event.target.value)} />
        <input placeholder="Room" onChange={(event) => setRoom(event.target.value)} />
        <button onClick={checkValid ? null : console.log("false")}> Submit </button>
    </div>
  )
}

export default Join;
