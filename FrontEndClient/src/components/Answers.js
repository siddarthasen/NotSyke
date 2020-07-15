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
  let socket = useSelector(state=> state.socket)
  let roomID = useSelector(state => state.roomID)
  let name = props.location.state.name
let room = props.location.state.room
  
  const dispatch = useDispatch()
  const [answers, setAnswers] = useState([])
  const [choice, setChoice] = useState('')
  
  useEffect(() => {
    socket.on('answers', ({answers}) => {
        setAnswers(answers)
    console.log(answers)
    })
  })

  useEffect(()=> {
      socket.on('next_question', ({move}) => {
        history.push('/Game', {name: name, room: room})
      })
  })

  const sendChoice = (choice) => {
    setChoice(choice)
  }


  return (
    <div>
      <h1>Hello</h1>
      <Grid item direction="column">
      {answers.map((item, i) => (
                    <Card style={{margin: 10}}>
                      <List key={i}>
                        <ListItem key={i} style={{margin: 15}}>
                          <Button onClick={() => sendChoice(item)}><ListItemText id={i} primary={item}/></Button>
                        </ListItem>
                    </List>
                  </Card>
                    ))}
        </Grid>
    </div>
  );
}

export default Answers;
