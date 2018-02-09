import React from 'react';
import renderHTML from 'react-render-html';

const Caption = (props) => (
  <p className="caption mt-1 f-1">↑ {renderHTML(props.value)}</p>
)

export default Caption;
