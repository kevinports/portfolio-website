import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Transition from "react-transition-group/Transition";

import WorkPage from './WorkPage';
import ProfilePage from './ProfilePage';
import ProjectPage from './ProjectPage';

import { TweenLite } from 'gsap';

class Main extends React.Component {
  constructor (props) {
    super(props);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleExit = this.handleExit.bind(this);
    this.handleEntered = this.handleEntered.bind(this);
    this.handleExited = this.handleExited.bind(this);
    this.handleEntering = this.handleEntering.bind(this);
    this.handleExiting = this.handleExiting.bind(this);
    this.previousLocation = 'BOOT';
  }

  handleEnter (el) {
    console.log('handle enter')
    console.log(el)
    TweenLite.set(el, {
      y: 20,
      alpha: 0
    })
    TweenLite.to(el, 0.4, {
      y: 0,
      alpha: 1,
      delay: 0.4,
      ease: Circ.easeOut
    })
  }

  handleEntering (el) {
    console.log('handle entering')
  }

  handleEntered (el) {
    console.log('handle entered')
  }

  handleExit (el) {
    console.log('handle exit')
    TweenLite.set(el, {
      y: 0,
      alpha: 1
    })
    TweenLite.to(el, 0.4, {
      y: 20,
      alpha: 0,
      ease: Circ.easeInOut
    })
  }

  handleExiting () {
    console.log('handle exiting')
  }

  handleExited () {
    console.log('handle exited')
  }

  render () {
    const { location } = this.props
    const currentKey = location.key;
    const timeout = { enter: 3000, exit: 2000 }

    console.log(this.previousLocation + ' to '  +location.pathname)
    this.previousLocation = location.pathname;

    return (
      <TransitionGroup>
        <Transition
          key={currentKey}
          timeout={timeout}
          mountOnEnter={true}
          unmountOnExit={true}
          onEnter={this.handleEnter}
          onExit={this.handleExit}
          onEntered={this.handleEntered}
          onExited={this.handleExited}onEntered={this.handleEntered}
          onExited={this.handleExited} >
            <main className="pl-2 pr-2 transition-wrapper">
              <Switch location={location}>
                <Route path="/" exact component={WorkPage} />
                <Route path="/profile" exact component={ProfilePage} />
              </Switch>
            </main>
          </Transition>
      </TransitionGroup>
    )

    ;
  }
}


export default Main;
