import { TweenLite } from 'gsap';

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
  TweenLite.set(el, {'display': 'block'})
}

function switchTransitionEnter(el) {
  const body = el.querySelector('.transition-body');
  const staggers = Array.from(el.querySelectorAll('.transition-stagger'));

  TweenLite.set(staggers, {
    y: 5,
    alpha: 0
  })
  TweenLite.set(body, {
    alpha: 0,
    y: 5
  });
  TweenLite.set(el, {'display': 'block'})

  TweenLite.to(body, 0.6, {
    alpha: 1,
    y: 0,
    ease: Expo.easeOut,
    delay: 0.2
  });

  if (staggers.length) {
    staggers.forEach((el, i) => {
      TweenLite.to(el, 0.2, {
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
  TweenLite.set(header, {
    alpha: 0
  });
  TweenLite.set(el, {'display': 'block'})
  TweenLite.to(body, 0.2, {
    alpha: 0,
    y: 10,
    ease: Expo.easeIn
  });
}

function pageTransitionEnter (el) {
  const header = el.querySelector('.transition-header');
  const body = el.querySelector('.transition-body');
  const staggers = Array.from(el.querySelectorAll('.transition-stagger'));
  const horiz = el.querySelector('.transition-horiz');

  TweenLite.set(header, {
    alpha: 0
  });

  if (horiz) {
    TweenLite.set(horiz, {
      alpha: 0,
      y: 10
    });
  }

  TweenLite.set(staggers, {
    y: 10,
    alpha: 0
  })

  TweenLite.set(el, {'display': 'block'});

  TweenLite.to(header, 0.6, {
    alpha: 1,
    delay: 0.5
  });

  if (horiz) {
    TweenLite.to(horiz, 0.8, {
      alpha: 1,
      y: 0,
      ease: Expo.easeOut,
      delay: 0.6
    });
  }

  if (staggers.length) {
    staggers.forEach((el, i) => {
      TweenLite.to(el, 0.5, {
        alpha: 1,
        y: 0,
        delay: 0.6 + (i * 0.1)
      });
    })
  }
}

function pageTransitionExit (el) {
  const header = el.querySelector('.transition-header');
  const body = el.querySelector('.transition-body');

  TweenLite.to(header, 0.4, {
    alpha: 0,
    delay: 0.1,
    y: -10,
    ease: Expo.easeIn
  });
  TweenLite.to(body, 0.4, {
    alpha: 0,
    delay: 0.1,
    y: 10,
    ease: Expo.easeIn
  });
}

function zoomTransitionEnter (el) {
  TweenLite.set(el, {
    alpha: 0,
    scale: 0.98,
  });

  TweenLite.set(el, {'display': 'block'});

  TweenLite.to(el, 0.7, {
    alpha: 1,
    scale: 1,
    ease: Expo.easeOut,
    delay: 0.4
  });
}

function zoomTransitionExit (el) {
  TweenLite.to(el, 0.4, {
    alpha: 0,
    // scale: 1.02,
    // ease: Expo.easeOut
  });
}

function projectTransitionEnter (el, direction) {
  const body = el.querySelector('.transition-body');
  const horiz = el.querySelector('.transition-horiz');
  const fade = el.querySelector('.transition-fade');
  const staggers = Array.from(el.querySelectorAll('.transition-stagger'));

  TweenLite.set(staggers, {
    y: 5,
    alpha: 0
  })
  TweenLite.set(horiz, {
    alpha: 0,
    x: 10 * (direction === 'left' ? -1 : 1)
  });
  TweenLite.set(el, {'display': 'block'});
  TweenLite.to(horiz, 0.4, {
    alpha: 1,
    x: 0,
    ease: Expo.easeOut,
    delay: 0.4
  });
  TweenLite.to(fade, 0.3,{
    alpha: 1,
    delay: 0.5
  });
  if (staggers.length) {
    staggers.forEach((el, i) => {
      TweenLite.to(el, 0.4, {
        alpha: 1,
        y: 0,
        delay: 0.5 + (i * 0.2)
      });
    })
  }
}

function projectTransitionExit (el, direction) {
  const header = el.querySelector('.transition-header');
  const body = el.querySelector('.transition-body');
  const horiz = el.querySelector('.transition-horiz');
  const fades = Array.from(el.querySelectorAll('.transition-fade'));

  TweenLite.set(header, {
    alpha: 0
  });

  TweenLite.to(horiz, 0.3, {
    alpha: 0,
    x: 10 * (direction === 'left' ? 1 : -1),
    ease: Expo.easeIn
  });
  TweenLite.to(fades, 0.3, {
    alpha: 0
  });
}

export default transitions;
