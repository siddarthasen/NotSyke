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
import InputBase from '@material-ui/core/InputBase';
import CardFormat from '../home/card-format/CardFormat'
import {
  withStyles, Avatar, Divider, CardHeader, List, ListItemText, ListItem
} from '@material-ui/core';
 import { Spring } from 'react-spring/renderprops'
 import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../store/actions'
import { useHistory } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from 'react-awesome-button';
import { Beforeunload } from 'react-beforeunload';
import './Question.css';
let socket;

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    borderRadius: 40,
    height: 550,
    width: 700,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black'
  },
  button: {
    justifyContent: 'center',
    fontSize: 30,
    margin: 20
  },
  square: {
    justifyContent: 'space-between'
  },
  answer: {
    width: 540,
    height: 300,
    fontSize: 25,
    flex: 1,
    flexWrap: 'wrap',
    padding: 20,
    fontFamily: 'Segoe Print'
    
  },
  question: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    fontSize: 25,
    padding: 15,
    paddingLeft: 25,
    margin: 10,
    fontFamily: 'Segoe Print'
  },
  answerBox: {
    width: 550,
    height: 325
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
    fontColor: 'white',
    width: 200,
    marginTop: 30
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}));

const Game = (props) => {
  let history = useHistory();
  //Access redux state tree:
  if(props.location.state == undefined){
    history.push('/')
  }
  console.log(props.match)
  let members = useSelector(state=> state.members)
  let socket = useSelector(state=> state.socket)
  let roomID = useSelector(state => state.roomID)
  let name = useSelector(state => state.name)
  const classes = useStyles();


let question = useSelector(state=> state.question)

const [answer, setAnswer] = useState('')
const [open, setOpen] = React.useState(false);
  
  const dispatch = useDispatch()
  
  useEffect(() => {
    try{
    dispatch(actions.requestPrompt(roomID, socket, history))
    }
    catch(err){
      dispatch({type: 'RESET_USER'})
      history.push('/')
    }

},[]);

const submitAnswer = (event) => {
  setOpen(true)
  dispatch(actions.submitAnswer(roomID, name, answer, socket, question))
  history.push('/Answers', {name: name, room: roomID, answer: answer, question: question})
}

// function stop(event)
// {
//     socket.emit('remove_user', {roomID: roomID, name: name, part: 'questions'})
//     dispatch({type: 'RESET_USER'})
//     history.push('/')
//   // }
// } 
window.onbeforeunload = function() {
      socket.emit('remove_user', {roomID: roomID, name: name, part: 'questions'})
    dispatch({type: 'RESET_USER'})
    history.push('/')
}

  return (
<Grid 
  container
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '90vh' }}>
    <Typography id="room">RoomID: {roomID}</Typography>
      <Card id="card-waiting">
      <Grid container alignItems="center" direction="column">
        <CardContent >
              <Typography id="waiting">{question}</Typography>
              <Grid item justify="center">
                  <Box border={3} borderRadius={40} className={classes.answerBox}>
                    <InputBase
                      placeholder="Enter Your Answer"
                      multiline
                      className={classes.answer}
                      rows={10}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      />
                  </Box>
              </Grid>
        </CardContent>
        <div id="submit-button-div">
          <Button id="submit-button" variant="outlined" className={classes.Button} onClick={submitAnswer}>Submit</Button>
          </div>
        </Grid>
      </Card>
  </Grid>
  );
}

export default Game;




