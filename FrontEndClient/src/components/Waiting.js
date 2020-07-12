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
 import { Spring } from 'react-spring/renderprops'
 import { useSelector, useDispatch } from 'react-redux';
//import actions from actions.js
let socket;

const useStyles = makeStyles({
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const Waiting = (props) => {
  //Access redux state tree:
  let members = useSelector(state=> state.members)
  console.log(members)
  
  const dispatch = useDispatch()
  
  useEffect(() => {
    let name = props.location.state.name
    let room = props.location.state.room
    let endpoint = props.location.state.endpoint
    let type = props.location.state.type
    //assume this stuff is in action.js file
    socket = io(endpoint)
    socket.emit('join', {type, name, room}, (error) => {
        if(error)
        {
          alert(error);
        }
      });


    socket.on('message', (data) => console.log(data));
  },[])
  //inital to connect to Server

  useEffect(() => {
    socket.on('add_member', (data) => console.log(data));
  }, [members])




  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}

export default Waiting;
