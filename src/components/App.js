import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import TransitionGroup from "react-transition-group/TransitionGroup";

import WorkPage from './WorkPage';
import ProfilePage from './ProfilePage';
import ProjectPage from './ProjectPage';

import { TweenMax } from 'gsap';

const firstChild = props => {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
};

const App = () => (
  <BrowserRouter>
    <main className="pl-2 pr-2">
      <Switch>
        <Route
          exact
          path="/"
          component={WorkPage} />
        <Route
          exact
          path="/profile"
          component={ProfilePage} />
        <Route
          exact
          path="/projects/:id"
          component={ProjectPage} />
      </Switch>
    </main>
  </BrowserRouter>
)

export default App;
