import React from 'react';
import { TweenLite } from 'gsap';
import { getOffset } from '../../base/helpers';
import GlobalStore from '../../base/GlobalStore';

class ScreenViewer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isHelpTextShown: true,
      activeTabId: 1,
      scrollable: false
    }

    this.handleScreenScroll = this.handleScreenScroll.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentDidMount () {
    // we need to make sure element is fully in view before we allow it to scroll
    this.scrollListenerId = GlobalStore.on('change:scroll', (scroll) => {
      const isInView = this.isInView(scroll);
      this.setState({'scrollable': isInView});
    });
  }

  componentWillUnmount() {
    GlobalStore.off(this.scrollListenerId);
  }

  isInView (scroll) {
    const offset = getOffset(this.refs.El);
    const viewport = GlobalStore.get('viewport');
    const padding = 20;
    return (offset.top - padding > 0 && offset.bottom + padding < viewport.height) ? true : false;
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.activeTabId != this.state.activeTabId) {
      this.refs.screenEl.scrollTop = 0;
    }
  }

  handleScreenScroll () {
    if (!this.state.isHelpTextShown) return;
    this.setState({ isHelpTextShown: false });

    TweenLite.to(this.refs.helpTextEl, 0.3, {
      alpha: 0
    })
  }

  handleMenuClick (id) {
    TweenLite.to(this.refs.screenEl, 0.3, {
      alpha: 0,
      y: 10,
      onComplete: () => {
        this.setState({'activeTabId': id});
        TweenLite.to(this.refs.screenEl, 0.4, {
          alpha: 1,
          y: 0
        })
      }
    });
  }

  render () {
    const img = this.props.images.find(o => o.id === this.state.activeTabId);
    const { src, src2x } = img;

    const menuItems = this.props.images.map(i => {
      if (this.state.activeTabId === i.id) {
        return <li className='screen-viewer__menu-item screen-viewer__menu-item--active' key={i.id}>{i.name}</li>
      } else {
        return <li className='screen-viewer__menu-item' key={i.id} onClick={ this.handleMenuClick.bind(this, i.id) }>{i.name}</li>
      }
    });

    return (
      <div className={"screen-viewer mb-4 transition-stagger " + (this.state.scrollable ? "screen-viewer--scrollable" : "")} ref="El">

        <div className="screen-viewer__screen pa-3">
          <div className="screenViewer__help-text f-1 f-medium" ref="helpTextEl"><span>Scroll to preview page</span></div>
          <div className="screen-viewer__screen-inner" onScroll={this.handleScreenScroll} ref="screenEl">
            <img src={ src } srcSet={`${src} 1x, ${src2x} 2x`}/>
          </div>
        </div>

        { this.props.images.length > 1 &&
          <ul className="screen-viewer__menu f-1 f-medium pt-2">
              { menuItems }
          </ul>
        }
      </div>
    )
  }
}

export default ScreenViewer;
