import React, {useState, useEffect} from 'react';
import queryString from 'query-string'
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
import Particles from 'react-particles-js'

let socket;

const useStyles = makeStyles({
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const Chat = ({location}) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [value, setValue] = React.useState(0);

  const classes = useStyles();
  const ENDPOINT = 'http://ec2-13-59-225-36.us-east-2.compute.amazonaws.com:5000/'
  // useEffect(() => {
  //   const {name, room} = queryString.parse(location.search)
  //   socket = io(ENDPOINT);
  //   setName(name);
  //   setRoom(room);
  //   console.log(room, name)
  //   socket.emit('join', {name, room}, (error) => {
  //     // alert(error)
  //   });
  //   return() => {
  //     socket.emit('disconnect');
  //
  //     socket.off();
  //   }
  // }, [ENDPOINT, location.search])


const sendRequest = () => {
  // console.log(name, room)
  // socket = io(ENDPOINT);
  //   socket.emit('join', {name, room}, (error) => {
  //     // alert(error)
  //   });
}

  //used for displaying the UI for the homepage depending on the create/join
  const displayPrompt = (value) =>
  {
    if(value === 0)
    {
    return(
      <CardFormat
      value={value}
      handleChange={handleChange}
      buttonName={"Join Room"}
      name={name}
      setName={setName}
      room={room}
      setRoom={setRoom}
      sendRequest={sendRequest}/>
    )
  }
  else
  {
    return(
      <CardFormat
      value={value}
      handleChange={handleChange}
      buttonName={"Create Room"}
      name={name}
      setName={setName}
      room={room}
      setRoom={setRoom}
      sendRequest/>
    )
  }
  }

  const handleChange = (event, newValue) => {
    console.log(newValue)
    setValue(newValue);
  };

  const canvasStyle = {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: '0',
    left: '0'
  };

  return (
    <div>
      <Particles className="particles" style={canvasStyle} params={{
  "particles": {
    "number": {
      "value": 15,
      "density": {
        "enable": true,
        "value_area": 1600
      }
    },
    "color": {
      "value": "#ebedfa"
    },
    "shape": {
      "type": "images",
      "stroke": {
        "width": 0,
        "color": "#000"
      },
      "polygon": {
        "nb_sides": 6
      },
      "image":  [ {
        "src": "https://media.discordapp.net/attachments/729673704778366986/733760176577970296/laugh.png",
        "width": 20,
        "height": 20
      },
      {
      "src": "https://media.discordapp.net/attachments/729673704778366986/733760179039895671/brain.png?width=676&height=676",
      "width": 20,
      "height": 20
    },
    {
      "src": "https://media.discordapp.net/attachments/729673704778366986/733760159788171385/lightbulb.png?width=676&height=676",
      "width": 20,
      "height": 20
    }]},
    "opacity": {
      "value": 0.3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 64.06919473030872,
      "random": false,
      "anim": {
        "enable": true,
        "speed": 10,
        "size_min": 40,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 200,
      "color": "#ffffff",
      "opacity": 1,
      "width": 2
    },
    "move": {
      "enable": true,
      "speed": 8,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": true,
      "attract": {
        "enable": true,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 1,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}} />
            <Spring
      from={{ transform: 'translate3d(0,-800px,0)' }}
      to={{ transform: 'translate3d(0,0px,0)' }}>
      {props => (
        <div style={props}>
        {displayPrompt(value)}
      </div>
    )}
      </Spring>
    </div>
  );
}

export default Chat;
