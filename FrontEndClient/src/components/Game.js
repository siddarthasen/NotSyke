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

const Game = (props) => {
  let history = useHistory();
  //Access redux state tree:
  let members = useSelector(state=> state.members)
  let socket = useSelector(state=> state.socket)
  let roomID = useSelector(state => state.roomID)
  let name = props.location.state.name
let room = props.location.state.room
let endpoint = props.location.state.endpoint
let type = props.location.state.type


let question = useSelector(state=> state.question)

const [answer, setAnswer] = useState('')
  
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(actions.requestPrompt(roomID, socket))

},[]);

const submitAnswer = (event) => {
  dispatch(actions.sendAnswer(roomID, name, answer, socket))
  history.push('/Answers', {name: name, room: room})
}


  return (
    <div>
      <h1>Hello</h1>
      <h1>{question}</h1>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        />
        <Button onClick={submitAnswer}>Submit</Button>
    </div>
  );
}

export default Game;
