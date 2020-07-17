import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Waiting from './components/Waiting'
import Chat from './components/Chat'
import Game from './components/Game'
import Answers from './components/Answers'
import Particles from 'react-particles-js'

const App = () => (
  <Router>
    <Route path="/" exact component={Chat} />
    <Route path="/Waiting" component={Waiting} />
    <Route path="/Game" component={Game} />
    <Route path="/Answers" component={Answers} />
    
  </Router>
)

export default App;
