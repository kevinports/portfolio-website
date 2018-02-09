import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="header pt-2 pb-3">
      <Logo />
      <nav className="nav ml-3">
        <NavLink to="/" exact className="nav__link" activeClassName="nav__link--active">Work</NavLink>
        <NavLink to="/profile" className="nav__link" activeClassName="nav__link--active">Profile</NavLink>
      </nav>
    </header>
  );
};

export default Header;
