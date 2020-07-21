import React, {useState, useEffect} from 'react';
import queryString from 'query-string'
import io from 'socket.io-client'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import './CardFormat.css'
import { AwesomeButton } from "react-awesome-button";
import Box from '@material-ui/core/Box';
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

let socket;


const useStyles = makeStyles({
  card: {
    borderRadius: 40,
    height: 500,
    width: 400,
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
  }
});

const joinRoom = (buttonName, room, name, history) => {
  const ENDPOINT = 'http://ec2-13-59-225-36.us-east-2.compute.amazonaws.com:5000/'
  // socket = io(ENDPOINT)
  if(buttonName.localeCompare('Create Room') == 0)
  {
    
    history.push('/Waiting', {type: "Create", name: name, room: room, endpoint: ENDPOINT})
  }
  else
  {
    history.push('/Waiting', {type: "Join", name: name, room: room, endpoint: ENDPOINT})
  }
}

const RenderRoom = ({value, classes, name, setName, room, setRoom}) => {
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
  let history = useHistory();
  const classes = useStyles();
  return (
  <Grid container
  spacing={0}
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '100vh' }}>
    <Box border={3} borderRadius={40}>
    <Card className={classes.card}>
    <Typography className = {classes.title}>
    Not Psych!
    </Typography>
      <AppBar position="static" className={classes.test}>
            <Tabs value={value} onChange={handleChange}  className={classes.bar}>
              <Tab style={{fontFamily: 'Segoe Print'}}label="Join Room"  />
              <Tab style={{fontFamily: 'Segoe Print'}} label="Create Room"  />
            </Tabs>
        </AppBar>
        <CardContent>
          <RenderRoom value={value} classes={classes} name={name} setName={setName} setRoom={setRoom} room={room}/>
        </CardContent>
        <CardActions>
        <AwesomeButton className={classes.test1} type="secondary" ripple onPress={()=> joinRoom(buttonName, room, name, history)}>{buttonName}</AwesomeButton>
        </CardActions>
      </Card>
      </Box>
    </Grid>
  )
}

export default CardFormat;
