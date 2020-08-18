import React, {useState, useEffect} from 'react';
import io from 'socket.io-client'
import Card from '@material-ui/core/Card';
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
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../../store/actions';
import { Button } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';
let socket;
let color;

const useStyles = makeStyles({
  Button: {
    display: 'flex',
    flex: 1,
    alignContent: 'center',
    alignSelf: 'center',
    "&:hover": {
      backgroundColor: ({ color}) => `${color}`
    },
    borderRadius: 7,
    width: 120,
    borderWidth: 1,
    fontSize: 10,
    borderColor: ({color}) => `${(color)}`,
    marginBottom: '0 !important'
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
  if(buttonName.localeCompare('Create Room') === 0){
    dispatch({type: 'SET_CREATOR', payload: true})
    dispatch({type: 'SET_SOCKET', payload: socket})
    dispatch(actions.sendLogIn('Create', name.trim(), room.trim(), socket, history))
  }
  else{
    dispatch({type: 'SET_SOCKET', payload: socket})
    dispatch(actions.sendLogIn('Join', name.trim(), room.trim(), socket, history))
  }
}

function handleKeyPress(event, buttonName, room, name, history, dispatch) {
  if(event.key === 'Enter'){
    joinRoom(buttonName, room, name, history, dispatch)
  }
}

const RenderRoom = ({value, classes, name, setName, room, setRoom, history, dispatch}) => {

  
  if(value === 0)
  {
  return(
    <Grid container item
    direction="column"
    justify="center"
    alignItems="center">
      <div className="textboxes">
        <TextField
          id="username"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => {handleKeyPress(e, 'Join', room, name, history, dispatch)}}
          inputProps={{maxLength :20}}
        />
      </div>
      <div className="textboxes">
        <TextField
          id="password"
          placeholder="Room Code"
          onChange={(e) => setRoom(e.target.value)}
          onKeyPress={(e) => {handleKeyPress(e, 'Join', room, name, history, dispatch)}}
          inputProps={{maxLength :20}}
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
      alignItems="center">
        <div className="textboxes">
          <TextField
            id="username"
            placeholder="Username"
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => {handleKeyPress(e, 'Create Room', room, name, history, dispatch)}}
            inputProps={{maxLength :20}}
          />
        </div>
      </Grid>
      )
  }
}




const CardFormat = ({value, handleChange, buttonName, name, setName, room, setRoom}) => {
  color = useSelector(state => state.out)
  const dispatch = useDispatch()
  let history = useHistory();
  color = window.localStorage.getItem('color');
  let out = useSelector(state => state.out)
  const classes = useStyles({color});
  let error = useSelector(state=> state.error)

  function backgroundColor() {
    let colors = ['#B297FF', '#82D9FF', '#E85050', 'rgba(4, 191, 16, 0.6)', '#FFD967'];
    let secondaryColors = ['#DED2FF', '#C5EDFF', '#E78686', '#BCE4BE', '#FFF3CE'];
    let num = Math.floor(Math.random() * colors.length);
    num = num === 5 ? 4 : num;
    window.localStorage.setItem('color', colors[num]);
    dispatch({type: 'PICK_COLOR', payload: {primary: colors[num], secondary: secondaryColors[num]}});
    return colors[num];
  }

const appBar = {
  backgroundColor: color,
  alignItems: 'center'
}
// const ButtonStyle = {
//     display: 'flex',
//     flex: 1,
//     alignContent: 'center',
//     alignSelf: 'center',
//     backgroundColor: 'black',
//     "&:hover": {
//       color: color
// }
// }

  useEffect(() => {
  document.body.style.background = backgroundColor();
  }, [])


  return (
  <Grid 
  container
  alignItems="center"
  justify="center"
  style={{ minHeight: '90vh' }}>
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
        <Grid container alignItems="center" direction="column">
        <CardContent >
          <RenderRoom value={value} classes={classes} 
                      name={name} setName={setName} 
                      setRoom={setRoom} room={room} history={history} dispatch={dispatch}/>
        </CardContent>
          <div id="submit-button-div">
            <Button id="submit-button-home" variant="outlined" className={classes.Button}
              onClick={()=> joinRoom(buttonName, room, name, history, dispatch)}>{buttonName}
            </Button>
          </div>
          {!value ? <Typography id="error">{error}</Typography> : null }
        </Grid>
      </Card>
  </Grid>
  )
}

export default CardFormat;
