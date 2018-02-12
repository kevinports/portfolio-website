import React from 'react';
import ReactDom from 'react-dom';
import ContentWrapper from './ContentWrapper';
import Caption from './Caption';

class Video extends React.Component {
  constructor (props, context) {
    super(props, context);
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
