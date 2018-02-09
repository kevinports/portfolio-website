import { TweenMax, TimelineMax } from 'gsap';

const transitions = {

  '/': {
    'enter': pageTransitionEnter,
    'onExitTo:/profile': switchTransitionExit,
    'onEnterFrom:/profile': switchTransitionEnter,
    'onExitTo:/projects': pageTransitionExit,
    'onEnterFrom:/projects': zoomTransitionEnter,
  },

  '/profile': {
    'enter': pageTransitionEnter,
    'onExitTo:/': switchTransitionExit,
    'onEnterFrom:/': switchTransitionEnter,
    'onExitTo:/projects': pageTransitionEnter,
    'onEnterFrom:/projects': zoomTransitionExit,
  },

  '/projects': {
    'enter': pageTransitionEnter,
    'onExitTo:/': zoomTransitionExit,
    'onEnterFrom:/': pageTransitionEnter,
    'onExitTo:/profile': zoomTransitionExit,
    'onEnterFrom:/profile': pageTransitionEnter,
    'onExitTo:/projects': projectTransitionExit,
    'onEnterFrom:/projects': projectTransitionEnter,
  }

}

function pageEnter (el) {
  TweenMax.set(el, {'display': 'block'})
}

function switchTransitionEnter(el) {
  const body = el.querySelector('.transition-body');
  const staggers = Array.from(el.querySelectorAll('.transition-stagger'));

  TweenMax.set(staggers, {
    y: 5,
    alpha: 0
  })
  TweenMax.set(body, {
    alpha: 0,
    y: 5
  });
  TweenMax.set(el, {'display': 'block'})

  TweenMax.to(body, 0.6, {
    alpha: 1,
    y: 0,
    ease: Expo.easeOut,
    delay: 0.2
  });

  if (staggers.length) {
    staggers.forEach((el, i) => {
      TweenMax.to(el, 0.2, {
        alpha: 1,
        y: 0,
        delay: 0.2 + (i * 0.2)
      });
    })
  }
}

function switchTransitionExit(el) {
  const header = el.querySelector('.transition-header');
  const body = el.querySelector('.transition-body');
  TweenMax.set(header, {
    alpha: 0
  });
  TweenMax.set(el, {'display': 'block'})
  TweenMax.to(body, 0.2, {
    alpha: 0,
    y: 10,
    ease: Expo.easeIn
  });
}

function pageTransitionEnter (el) {
  const header = el.querySelector('.transition-header');
  const body = el.querySelector('.transition-body');
  const staggers = Array.from(el.querySelectorAll('.transition-stagger'));

  TweenMax.set(header, {
    alpha: 0
  });
  TweenMax.set(body, {
    alpha: 0,
    y: 10
  });
  TweenMax.set(staggers, {
    y: 5,
    alpha: 0
  })

  TweenMax.set(el, {'display': 'block'});

  TweenMax.to(header, 0.6, {
    alpha: 1,
    delay: 0.3
  });

  TweenMax.to(body, 0.6, {
    alpha: 1,
    y: 0,
    ease: Expo.easeOut,
    delay: 0.4
  });

  if (staggers.length) {
    staggers.forEach((el, i) => {
      TweenMax.to(el, 0.2, {
        alpha: 1,
        y: 0,
        delay: 0.5 + (i * 0.2)
      });
    })
  }

}

function pageTransitionExit (el) {
  const header = el.querySelector('.transition-header');
  const body = el.querySelector('.transition-body');

  TweenMax.to(header, 0.3, {
    alpha: 0,
    y: -10,
    ease: Expo.easeIn
  });
  TweenMax.to(body, 0.3, {
    alpha: 0,
    y: 10,
    ease: Expo.easeIn
  });
}

function zoomTransitionEnter (el) {
  TweenMax.set(el, {
    alpha: 0,
    scale: 0.98,
  });

  TweenMax.set(el, {'display': 'block'});

  TweenMax.to(el, 0.6, {
    alpha: 1,
    scale: 1,
    ease: Expo.easeOut,
    delay: 0.2
  });
}

function zoomTransitionExit (el) {
  TweenMax.to(el, 0.4, {
    alpha: 0,
    scale: 1.02,
    ease: Expo.easeOut
  });
}

function projectTransitionEnter (el, direction) {
  const body = el.querySelector('.transition-body');

  TweenMax.set(body, {
    alpha: 0,
    x: 10 * (direction === 'left' ? -1 : 1),
  });
  TweenMax.set(el, {'display': 'block'});
  TweenMax.to(body, 0.4, {
    alpha: 1,
    x: 1,
    ease: Expo.easeOut,
    delay: 0.3
  });
}

function projectTransitionExit (el, direction) {
  const header = el.querySelector('.transition-header');
  const body = el.querySelector('.transition-body');
  
  TweenMax.set(header, {
    alpha: 0
  });

  TweenMax.to(body, 0.3, {
    alpha: 0,
    x: 10 * (direction === 'left' ? 1 : -1),
    ease: Expo.easeIn
  });
}

export default transitions;
