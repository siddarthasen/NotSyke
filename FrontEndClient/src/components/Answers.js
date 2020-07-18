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
import CardFormat from './CardFormat'
import {
  withStyles, Avatar, Divider, CardHeader, List, ListItemText, ListItem
} from '@material-ui/core';
 import { Spring } from 'react-spring/renderprops'
 import { useSelector, useDispatch } from 'react-redux';
import * as actions from './actions'
import { useHistory } from "react-router-dom";
let socket;


const useStyles = makeStyles({
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const Answers = (props) => {
  //Access redux state tree:
  let members = useSelector(state=> state.members)
  let creator = useSelector(state=> state.creator)
  let socket = useSelector(state=> state.socket)
  let roomID = useSelector(state => state.roomID)
  let name = props.location.state.name
  let room = props.location.state.room
  let answer = props.location.state.answer
  
  const dispatch = useDispatch()
  const [ID, setID] = useState([]);
  const [answers, setAnswers] = useState([])
  const [choice, setChoice] = useState('');
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
    })
  })

  useEffect(() => {
    socket.on('start', (start) => {
      history.push('/Game', {name: name, room: room})
    })
  })

  useEffect(() => {
    socket.on('choices', (choiceInfo) => {
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
      console.log(roomID)
      dispatch(actions.sendChoice(roomID, ID[index], socket))
    }
    setChoice(choice)
  }

  const movePage = () => {
    dispatch(actions.startGame(roomID, socket, (update) => {
      history.push('/Game', {name: name, room: room})
    }))
  }


if(renderPoints)
{
  console.log("The creator is" + creator)
  return (
   <div>
   <Grid item direction="column">
     {player.map((item, i) => (
       <Card style={{margin: 10}}>
         <List key={i}>
           <ListItem key={i} style={{margin: 15}}>
             <h1>{item} has {points[i]} points</h1>
           </ListItem>
       </List>
     </Card>
       ))}
       {creator ? <Button onClick={movePage}>Next</Button> : null}
   </Grid>
   </div>
  );
}
else
{
  return(
    <div>
    <Grid item direction="column">
  {answers.map((item, i) => (
    <Card style={{margin: 10}}>
      <List key={i}>
        <ListItem key={i} style={{margin: 15}}>
          <Button onClick={() => sendChoice(i)}><ListItemText id={i} primary={item}/></Button>
        </ListItem>
    </List>
  </Card>
    ))}
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
