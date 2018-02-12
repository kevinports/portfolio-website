// keeps track of UI state - window scroll, resize, raf
import _ from 'lodash';
import shortid from 'shortid';
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
    this.scrollRoot = null; // need to set this after subscribing components mount
  }

  listen () {
    // add RAF handler
    TweenMax.ticker.addEventListener("tick", (e) => this.raf());
    this.scrollRoot = document.querySelector('.transition-root');

    this.get('rafCallStack').push( () => {
      // handle scroll
      this.set('scroll', {
          currentY: this.scrollRoot.scrollTop
      });
      // handle resize
      this.set('viewport', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    });

  }

  raf () {
    this.get('rafCallStack').forEach((fn)=> fn() );
  }

  on(eventType, callback) {
    const id = shortid.generate();
    this._events[id] = {
      type: eventType,
      callback: callback
    };
    return id;
  }

  off(id) {
    delete this._events[id];
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
      const evt = this._events[key];
      if (evt.type === ("change:" + attr)) {
        evt.callback.call(this, val, previous);
      }
    }
  }

  get(attr) {
    return this._dataObj[attr];
  }

}

export default new GlobalStore();
