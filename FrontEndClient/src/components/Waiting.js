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
import {
  withStyles, Avatar, Divider, CardHeader, List, ListItemText, ListItem
} from '@material-ui/core';
 import { Spring } from 'react-spring/renderprops'
 import { useSelector, useDispatch } from 'react-redux';
import * as actions from './actions'
import { useHistory } from "react-router-dom";
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
  let history = useHistory();
  //Access redux state tree:
  let members = useSelector(state=> state.members)
  let socket1 = useSelector(state=> state.socket)
  let roomID = useSelector(state => state.roomID)
  let start = useSelector(state => state.start)
  let name = props.location.state.name
  let room = props.location.state.room
  // let endpoint = props.location.state.endpoint
  let type = props.location.state.type
    
  const dispatch = useDispatch()
  
  useEffect(() => {
    // var endpoint = 'http://ec2-13-59-225-36.us-east-2.compute.amazonaws.com:5000/'
    var endpoint = "localhost:5000"
    console.log(endpoint)
    socket = io(endpoint)
    dispatch({type: 'SET_SOCKET', payload: socket})
    //assume this stuff is in action.js file
    dispatch(actions.sendLogIn(type, name, room, endpoint, socket, io))
      
  },[]);

  useEffect(() => {
    socket.on('start', (start) => {
      history.push('/Game', {name: name, room: room})
    })
  })

  const startGame = () => { //used for creator
    dispatch(actions.startGame(roomID, socket, (update) => {
      history.push('/Game', {name: name, room: room})
    }))
  }

  /*  For this user disconnection. First call when a user disconnects. 
      Emit to the server. Take out the DISCONNECT variable @Sid. */
  const disconnectUser = () => {
    socket.on('disconnect', () => {
      socket.emit('player-disconnect', {roomID, name});
    });
  };

  /*  Once we get back the updated list from server, we rerender
      the list @Sid. */

  //FIXME: @Harry make this into redux stuff like join room. 
  const disconnectRender = () => {
    
      socket.on('removal-update', () => {
        // rerender the components 
      });
  };

  return (
    <div>
      <h1>Hello</h1>
      <h1> The room id is {roomID}</h1>
      <Grid item direction="column">
      {members.map((item, i) => (
                    <Card style={{margin: 10}}>
                      <List key={i}>
                        <ListItem key={i} style={{margin: 15}}>
                          <ListItemText id={i} primary={item}/>
                        </ListItem>
                    </List>
                  </Card>
                    ))}
        </Grid>
        {type==="Create" && members.length > 1? <Button onClick={startGame}>Here</Button> : null}
    </div>
  );
}

export default Waiting;
