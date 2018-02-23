// keeps track of UI state - window scroll, resize, raf
import shortid from 'shortid';
import { device_pixel_ratio } from 'javascript-retina-detect';

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
        width: 0,
        height: 0
      },
      isRetina: device_pixel_ratio() === 2 ? true : false
    }
    this.scrollRoot = null; // need to set this after subscribing components mount
  }

  listen () {
    // add RAF handler
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

    this.raf();
  }

  raf () {
    this.get('rafCallStack').forEach((fn)=> fn() );
    window.requestAnimationFrame(this.raf.bind(this));
  }

  on(eventType, callback, trigger) {
    const id = shortid.generate();
    this._events[id] = {
      type: eventType,
      callback: callback
    };
    if (trigger) {
      // trigger callback as it is set for initial values listener may need
      const val = this.get(eventType.replace("change:", ""));
      callback.call(this, val, val);
    }
    return id;
  }

  off(id) {
    delete this._events[id];
  }

  set(attr, val, silent) {
    //dont update if no change
    if (JSON.stringify(this._dataObj[attr]) === JSON.stringify(val)) return;

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
