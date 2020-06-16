import React, {useState, useEffect} from 'react';
import queryString from 'query-string'
import io from 'socket.io-client'

let socket;

const Chat = ({location}) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const ENDPOINT = 'localhost:5000'
  useEffect(() => {
    const {name, room} = queryString.parse(location.search)
    socket = io(ENDPOINT);
    setName(name);
    setRoom(room);
    console.log(room, name)
    socket.emit('join', {name, room}, (error) => {
      // alert(error)
    });
    return() => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [ENDPOINT, location.search])

  useEffect(() => {
    socket.on('message', (message) => {
      setMessage([...messages, message]);
    })
  }, [messages])


  return (
    <div className="outerContainer">
      <div className="container">
        <h1>HI</h1>
      </div>
    </div>
  );
}

export default Chat;
