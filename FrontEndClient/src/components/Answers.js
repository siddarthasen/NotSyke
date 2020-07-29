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
import CardFormat from './CardFormat'
import {
  withStyles, Avatar, Divider, CardHeader, List, ListItemText, ListItem
} from '@material-ui/core';
 import { Spring } from 'react-spring/renderprops'
 import { useSelector, useDispatch } from 'react-redux';
import * as actions from './actions'
import { useHistory } from "react-router-dom";
import Chip from '@material-ui/core/Chip';
import Slide from '@material-ui/core/Slide';
import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
let socket;

const useStyles = makeStyles((theme) => ({
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
  card: {
    borderRadius: 40,
    height: 550,
    width: 700,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black'
  },
  title: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 45,
    fontFamily: 'Segoe Print',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
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
    alignSelf: 'center',
    color: 'white'
  },
  test1: {
    color: 'black',
    flex: 1,
    marginLeft: 200,
    marginRight: 200,
    height: 49,
    width: 300,
    alignItems: 'center',
    fontSize: 25,
    fontFamily: 'Segoe Print',
    fontColor: 'white',
    jusitfyContent: 'center'
  },
  text2: {
    color: 'black',
    flex: 1,
    alignItems: 'center',
    fontSize: 25,
    fontFamily: 'Segoe Print',
    fontColor: 'white',
    jusitfyContent: 'center',
    margin: 3,
    height: 40
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}));

const Answers = (props) => {
  var count = 0;
  const classes = useStyles();
  //Access redux state tree:
  let members = useSelector(state=> state.members)
  let creator = useSelector(state=> state.creator)
  let socket = useSelector(state=> state.socket)
  let roomID = useSelector(state => state.roomID)
  let loading = useSelector(state => state.loading)
  let name = props.location.state.name
  let room = props.location.state.room
  let answer = props.location.state.answer
  let question = props.location.state.question
  const [slide, setSlide] = useState(false);
  const [open, setOpen] = React.useState(false);
  
  const dispatch = useDispatch()
  const [ID, setID] = useState([]);
  const [answers, setAnswers] = useState([])
  const [choice, setChoice] = useState(false);
  const [renderPoints, setrenderPoints] = useState(false)
  const [points, setPoints] = useState([])//place in redux so we can dd animation of number increasing
  const [player, setPlayers] = useState([]);
  let history = useHistory();

  useEffect(() => {
    socket.on('answers', (answerInfo) => {
      let answer = answerInfo.answerInfo.map(({answer}) => answer)
      let id = answerInfo.answerInfo.map(({id}) => id) 
      setAnswers(answer)
      setID(id)
      console.log(answer, id)
      setSlide(true)
    })
  })

  useEffect(() => {
    socket.on('start', (start) => {
      history.push('/Game', {name: name, room: room})
    })
  })

  useEffect(() => {
    socket.on('choices', (choiceInfo) => {
      dispatch({type: 'PASS_SCREEN'})
      if(renderPoints === false)
      {
        let players = choiceInfo.choiceInfo.map(({name}) => name)
        let points = choiceInfo.choiceInfo.map(({points}) => points) 
        setPlayers(players)
        setPoints(points)
        setrenderPoints(true)
        console.log(players)
      }
      // history.push('/Game', {name: name, room: room})
    })

  })

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
    return array
  }

  const sendChoice = (index) => {
    if(answers[index] === answer)
    {
      alert("Cant choice cuz urs")
    }
    else 
    {
      setOpen(true)
      dispatch(actions.sendChoice(roomID, ID[index], socket))
      setChoice(true)
    }
  }

  const movePage = () => {
    setOpen(true)
    dispatch(actions.nextQuestion(roomID, socket, (update) => {
      clearInterval(timer)
      history.push('/Game', {name: name, room: room})
    }))
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
  <Card className={classes.card}>
  <Typography style={{fontSize: 30,
    fontFamily: 'Segoe Print',
    textAlign: 'center',
    padding: 10}}>Scores</Typography>
  {player.map((item, i) => (
       <List key={i}>
         <ListItem key={i} style={{margin: 2}}>
  <Typography   style={{display: 'flex', margin: 5, fontSize: 25, padding: 3, justifyContent: 'left', fontFamily: 'Segoe Print'}}>{renderSentence(item, points[i])}</Typography>
         </ListItem>
         <Divider />
     </List>
     ))}
          <AwesomeButton className={classes.test1} type="secondary" ripple onPress={movePage}>Next question</AwesomeButton>
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
    <div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    <Grid item direction="column">
    <Grid 
    container
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
    <Card className={classes.card}>
  <Typography className={classes.question}>{question}</Typography>

  {answers.map((item, i) => (
    <List key={i} style={{display: 'flex', flex: 1, justifyContent: 'center'}}>
                          <Slide direction="up" in={slide} mountOnEnter unmountOnExit timeout={1000}>                        
                          <Grid contanier jusitfy="flex-start" alignItem="flex-start">
                          <AwesomeButton className={classes.text2} type="secondary" ripple onPress={() => sendChoice(i)}>{item}</AwesomeButton>
                        </Grid>
                        </Slide>
                    </List>    ))}

  </Card>
  </div>
    )}
    </Spring>
    </Grid>
    </Grid>
    </div>
  )
}

}

export default Answers;



//@HArry:
//TO DO LIST:
//fix answr.js for conditional rendering
//routing back to promtp screen on screen press
//need to add the "waiting on people"
//error checking for begginging
//have some sort of end game button so game can end on comand
