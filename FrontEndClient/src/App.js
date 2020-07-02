import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Waiting from './components/Waiting'
import Chat from './components/Chat'

const App = () => (
  <Router>
    <Route path="/" exact component={Chat} />
    <Route path="/Waiting" component={Waiting} />
  </Router>
)

export default App;
