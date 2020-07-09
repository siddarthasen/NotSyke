import React, {useState, useEffect} from 'react';
import queryString from 'query-string'
import io from 'socket.io-client'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import CardFormat from './CardFormat'
 import { Spring } from 'react-spring/renderprops'

let socket;

const useStyles = makeStyles({
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const Waiting = (props) => {
  const [members, setMembers] = useState([])
  useEffect(() => {
    let name = props.location.state.name
    let room = props.location.state.room
    let endpoint = props.location.state.endpoint
    socket = io(endpoint)
    socket.emit('join', {name, room}, (error) => {
        if(error)
        {
          alert(error)
        }
      });
    console.log(props.location.state.endpoint)

    socket.on('message', (data) => console.log(data));
  },[])
  //inital to connect to Server

  useEffect(() => {
    socket.on('add_member', (data) => console.log(data));
  }, [members])




  return (
    <div>
      <h1>HEllo</h1>
    </div>
  );
}

export default Waiting;
