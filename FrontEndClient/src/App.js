import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Waiting from './components/waiting/Waiting'
import Home from './components/home/Home'
import Question from './components/question/Question'
import Answers from './components/answers/Answers'

const App = () => (
  
  <Router>
    <Route path="/" exact component={Home} />
    <Route path="/Waiting" component={Waiting} />
    <Route path="/Question" component={Question} />
    <Route path="/Answers" component={Answers} />
  </Router>
)

export default App;
