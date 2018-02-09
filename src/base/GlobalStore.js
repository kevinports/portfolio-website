// keeps track of UI state - window scroll, resize, raf
import _ from 'lodash';
import {TweenMax} from 'gsap';

class GlobalStore {
  constructor() {
    this._events = {}
    this._dataObj = {
      created_at: new Date(),
      rafCallStack: [],
      scroll: {
        currentY: 0
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    this.listen();
  }

  listen () {
    // handle raf tick
    TweenMax.ticker.addEventListener("tick", (e) => this.raf());

    // handle resize
    window.addEventListener('resize', () => {
      this.set('viewport', {
        width: window.innerWidth,
        height: window.innerHeight
      })
    });

    // handle scroll
    this.get('rafCallStack').push( () => {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      this.set('scroll', {
          currentY: scrollTop
      });
    });

    // window.addEventListener('scroll', () => {
    //   let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //   console.log(scrollTop)
    //   this.set('scroll', {
    //       currentY: scrollTop
    //   });
    // });

  }

  raf () {
    this.get('rafCallStack').forEach((fn)=> fn() );
  }

  on(eventType, callback) {
    this._events[eventType] = callback;
  }

  off(eventType) {
    delete this._events[eventType]
  }

  set(attr, val, silent) {
    //dont update if no change
    if (_.isEqual(this._dataObj[attr], val)) return;

    //update and store prev
    const previous = this._dataObj[attr];
    this._dataObj[attr] = val;

    // trigger callback for change listeners, ignore if silent
    if (silent) return;
    for (let key in this._events) {
      if (key === ("change:" + attr)) {
        this._events[key].call(this, val, previous);
      }
    }
  }

  get(attr) {
    return this._dataObj[attr];
  }

}

export default new GlobalStore();
