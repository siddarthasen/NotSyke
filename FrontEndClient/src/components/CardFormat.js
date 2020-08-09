import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import './CardFormat.css'
import { Button } from "shards-react";
import { isMobile } from "react-device-detect";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import { useSelector, useDispatch } from 'react-redux';
import * as actions from './actions'
let socket;


const useStyles = makeStyles({  
  html: {
	background: 	   'black',
  },
  card: {
    borderRadius: 40,
    height: '70vh',
    width: '40vw',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black'
  },
  cardMobile: {
    borderRadius: 40,
    height: '70vh',
    width: '90vw',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black'
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
    borderRadius: 20,
    borderWidth: 3,
    fontFamily: 'Segoe Print',
    marginTop: 15,
    alignSelf: 'center'
  },
  test1: {
    color: 'black',
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    height: 45,
    alignItems: 'center',
    fontSize: 20,
    fontFamily: 'Segoe Print',
    fontColor: 'white'
  },
  buttonContainer: {
    textAlign: 'center'
  },
  button: {
    margin: 'auto'
  }
});

const joinRoom = (buttonName, room, name, history, dispatch) => {
  // const ENDPOINT = 'http://ec2-13-59-225-36.us-east-2.compute.amazonaws.com:5000/'
  const ENDPOINT = "localhost:5000"
  socket = io(ENDPOINT)
  if(buttonName.localeCompare('Create Room') == 0){
    dispatch({type: 'SET_CREATOR', payload: true})
    dispatch({type: 'SET_SOCKET', payload: socket})
    dispatch(actions.sendLogIn('Create', name, room, socket, history))
  }
  else{
    dispatch({type: 'SET_SOCKET', payload: socket})
    dispatch(actions.sendLogIn('Join', name, room, socket, history))
  }

  // if(buttonName.localeCompare('Create Room') == 0)
  // {
    
  //   history.push('/Waiting', {type: "Create", name: name, room: room, endpoint: ENDPOINT})
  // }
  // else
  // {
  //   history.push('/Waiting', {type: "Join", name: name, room: room, endpoint: ENDPOINT})
  // }
}

const RenderRoom = ({value, classes, name, setName, room, setRoom, dispatch}) => {
  if(value === 0)
  {
  return(
    <Grid container direction="column">
    <input
    className={classes.text}
    type="text"
    value={name}
    placeholder="Username"
    onChange={(e) => setName(e.target.value)}
    />
    <input
    className={classes.text}
    type="text"
    placeholder="Room Code"
    value={room}
    onChange={(e) => setRoom(e.target.value)}
    />
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
        <input
        className={classes.text}
        type="text"
        value={name}
        placeholder="Username"
        onChange={(e) => setName(e.target.value)}
        />
      </Grid>
      )
  }
}



const CardFormat = ({value, handleChange, buttonName, name, setName, room, setRoom, sendRequest}) => {
  const dispatch = useDispatch()
  let history = useHistory();
  const classes = useStyles();
  let error = useSelector(state=> state.error)

  function backgroundColor() {
    let colors = ['#B297FF', '#82D9FF', '#E85050', 'rgba(4, 191, 16, 0.6)', '#FFD967'];
    let num = Math.floor(Math.random() * colors.length);
    console.log('num ', num);
    num = num == 5 ? 4 : num;
    return colors[num];
  }

  useEffect(() => {
  document.body.style.background = backgroundColor();
  }, [])
  if (isMobile) {
    console.log("mobile detected");
    return (
      <Grid container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}>
        <Card className={classes.cardMobile}>
          <Typography className = {classes.title}>
            NotPsych!
          </Typography>

          <CardContent>
            <RenderRoom value={value} classes={classes} name={name} setName={setName} setRoom={setRoom} room={room}/>
          </CardContent>
          <CardActions>
          {/* <Fab variant="extended" className={classes.test1} type="secondary" ripple onPress={()=> joinRoom(buttonName, room, name, history)}>
            Navigate
          </Fab> */}
          </CardActions>
        </Card>
      </Grid>
    )
  } else {
    console.log("desktop detected");
    return (
      <Grid container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}>
        <Card className={classes.card}>
          <Typography className = {classes.title}>
            NotPsych!
          </Typography>
          <CardContent>
            <RenderRoom value={value} classes={classes} name={name} setName={setName} setRoom={setRoom} room={room}/>
          </CardContent>
          <CardActions classname={classes.buttonContainer}>
            <Button pill>
              Navigate
            </Button>
          </CardActions>
        </Card>
      </Grid>
    )
  }
}

export default CardFormat;
