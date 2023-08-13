import './reset.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import history from './history';

import { Top } from "./pages/Top";
import { Room } from "./pages/Room";

export const App = () => {
  return (
    <Router history={history}>
      <Routes>
        <Route
          path='/'
          element={<Top />}
        />
        <Route
          path='/room/:roomId'
          element={<Room />}
        />
      </Routes>
    </Router>
  );
};
