import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Transition from "react-transition-group/Transition";
import { TweenLite } from 'gsap';

import WorkPage from './WorkPage';
import ProfilePage from './ProfilePage';
import ProjectPage from './ProjectPage';

import data from '../data';
import transitions from '../base/transitions';
import GlobalStore from '../base/GlobalStore';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleEntered = this.handleEntered.bind(this);
    this.handleExit = this.handleExit.bind(this);

    this.state = {
      isTransitioning: false
    }

    this.transitionState = {
      previous: 'BOOT',
      next: '',
      direction: ''
    }
  }

  componentDidMount () {
    GlobalStore.listen();
  }

  handleEnter (el) {
    if (this.state.isTransitioning) return;
    this.setState({isTransitioning: true})
    const { previous, next, direction } = this.transitionState;

    if (previous === 'BOOT') {
      transitions[next.name].enter(el);
    } else {
      transitions[next.name][`onEnterFrom:${previous.name}`](el, direction);
    }
  }

  handleEntered (el) {
    this.setState({isTransitioning: false})
    this.transitionState.previous = this.transitionState.next;
    this.transitionState.direction = '';
    GlobalStore.scrollRoot = el; // since this is the root of scroll, not the window
  }

  handleExit (el) {
    const { previous, next, direction } = this.transitionState;
    transitions[previous.name][`onExitTo:${next.name}`](el, direction);
  }

  updateTransitionState () {
    const slugs = this.props.location.pathname.split('/')
    const param = (slugs[2]) ? '/' + slugs[2] : '';

    this.transitionState.next = {
      name: '/' + slugs[1],
      param: param
    }

    // if prev and next routes are projects, determine the direction of the transition
    if (slugs[2] && this.transitionState.previous.name === '/projects') {
      const prevSlug = this.transitionState.previous.param.replace('/', '');
      const nextSlug = slugs[2];
      const prevId = data.find((o) => o.slug === prevSlug).id;
      const nextId = data.find((o) => o.slug === nextSlug).id;
      let direction = '';

      if (prevId === 0 && nextId === data.length-1){
        direction = 'left'
      } else  if (nextId === 0 && prevId === data.length-1){
        direction = 'right'
      } else if (prevId > nextId) {
        direction = 'left'
      } else if (prevId < nextId) {
        direction = 'right'
      }

      this.transitionState.direction = direction;
    }
  }

  render () {
    const { location } = this.props
    const currentKey = location.key;
    const timeout = { enter: 600, exit: 600 }

    this.updateTransitionState();

    return (
      <TransitionGroup
        appear={true}
        component="main"
        className={this.state.isTransitioning ? ('animating') : ('') }>
        <Transition
          key={currentKey}
          timeout={timeout}
          mountOnEnter={true}
          unmountOnExit={true}
          onEnter={this.handleEnter}
          onEntered={this.handleEntered}
          onExit={this.handleExit} >
              <Switch location={location}>
                <Route path="/" exact component={WorkPage} />
                <Route path="/profile" exact component={ProfilePage} />
                <Route path="/projects/:id" exact component={ProjectPage} />
              </Switch>
          </Transition>
      </TransitionGroup>
    )
  }
}


export default App;
