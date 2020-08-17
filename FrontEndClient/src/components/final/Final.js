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
import './Final.css';

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

    // borderColor: ({color}) => `${(color)}`,


  }, 
}));

const Final = (props) => {
  color = useSelector(state => state.color)
  const classes = useStyles({color});
  //Access redux state tree:
  let test = useSelector(state => state)
  // let members = useSelector(state => state.members)
  let creator = useSelector(state => state.creator)
  let socket = useSelector(state => state.socket)
  let roomID = useSelector(state => state.roomID)
  let loading = useSelector(state => state.loading)
  let name = useSelector(state => state.name)
  let answer = useSelector(state => state.answer)
  let question = useSelector(state => state.question)
  let userID = useSelector(state => state.userID)
  let players = useSelector(state => state.members)
  let history = useHistory();
  let points = useSelector(state => state.points);

  // if(players == undefined || players.length < 1){
  //   history.push('/')
  // }
  const [slide, setSlide] = useState(false);
  const [open, setOpen] = useState(false);
  const [winners, setWinners] = useState([]); // change the winners name to players
  
  const dispatch = useDispatch()
  // useEffect(() => {
  //   findWinners()
  // })
    const exitPage = () => {
        socket.emit('remove_user', {roomID: roomID, name: name, part: 'waiting'})
        dispatch({type: 'RESET_USER'})
        history.push('/')
    }
    const findWinners = () => {
      //function for finding players that highest score
      let retArray = [];
      let winners = [];
      let losers = [];
      let obj = {};
      obj.player = players.shift();
      obj.points = points.shift();
      winners.push(obj);
      while (players) {
        if (points[0] < winners[0].points) {
          while (players) {
            let obj = {};
            obj.player = players.shift();
            obj.points = points.shift();
            losers.push(obj);
          }
          retArray[1] = losers;
        } else {
          let obj = {};
          obj.player = players.shift();
          obj.points = points.shift();
          winners.push(obj);
        }
      }
      retArray[0] = winners;
      return retArray;
    }

    window.onbeforeunload = function() {
      socket.emit('remove_user', {roomID: roomID, name: name, part: 'end'})
      dispatch({type: 'RESET_USER'})
      history.push('/')
    }
    window.onpopstate = function() {
      socket.emit('remove_user', {roomID: roomID, name: name, part: 'end'})
      dispatch({type: 'RESET_USER'})
      history.push('/')
    }
    const movePage = () => {
      setOpen(true)
      dispatch({type: 'RESET_USER'})
      socket.emit('remove_user', {roomID: roomID, name: name, part: 'end'})
      history.push('/')
    }

    return(
        <Grid 
        container
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '90vh' }}>
          <Typography id="room">RoomID: {roomID}</Typography>
            <Card id="card-final">
            <Grid container alignItems="center" direction="column">
              <CardContent >
                  <Typography id="winner-title">The Winner is... </Typography>
                  <List id="scroll" style={{overflow: 'auto', height: 300}}>
                  {winners ? winners.map((item, i) => (
                      <ListItem key={i}>
                        <div id="winner-info-final">
                          <Typography id="winner-final">{item}</Typography>
                          <Typography id="winner-final">{points[i]}</Typography>
                        </div>
                      </ListItem>
                      )): null}
                    {players ? players.map((item, i) => (
                        <ListItem key={i}>
                          <div id="loser-info-final">
                            <Typography id="loser-final">{item}</Typography>
                            <Typography id="loser-final">{points[i]}</Typography>
                          </div>
                      </ListItem>
                      )): null}
                  </List>
              </CardContent>
              <Button id="bottom-buttons" type="secondary" onClick={movePage}>Exit</Button>
              </Grid>
            </Card>
        </Grid>
      )

}



export default Final