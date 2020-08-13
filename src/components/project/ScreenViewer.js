import React from 'react';
import { TweenLite } from 'gsap';
import assetProvider from '../../base/assetProvider';
import { getOffset } from '../../base/helpers';
import GlobalStore from '../../base/GlobalStore';

class ScreenViewer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isHelpTextShown: true,
      activeTabId: 1,
      scrollable: false,
      isMobileView: false
    }

    this.handleViewportResize = this.handleViewportResize.bind(this);
    this.handleViewportScroll = this.handleViewportScroll.bind(this);
    this.handleInnerScreenScroll = this.handleInnerScreenScroll.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount () {
    this.resizeListenerId = GlobalStore.on('change:viewport', this.handleViewportResize, true);
    this.scrollListenerId = GlobalStore.on('change:scroll', this.handleViewportScroll);
  }

  componentWillUnmount() {
    GlobalStore.off(this.resizeListenerId);
    GlobalStore.off(this.scrollListenerId);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.activeTabId != this.state.activeTabId) {
      this.refs.screenEl.scrollTop = 0;
    }
  }

  handleViewportResize (viewport) {
    if (viewport.width < 768) {
      this.setState({ isMobileView: true });
    } else {
      this.setState({ isMobileView: false });
    }
  }

  handleViewportScroll (scroll) {
    // we need to make sure element is fully in view before we allow it to scroll
    const isInView = this.isInView(scroll);
    this.setState({'scrollable': isInView});
  }

  handleInnerScreenScroll () {
    if (!this.state.isHelpTextShown) return;
    this.setState({ isHelpTextShown: false });

    TweenLite.to(this.refs.helpTextEl, 0.3, {
      alpha: 0
    })
  }

  handleMenuClick (id) {
    this.screenInnerSwitchTransition(id);
  }

  handleSelectChange (e) {
    const id = parseInt(e.target.value);
    this.screenInnerSwitchTransition(id)
  }

  screenInnerSwitchTransition (id) {
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

  isInView (scroll) {
    const offset = getOffset(this.refs.El);
    const viewport = GlobalStore.get('viewport');
    const padding = 20;
    return (offset.top - padding > 0 && offset.bottom + padding < viewport.height) ? true : false;
  }

  render () {
    const img = this.props.images.find(o => o.id === this.state.activeTabId);
    let { name, id, src, src2x } = img;
    src = assetProvider(src);
    src2x = assetProvider(src2x);

    const menuItems = this.props.images.map(i => {
      if (this.state.activeTabId === i.id) {
        return (
          <li
            role="tab"
            aria-selected="true"
            aria-controls={`panel-${i.id}`}
            id={i.id}
            className='screen-viewer__menu-item screen-viewer__menu-item--active'
            key={i.id}>
            {i.name}
          </li>
        )
      } else {
        return (
          <li
            role="tab"
            aria-controls={`panel-${i.id}`}
            id={i.id}
            className='screen-viewer__menu-item'
            key={i.id}
            onClick={ this.handleMenuClick.bind(this, i.id) }>
            {i.name}
          </li>
        )
      }
    });

    const selectItems = this.props.images.map(i => {
      return (
        <option
          role="tab"
          value={i.id}
          key={i.id}
          aria-controls={`panel-${i.id}`}
          id={i.id}>
          {i.name}
        </option>
      )
    });

    let screenPicker;
    if (this.state.isMobileView) {
      screenPicker = (
        <select
          className="screen-viewer__select f-2 mt-2"
          role="tablist"
          aria-label="Screen select"
          value={this.state.activeTabId}
          onChange={this.handleSelectChange}>
          { selectItems }
        </select>
      )
    } else {
      screenPicker = (
        <ul
          className="screen-viewer__menu f-1 f-medium pt-2"
          role="tablist"
          aria-label="Screen tabs">
          { menuItems }
        </ul>
      )
    }

    return (
      <div className={"screen-viewer mb-4 transition-stagger " + (this.state.scrollable ? "screen-viewer--scrollable" : "")} ref="El">

        <div
          className="screen-viewer__screen pa-2 pa-3-md"
          id={`panel-${name}`}
          role="tabpanel"
          aria-labelledby={`tab-${id}`}>
          <div className="screenViewer__help-text f-1 f-medium" ref="helpTextEl"><span>Scroll to preview page</span></div>
          <div className="screen-viewer__screen-inner" onScroll={this.handleInnerScreenScroll} ref="screenEl">
            <img src={ src } srcSet={`${src} 1x, ${src2x} 2x`} alt={name}/>
          </div>
        </div>

        { this.props.images.length > 1 &&
          screenPicker
        }
      </div>
    )
  }
}

export default ScreenViewer;
