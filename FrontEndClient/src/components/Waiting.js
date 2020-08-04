import React, {useState, useEffect} from 'react';
import queryString from 'query-string'
import io from 'socket.io-client'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import CardFormat from './CardFormat'
import Chip from '@material-ui/core/Chip';
import Slide from '@material-ui/core/Slide';
import '../fonts/Chewy-Regular.ttf'
import {
  withStyles, Avatar, Divider, CardHeader, List, ListItemText, ListItem
} from '@material-ui/core';
 import { Spring } from 'react-spring/renderprops'
 import { useSelector, useDispatch } from 'react-redux';
import * as actions from './actions'
import { useHistory } from "react-router-dom";
import { AwesomeButton } from "react-awesome-button";
import { Beforeunload } from 'react-beforeunload';
import './CardFormat.css'
let socket;


const useStyles = makeStyles({
  card: {
    borderRadius: 40,
    height: 500,
    width: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    zIndex: 300
  },
  title: {
    fontSize: 30,
    fontFamily: 'Segoe Print',
    textAlign: 'center',
    padding: 15
  },
  bar: {
    alignSelf: 'center',
    fontColor: 'black',
    background: 'transparent'
  },
  test: {
    color: 'white',
    fontColor: 'black',
    background: 'black'
  },
  text: {
    padding: 5,
    width: 300,
    height: 50,
    fontSize: 25,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 3,
    fontFamily: 'Segoe Print',
    backgroundColor: '#black',
    marginTop: 15,
    alignSelf: 'center'
  },
  test1: {
    color: 'black',
    flex: 1,
    marginLeft: 100,
    marginRight: 100,
    height: 45,
    width: 200,
    alignItems: 'center',
    fontSize: 20,
    fontFamily: 'Segoe Print',
    fontColor: 'white',
    jusitfyContent: 'center'
  }
});

const Waiting = (props) => {
  const classes = useStyles();
  let history = useHistory();
  //Access redux state tree:
  let members = useSelector(state=> state.members)
  let socket1 = useSelector(state=> state.socket)
  let roomID = useSelector(state => state.roomID)
  let start = useSelector(state => state.start)
  let name = props.location.state.name
  let room = props.location.state.room
  const [slide, setSlide] = useState(false);
  // let endpoint = props.location.state.endpoint
  let type = props.location.state.type
    
  const dispatch = useDispatch()
  
  useEffect(() => {
    // localStorage.setItem(socket, 'socket')
    // //setting an item into chrome cache
    // socket = localStorage.getItem('socket')
    // var endpoint = 'http://ec2-13-59-225-36.us-east-2.compute.amazonaws.com:5000/'
    var endpoint = "localhost:5000"
    socket = io(endpoint)
    dispatch({type: 'SET_SOCKET', payload: socket})
    //assume this stuff is in action.js file
    if(type === 'Create')
    {
      dispatch({type: 'SET_CREATOR', payload: true})
    }
    dispatch(actions.sendLogIn(type, name, room, endpoint, socket, io))
    setSlide(true)
      
  },[]);

  useEffect(() => {
    socket.on('start', (start) => {
      history.push('/Game', {name: name, room: room})
    })
  })

  useEffect(() => {
    socket.on('next_question', () => {
      history.push('/Game', {name: name, room: room})
    })
  })


  /* add this to shared file.*/
  // window.addEventListener('beforeunload', function (e) {
  //   alert(e)
  //   e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
  //   // Chrome requires returnValue to be set
  //   console.log(roomID, name)
  //   socket.emit('remove_user', {roomID: roomID, name: name})
  //   dispatch({type: 'RESET_USER'})
  //   history.push('/')
  //   e.returnValue = '';
  // });
  // window.addEventListener('backbutton', function(){
  //   alert("test")
  //   return false;
  //   })

  const startGame = () => { //used for creator
    dispatch(actions.startGame(roomID, socket, (update) => {
      history.push('/Game', {name: name, room: room})
    }))
  }

  /*  For this user disconnection. First call when a user disconnects. 
      Emit to the server. Take out the DISCONNECT variable @Sid. */
  const disconnectUser = () => {
    socket.on('disconnect', () => {
      socket.emit('player-disconnect', {roomID: roomID, name: name});
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
  var render = 0
  var count = 0;
setInterval(function(){
  count++;
  if(document.getElementById('loadingtext'))
  {
  document.getElementById('loadingtext').innerHTML = "Waiting for People to Join" + new Array(count % 5).join('.');
  }
  render = 1
}, 1000);


function stop(event)
{
  console.log(event)
  event.preventDefault()
  socket.emit('remove_user', {roomID: roomID, name: name})
    dispatch({type: 'RESET_USER'})
    history.push('/')
    event.returnValue = '';
}
  return (
    <div>
      <Grid item direction="column">
      <Beforeunload onBeforeunload={event => {stop(event)}} />
      <Grid container
  spacing={0}
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '100vh' }}>
    <Typography style={{fontSize: 40, marginBottom: 20, fontFamily: 'Segoe Print'}}>Room ID: {roomID}</Typography>
    <Spring
      from={{ transform: 'translate3d(0,0px,0)' }}
      to={{ transform: 'translate3d(0,0px,0)' }}>
      {props => (
        <div style={props}>
    <Box border={3} borderRadius={40}>
    <Card className={classes.card}>
    <Typography id="loadingtext" className = {classes.title}>Waiting for People to Join</Typography>
    {members.map((item, i) => (
                      <List key={i} style={{display: 'flex', justifyContent: 'center'}}>
                        <Slide direction="up" in={slide} mountOnEnter unmountOnExit>
                          <Grid contanier jusitfy="flex-start" alignItem="flex-start">
                        <Chip  avatar={<Avatar style={{display: 'flex', fontSize: 25, height: 40, width: 40, justifyContent: 'center'}}>{item[0]}</Avatar>} label={item} style={{display: 'flex', margin: 5, fontSize: 30, width: 300, paddingTop: 20, paddingBottom: 20, justifyContent: 'left', fontFamily: 'Segoe Print'}}/>
                        </Grid>
                        </Slide>
                    </List>
                    ))}
            {type==="Create" && members.length > 1? <AwesomeButton className={classes.test1} type="secondary" ripple onPress={startGame}>Start Game</AwesomeButton> : null}
      </Card>
      </Box>
      </div>
      )}
      </Spring>
    </Grid>


        </Grid>
    </div>
  );
}

export default Waiting;
