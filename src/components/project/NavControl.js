import React from 'react';
import { Link } from 'react-router-dom';

const NavControl = (props) => {
  const { last, next } = props;
  return (
    <nav className="nav nav__control pt-2 pb-2 mb-3">
    <Link to="/" className="btn__link btn__link--plain">Back to index</Link>
      <div>
        <Link to={`/projects/${last}`} className="btn__link btn__link--plain">← Previous</Link>
        <Link to={`/projects/${next}`} className="btn__link btn__link--plain ml-2">Next →</Link>
      </div>
    </nav>
  )
}

export default NavControl;