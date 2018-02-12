import React from 'react';
import ReactDom from 'react-dom';
import plyr from 'plyr';
import '../../../node_modules/plyr/dist/plyr.css';
import ContentWrapper from './ContentWrapper';
import Caption from './Caption';

class Video extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  componentDidMount () {
    // this.player = plyr.setup(this.video)[0];
  }

  //not sure why react doesn't dispose of previous video when props change, but need to do it manually
  componentWillReceiveProps (nextProps) {
    const { srcMp4, srcWebM, poster } = nextProps;

    // this.player.pause();
    // this.player.source({
    //   type: 'video',
    //   sources: [{
    //     src: srcMp4,
    //     type: 'video/mp4'
    //   },
    //   {
    //     src: srcWebM,
    //     type: 'video/webm'
    //   }],
    //   poster: poster
    // })
  }

  render () {
    const { srcMp4, srcWebM, poster, caption, chromed } = this.props;
    const captionEl = (caption) ? <Caption value={ caption }/> : null;

    return (
      <ContentWrapper type="video">
        { chromed &&
          <div className="video__chrome"><span></span><span></span><span></span></div>
        }
        <video className="video" poster={ poster }  ref={(video) => { this.video = video; }} controls>
          <source src={ srcMp4 } type="video/mp4" ref={(source) => { this.sourceMp4 = source; }} />
          <source src={ srcWebM } type="video/webm" ref={(source) => { this.sourceWebM = source; }} />
        </video>
        { captionEl }
      </ContentWrapper>

    )
  }
}

export default Video;
