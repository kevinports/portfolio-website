import React from 'react';
import renderHTML from 'react-render-html';
import ContentWrapper from './ContentWrapper';

const SectionHeader = (props) => {
  const { headline, body, align } = props;
  const alignment = align || 'left';

  return (
    <div className={`section-header section-header--${alignment} row mt-3 mt-5-sm pt-1 mb-1 mb-3-sm transition-stagger`}>
      <div className="measure-lg">
        <h1 className="f-2 f-3-sm f-medium mb-1 f-tight">{ headline}</h1>
        <div className="f-1 f-3-sm">{ renderHTML(body) }</div>
      </div>
    </div>
  )
}

export default SectionHeader;
