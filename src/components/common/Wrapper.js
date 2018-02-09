import React from 'react';

const Wrapper = (props) => {
  const { name, children } = props;
  const transitionName = name || "";
  return (
    <div className={`wrapper ${transitionName}`}>
      {children}
    </div>
  )
}

export default Wrapper;
