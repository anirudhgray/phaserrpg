import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css';

import Landing from './pages/Landing';
import Game from './pages/Game';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Landing />}></Route>
          <Route path='/game/:roomId' element={<Game />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
