import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Waiting from './components/Waiting'
import Chat from './components/Chat'
import Game from './components/Game'
import Answers from './components/Answers'
import Particles from 'react-particles-js'


const App = () => (
  
  <Router>
      <Particles style={{width: '10%',
  height: '100%',
  position: 'fixed',
  top: '0',
  left: '0'}} params={{
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
    <Route path="/" exact component={Chat} />
    <Route path="/Waiting" component={Waiting} />
    <Route path="/Game" component={Game} />
    <Route path="/Answers" component={Answers} />
    
  </Router>
)

export default App;
