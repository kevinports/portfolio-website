import React from 'react';
import Logo from './Logo';

const Footer = () => (
  <div className="mt-4 mb-2 t-center">
    <div className="mb-4">
      <div className="">Drop me a line</div>
      <a className="btn__link" href="mailto:email@kevin.computer">email@kevin.computer</a>
    </div>
    <Logo />
  </div>
)

export default Footer;
