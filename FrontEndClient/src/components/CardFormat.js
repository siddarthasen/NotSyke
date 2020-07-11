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

let socket;


const useStyles = makeStyles({
  card: {
    borderRadius: 40,
    height: 500,
    width: 400,
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    fontFamily: 'Sedan',
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
    background: '#5db1f4'
  },
  text: {
    padding: 5,
    width: 300,
    height: 50,
    fontSize: 25,
    borderColor: '#5db1f4',
    borderRadius: 10,
    borderWidth: 3,
    fontFamily: 'Sedan',
    backgroundColor: '#d4ecff',
    marginTop: 15,
    alignSelf: 'center'
  },
  test1: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    height: 45,
    alignItems: 'center',
    backgroundColor: '#d4ecff',
    fontSize: 20,
    fontFamily: 'Sedan'
  }
});

const joinRoom = (buttonName, name, room, history) => {
  const ENDPOINT = 'localhost:5000'
  // socket = io(ENDPOINT)
  if(buttonName.localeCompare('Create Room') == 0)
  {
    console.log("here")
    history.push('/Waiting', {name: name, room: room, endpoint: ENDPOINT})
  }
  else
  {
    // socket.emit('join', {name, room}, (error) => {
    //     if(error)
    //     {
    //       alert(error)
    //     }
    //     else {
    //       history.push('/Waiting', {name: name, room: room, endpoint: ENDPOINT})
    //     }
    //   });
    history.push('/Waiting', {name: name, room: room, endpoint: ENDPOINT})
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
    <Card className={classes.card}>
    <Typography className = {classes.title}>
    Not Psych!
    </Typography>
      <AppBar position="static" className={classes.test}>
            <Tabs value={value} onChange={handleChange}  className={classes.bar}>
              <Tab label="Join Room"  />
              <Tab label="Create Room"  />
            </Tabs>
        </AppBar>
        <CardContent>
          <RenderRoom value={value} classes={classes} name={name} setName={setName} setRoom={setRoom} room={room}/>
        </CardContent>
        <CardActions>
          <Button className={classes.test1} value={buttonName} onClick={()=> joinRoom(buttonName, room, name, history)}>{buttonName}</Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default CardFormat;
