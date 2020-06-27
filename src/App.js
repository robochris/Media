import React, {Component} from 'react';
import './App.css';
import Home from './Home.js'
import Login from './Login.js'
import SignUp from './SignUp.js'
import AddPost from './AddPost.js'
import Profile from './Profile.js'
import Video from './Video.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/video">Video</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/addPost">
            <AddPost/>
          </Route>
          <Route path="/SignUp">
            <SignUp/>
          </Route>
          <Route path="/video">
            <Video/>
          </Route>
          <Route path="/profile/:username" component={Profile}>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
