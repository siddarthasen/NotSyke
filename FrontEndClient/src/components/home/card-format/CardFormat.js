import React, {useState, useEffect} from 'react';
import io from 'socket.io-client'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import './CardFormat.css'
import { AwesomeButton } from "react-awesome-button";
import Box from '@material-ui/core/Box';
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../store/actions';
import { Button } from '@material-ui/core';
let socket;


const useStyles = makeStyles({
  button: {
    display: 'flex',
    flex: 1,
    alignContent: 'center',
    alignSelf: 'center',
    bottomPadding: 20
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
    borderRadius: 20,
    borderWidth: 3,
    fontFamily: 'Segoe Print',
    marginTop: 15,
    alignSelf: 'center'
  },
  appBarBorder: {
    backgroundColor: 'black'
  }
});

const joinRoom = (buttonName, room, name, history, dispatch) => {
  // const ENDPOINT = 'http://ec2-13-59-225-36.us-east-2.compute.amazonaws.com:5000/'
  const ENDPOINT = "localhost:5000"
  socket = io(ENDPOINT)
  if(buttonName.localeCompare('Create Room') == 0){
    dispatch({type: 'SET_CREATOR', payload: true})
    dispatch({type: 'SET_SOCKET', payload: socket})
    dispatch(actions.sendLogIn('Create', name.trim(), room.trim(), socket, history))
  }
  else{
    dispatch({type: 'SET_SOCKET', payload: socket})
    dispatch(actions.sendLogIn('Join', name.trim(), room.trim(), socket, history))
  }
}

const RenderRoom = ({value, classes, name, setName, room, setRoom, dispatch}) => {
  if(value === 0)
  {
  return(
    <Grid container item
    direction="column"
    justify="center"
    alignItems="center"
    style={{ minHeight: '25vh' }}>
      <div className="textboxes">
        <TextField
          id="username"
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="textboxes">
        <TextField
          id="password"
          placeholder="Password"
          onChange={(e) => setRoom(e.target.value)}
        />
      </div>
    </Grid>
    )
  }
  else {
    return(
      <Grid
      container
      item
      direction="column"
      justify="center"
      alignItems="center"
      style={{ minHeight: '25vh' }}>
        <div className="textboxes">
          <TextField
            id="username"
            placeholder="Username"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </Grid>
      )
  }
}



const CardFormat = ({value, handleChange, buttonName, name, setName, room, setRoom, sendRequest}) => {
  const dispatch = useDispatch()
  let history = useHistory();
  const classes = useStyles();
  let error = useSelector(state=> state.error)
  const color = useSelector(state => state.color)
  

  function backgroundColor() {
    let colors = ['#B297FF', '#82D9FF', '#E85050', 'rgba(4, 191, 16, 0.6)', '#FFD967'];
    let num = Math.floor(Math.random() * colors.length);
    console.log('num ', num);
    num = num == 5 ? 4 : num;
    dispatch({type: 'PICK_COLOR', payload: colors[num]})
    return colors[num];
  }

const appBar = {
  backgroundColor: color,
  alignItems: 'center'
}

  useEffect(() => {
  document.body.style.background = backgroundColor();
  }, [])
  return (
  <Grid container
  spacing={0}
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '100vh' }}>
    <Box>
      <Card id="card">
        <div id="title-spacing">
          <Typography id="title">
            NotSyke!
          </Typography>
        </div>
        <AppBar position="static" style={appBar} elevation={0}>
              <Tabs value={value} onChange={handleChange} classes={{ indicator: classes.appBarBorder }} >
                <Tab id="tab-title" label="Join Room"/>
                <Tab id="tab-title" label="Create Room"/>
              </Tabs>
        </AppBar>
        <CardContent>
          <RenderRoom value={value} classes={classes} 
                      name={name} setName={setName} 
                      setRoom={setRoom} room={room}/>
        </CardContent>
        <Grid container alignItems="center" direction="column">
          <div id="submit-button-div">
            <Button id="submit-button" className={classes.button} 
              onClick={()=> joinRoom(buttonName, room, name, history, dispatch)}>{buttonName}
            </Button>
          </div>
        </Grid>
        <Typography>{error}</Typography>
      </Card>
    </Box>
  </Grid>
  )
}

export default CardFormat;
