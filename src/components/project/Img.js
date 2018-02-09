import React from 'react';
import ContentWrapper from './ContentWrapper';
import Caption from './Caption';

const Img = (props) => {
  const { src, src2x, caption } = props;
  const captionEl = (caption) ? <Caption value={caption}/> : null;

  return (
    <ContentWrapper type="img">
      <img src={ src } srcSet={`${src} 1x, ${src2x} 2x`}/>
      { captionEl }
    </ContentWrapper>
  )
}

export default Img;
