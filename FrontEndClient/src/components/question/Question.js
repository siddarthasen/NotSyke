import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import   {withStyles, Avatar, Divider, CardHeader, List, ListItemText, ListItem
} from '@material-ui/core';
 import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../store/actions'
import { useHistory } from "react-router-dom";
import './Question.css';


let color
let socket;

const useStyles = makeStyles((theme) => ({
  Button: {
    "&:hover": {
      backgroundColor: ({ color}) => `${color}`
    },
    borderColor: ({color}) => `${(color)}`,
  }, 

}));

const Game = (props) => {
  let history = useHistory();
  //Access redux state tree:
  if(props.location.state == undefined){
    history.push('/')
  }
  let members = useSelector(state=> state.members)
  let socket = useSelector(state=> state.socket)
  let roomID = useSelector(state => state.roomID)
  let name = useSelector(state => state.name)
  color = useSelector(state => state.color)
  const classes = useStyles({color});


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
      <Card id="card-question">
      <Grid container alignItems="center" direction="column">
        <CardContent>
          <div id="question-div">
            <Typography id="question">{question}</Typography>
          </div> 
          <Grid item justify="center">
            <InputBase
              multiline
              id="answer-box"
              rows={10}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              />
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




