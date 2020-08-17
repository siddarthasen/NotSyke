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
import Modal from '@material-ui/core/Modal';
let socket, color, secondaryColor;

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  Button: {
    "&:hover": {
      backgroundColor: ({ color}) => `${color}`
    },
    borderColor: ({color}) => `${(color)}`
  },
  modal: {
    backgroundColor: ({ secondaryColor}) => `${secondaryColor}`
  } 
}));

const Answers = (props) => {
  var count = 0;
  color = useSelector(state => state.color)
  secondaryColor = useSelector(state => state.secondaryColor)
  const classes = useStyles({color,secondaryColor});
  //Access redux state tree:
  let test = useSelector(state => state)
  let members = useSelector(state => state.members)
  let creator = useSelector(state => state.creator)
  let socket = useSelector(state => state.socket)
  let roomID = useSelector(state => state.roomID)
  let loading = useSelector(state => state.loading)
  let name = useSelector(state => state.name)
  let question = useSelector(state => state.question)
  let userID = useSelector(state => state.userID)
  let temp = useSelector(state => state)
  const [display, setDisplay] = useState(false);
  const [slide, setSlide] = useState(false);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch()
  const [ID, setID] = useState([]);
  const [answers, setAnswers] = useState([])
  const [choice, setChoice] = useState(false);
  const [renderPoints, setrenderPoints] = useState(false)
  const [points, setPoints] = useState([])//place in redux so we can dd animation of number increasing
  const [player, setPlayers] = useState([]);
  const [useranswer, setuserAnswers] = useState([]);
  const [exit, setExit] = useState(false);
  const [clicked, setClicked] = useState(false)
  const rootRef = useRef(null);
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
      setDisplay(true)
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
      history.push('/Question', {name: name, room: roomID})
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
      console.log(choiceInfo)
      if(renderPoints === false)
      {
        let players = choiceInfo.choiceInfo.map(({name}) => name)
        let points = choiceInfo.choiceInfo.map(({points}) => points) 
        let answer = choiceInfo.choiceInfo.map(({answer}) => answer) 
        let exit = choiceInfo.choiceInfo[0].exit
        setPlayers(players)
        setPoints(points)
        setuserAnswers(answer)
        dispatch({type: 'SET_FINAL_SCORES', payload: {player: players, points: points}})
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



  const chooseAnswer = (index) => {
      setOpen(true)
      dispatch(actions.chooseAnswer(roomID, ID[index], socket))
      setChoice(true)
  }

  const checkValidAnswer = (index) => {
    if(ID[index] === userID){
      return false
    }
    else{
      return true
    }
  }

  const movePage = () => {
    console.log(exit)
    if(!exit){
    setOpen(true)
    setClicked(true)
    dispatch(actions.nextQuestion(roomID, socket, name, history, () => {
      history.push('/Question')
    }))
  }
  else{
    //CHECK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // socket.emit('remove_user', {roomID: roomID, name: name, part: 'waiting'})
    // dispatch({type: 'RESET_USER'})
    history.push('/Final')
  }
  }

  // const renderSentence = (player, points) => {
  //   return(
  //     `${player} has ${points} points`
  //   )
  // }

if(renderPoints)
{
  return (
    <Grid 
    container
    direction="column"
    alignItems="center"
    justify="center"
    style={{ minHeight: '90vh' }}>
      <Typography id="room">RoomID: {roomID}</Typography>
      <Zoom in={slide} out={slide}>
        <Card id="card-answer">
        <Grid container alignItems="center" direction="column"></Grid>
          <CardContent>
            <Typography id="score-title">Scores</Typography>
            <List id="scroll" style={{overflow: 'auto', height: 300}}>
              {player.map((item, i) => (
                <Grid container direction="column">
                  <ListItem key={i}>
                    <div id="all-info">
                      <div id="player-info">
                        <Typography id="player">{item}</Typography>
                        <Typography id="answer">{useranswer[i]}</Typography>
                      </div>
                      <div id="points-div">
                        <Typography id="points">{points[i]}</Typography>
                      </div>
                    </div>
                    
                </ListItem>
                <Divider component="li" variant="middle" className="line"/>
                </Grid>
                ))}
            </List>
          </CardContent>
          <div id="button-div">
          {exit ? <Button id="bottom-buttons" type="secondary" variant="outlined" className={classes.Button}
                          onClick={movePage} >Who won???</Button> : 
                  <Button id="bottom-buttons" type="secondary" variant="outlined" className={classes.Button}
                          onClick={movePage} disabled={clicked} >Next question</Button>}
                          </div>
        </Card>
        </Zoom>
    </Grid>
  );
}
else
{
  // setSlide(true)
  return(
    <Grid 
  container
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '90vh' }}>
    <Typography id="room">RoomID: {roomID}</Typography>
    <Card id="card-answer">
    {display ? <Grid container alignItems="center" direction="column">
      <CardContent>
        <Typography id="question">{question}</Typography>
        <List id="scroll" style={{overflow: 'auto', height: 300}}>
          {answers.map((item, i) => (
              <ListItem key={i}>
                <Slide direction="up" in={slide} mountOnEnter unmountOnExit>
                  <Grid contanier jusitfy="flex-start" alignItem="flex-start">
                  {!choice && checkValidAnswer(i) ? 
                    <Button className={classes.Button} onClick={() => chooseAnswer(i)} 
                            id="choice-buttons" variant="outlined"
                            type="secondary" >{item}</Button> 
                  : <Button id="choice-buttons" variant="outlined" type="secondary" disabled
                            className={classes.Button}>{item}</Button>}
                  </Grid>
                </Slide>
              </ListItem>
            ))}
        </List>
      </CardContent>
      </Grid> :
      <Grid container alignItems="center" direction="column">
        <CardContent>
          <div id="question-div">
            <Typography id="question">{question}</Typography>
          </div> 
          <div id="waiting-question" ref={rootRef}>
            <Modal
              open
              aria-labelledby="server-modal-title"
              aria-describedby="server-modal-description"
              className={classes.modal}
              container={() => rootRef.current}
              >
                <Typography>Waiting For Answers...</Typography>
              </Modal>
           </div>
        </CardContent>
        </Grid>
      }
      </Card>
  </Grid>
  )
}

}

export default Answers;


/*
/* <Grid container direction="row" alignItems="center" 
                          justify="space-around" xs={12}>
                      <Grid container item direction="column" 
                                      jusitfy="center" xs={6}>
                        <Grid item>
                          <Typography id="player">{item}</Typography>
                        </Grid>
                        <Grid>
                          <Typography>{useranswer[i]}</Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={6} justify="center">
                        <Typography>{points[i]}</Typography>
                      </Grid>
                    </Grid> */
