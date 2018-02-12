import React from 'react';

const ContentWrapper = (props) => {
  const classes = `${props.type} mb-2 mt-2 transition-stagger`;
  return (
    <div className={ classes }>
      { props.children }
    </div>
  )
}

export default ContentWrapper;
