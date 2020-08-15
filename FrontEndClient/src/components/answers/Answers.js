import React, {useState, useEffect, useRef} from 'react';
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
import {
  withStyles, Avatar, Divider, CardHeader, List, ListItemText, ListItem
} from '@material-ui/core';
 import { Spring } from 'react-spring/renderprops'
 import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../store/actions'
import { useHistory } from "react-router-dom";
import Chip from '@material-ui/core/Chip';
import Slide from '@material-ui/core/Slide';
import { AwesomeButton } from "react-awesome-button";
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Zoom from '@material-ui/core/Zoom';
import './Answer.css';
let socket, color;

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  Button: {
    "&:hover": {
      backgroundColor: ({ color}) => `${color}`
    },

    borderColor: ({color}) => `${(color)}`,


  }, 
}));

const Answers = (props) => {
  var count = 0;
  color = useSelector(state => state.color)
  const classes = useStyles({color});
  //Access redux state tree:
  let test = useSelector(state => state)
  console.log(test)
  let members = useSelector(state => state.members)
  let creator = useSelector(state => state.creator)
  let socket = useSelector(state => state.socket)
  let roomID = useSelector(state => state.roomID)
  let loading = useSelector(state => state.loading)
  let name = useSelector(state => state.name)
  let answer = useSelector(state => state.answer)
  let question = useSelector(state => state.question)
  let userID = useSelector(state => state.userID)
  const [slide, setSlide] = useState(false);
  const [open, setOpen] = React.useState(false);
  
  const dispatch = useDispatch()
  const [ID, setID] = useState([]);
  const [answers, setAnswers] = useState([])
  const [choice, setChoice] = useState(false);
  const [renderPoints, setrenderPoints] = useState(false)
  const [points, setPoints] = useState([])//place in redux so we can dd animation of number increasing
  const [player, setPlayers] = useState([]);
  const [exit, setExit] = useState(false);
  let history = useHistory();

  window.onbeforeunload = function() {
    if(renderPoints)
    {
      socket.emit('remove_user', {roomID: roomID, name: name, part: 'points'})
    }
    else
    {
      socket.emit('remove_user', {roomID: roomID, name: name, part: 'answers'})
    }
  dispatch({type: 'RESET_USER'})
  history.push('/')
}

  useEffect(() => {
    try{
    socket.on('displayAnswers', (answerInfo) => {
      let answer = answerInfo.answerInfo.map(({answer}) => answer)
      let id = answerInfo.answerInfo.map(({id}) => id) 
      setAnswers(answer)
      setID(id)
      setSlide(true)
    })
  }
  catch(err){
    history.push('/')
  }
  })

  useEffect(() => {
    try{
    socket.on('start', (start) => {
      history.push('/Game', {name: name, room: roomID})
    })
    }
    catch(err){
      history.push('/')
    }
  })

  useEffect(() => {
    try{
    socket.on('displayPoints', (choiceInfo) => {
      dispatch({type: 'PASS_SCREEN'})
      if(renderPoints === false)
      {
        let players = choiceInfo.choiceInfo.map(({name}) => name)
        let points = choiceInfo.choiceInfo.map(({points}) => points) 
        let exit = choiceInfo.choiceInfo[0].exit
        console.log(choiceInfo)
        setPlayers(players)
        setPoints(points)
        setrenderPoints(true)
        setExit(exit)
      }
      // history.push('/Game', {name: name, room: room})
    })
  }
  catch(err){
    history.push('/')
  }

  })

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array
  }

  const chooseAnswer = (index) => {
      setOpen(true)
      dispatch(actions.chooseAnswer(roomID, ID[index], socket))
      setChoice(true)
  }

  const checkValidAnswer = (index) => {
    if(ID[index] === userID){
      console.log(userID, ID[index])
      return false
    }
    else{
      return true
    }
  }

  const movePage = () => {
    if(!exit){
    setOpen(true)
    dispatch(actions.nextQuestion(roomID, socket, (update) => {
      clearInterval(timer)
      history.push('/Game', {name: name, room: roomID})
    }))
  }
  else{
    //CHECK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    socket.emit('remove_user', {roomID: roomID, name: name, part: 'waiting'})
    dispatch({type: 'RESET_USER'})
    history.push('/')
  }
  }

  const renderSentence = (player, points) => {
    return(
      `${player} has ${points} points`
    )
  }

  const timer = setInterval(function(){
    count++;
    if(document.getElementById('loadingtext1'))
    {
    document.getElementById('loadingtext1').innerHTML = "Waiting for People to Answer" + new Array(count % 5).join('.');
    }
  }, 1000);

if(renderPoints)
{
  clearInterval(timer)



  return (
    <div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid item direction="column">
        <Grid container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}>
          <Spring
            from={{ transform: 'translate3d(0,0px,0)' }}
            to={{ transform: 'translate3d(0,0px,0)' }}>
            {props => (
              <div style={props}>
            <Box border={3} borderRadius={40}>
              <Card id="card-answers">
              <Typography style={{fontSize: 30,
                fontFamily: 'Segoe Print',
                textAlign: 'center',
                padding: 10}}>
                  Scores
              </Typography>
              <List id="scroll" style={{overflow: 'auto', height: 300}}>
                {player.map((item, i) => (
                    <ListItem key={i} style={{margin: 2}}>
                      <Typography 
                        style={{display: 'flex', margin: 5, fontSize: 25, 
                              padding: 3, justifyContent: 'left', fontFamily: 'Segoe Print'}}>
                        {renderSentence(item, points[i])}
                      </Typography>
                    </ListItem>
                    ))}
                    <Divider/>
              </List>
                
                {exit ? <AwesomeButton id="bottom-buttons" type="secondary" 
                                      ripple onPress={movePage}>Exit</AwesomeButton> : 
                        <AwesomeButton id="bottom-buttons" type="secondary" 
                                      ripple onPress={movePage}>Next question</AwesomeButton>}
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
else
{
  clearInterval(timer)
  // setSlide(true)
  return(
    <Grid 
  container
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '90vh' }}>
    <Typography id="room">RoomID: {roomID}</Typography>
    <Zoom in={slide} out={slide}>
      <Card id="card-waiting">
      <Grid container alignItems="center" direction="column">
        <CardContent >
            <Typography id="question">{question}</Typography>
              <List id="scroll" style={{overflow: 'auto', height: 300}}>
                {answers.map((item, i) => (
                    <ListItem key={i}>
                      <Slide direction="up" in={slide} mountOnEnter unmountOnExit>
                        <Grid contanier jusitfy="flex-start" alignItem="flex-start">
                        {checkValidAnswer(i) ? <Button className={classes.Button} id="choice-buttons" variant="outlined"
                                                 type="secondary" onClick={() => chooseAnswer(i)}>{item}</Button> : <Button id="choice-buttons" variant="outlined" type="secondary" className={classes.Button} disabled>{item}</Button>}
                        </Grid>
                      </Slide>
                    </ListItem>
                  ))}
              </List>
        </CardContent>
        </Grid>
      </Card>
      </Zoom>
  </Grid>
  )
}

}

export default Answers;