import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css';

import Landing from './pages/Landing';
import Game from './pages/Game';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/launchpad' element={<Landing />}></Route>
          <Route path='/game/:roomId' element={<Game />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
