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
import CardFormat from './CardFormat'
import {
  withStyles, Avatar, Divider, CardHeader, List, ListItemText, ListItem
} from '@material-ui/core';
 import { Spring } from 'react-spring/renderprops'
 import { useSelector, useDispatch } from 'react-redux';
import * as actions from './actions'
import { useHistory } from "react-router-dom";
import Box from '@material-ui/core/Box';
import {
  AwesomeButton,
  AwesomeButtonProgress,
  AwesomeButtonSocial,
} from 'react-awesome-button';
let socket;


const useStyles = makeStyles({
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
    padding: 20
    
  },
  question: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    fontSize: 25,
    padding: 15,
    paddingLeft: 25,
    margin: 10,
    fontFamily: 'Chiller'
  },
  answerBox: {
    width: 550,
    height: 325
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
  const classes = useStyles();


let question = useSelector(state=> state.question)

const [answer, setAnswer] = useState('')
  
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(actions.requestPrompt(roomID, socket))

},[]);

const submitAnswer = (event) => {
  dispatch(actions.sendAnswer(roomID, name, answer, socket))
  console.log(answer)
  history.push('/Answers', {name: name, room: room, answer: answer})
}


  return (
    <div>
            <Grid container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}>
      <Card className={classes.card}>
        <Grid container direction="column" justify="space-between"  alignItems="center" className={classes.square}>
            <Typography className={classes.question}>If parshva was 10 hwo is he? thoth tr htr hhoth  t rhjtohjtrhjo fdbd dbf dfb </Typography>
            <Grid item justify="center">
              <Box border={3} borderRadius={40} className={classes.answerBox}>
        <InputBase
        multiline
        className={classes.answer}
        rows={10}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        />
        </Box>
        </Grid>
        <Button variant="contained" color="primary"  onClick={submitAnswer} className={classes.button}>Submit</Button>
        </Grid>
      </Card>
      </Grid>
    </div>
  );
}

export default Game;
