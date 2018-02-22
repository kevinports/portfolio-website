import React from 'react';
import assetProvider from '../../base/assetProvider';
import ContentWrapper from './ContentWrapper';
import Caption from './Caption';

const Img = (props) => {
  const { caption, bordered } = props;
  const captionEl = (caption) ? <Caption value={caption}/> : null;
  let { src, src2x } = props;
  src = assetProvider(src);
  src2x = assetProvider(src2x);

  return (
    <ContentWrapper type="img">
      <img src={ src } srcSet={`${src} 1x, ${src2x} 2x`} className={ bordered ? "img--bordered" : ""} />
      { captionEl }
    </ContentWrapper>
  )
}

export default Img;
