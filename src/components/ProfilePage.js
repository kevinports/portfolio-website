import React from 'react';
import assetProvider from '../base/assetProvider';
import Header from './common/Header';
import Wrapper from './common/Wrapper';
import TransitionRoot from './common/TransitionRoot';

class ProfilePage extends React.Component {
  render () {
    const profileImg = assetProvider('img/profile-portrait.jpg');
    const profileImg2x = assetProvider('img/profile-portrait@2x.jpg');

    return (
      <TransitionRoot>
        <Wrapper name="transition-header">
          <Header />
        </Wrapper>
        <Wrapper name="transition-body">
          <div className="flex-md flex--space-between-md">
            <div className="measure-lg f-2 f-3-sm mr-3 transition-stagger">
              <p>I’m a designer and front-end developer interested in tools, technology and workmanship.</p>
              <p>Currently seeking my next adventure and accepting freelance projects.</p>
              <p>Previously I’ve led product design at an IoT startup, was a technical design lead for Facebook, and worked as a designer and developer with a variety of digital design studios in Chicago.</p>
              <p>Spending my time in the great outdoors near Madison, WI and loving it.</p>
            </div>
            <div className="measure-md mt-3 mt-0-md transition-stagger">
              <img src={ profileImg } srcSet={`${profileImg} 1x, ${profileImg2x} 2x`} className="mb-3" />
              <ul className="list list--unstyled">
                <h3 className="f-1 f-medium">Contact</h3>
                <li><a className="btn__link" href="mailto:email@kevin.computer">Email</a></li>
                <li><a className="btn__link" href="https://github.com/kevinports">Github</a></li>
                <li><a className="btn__link" href="https://dribbble.com/kevin-ports">Dribbble</a></li>
              </ul>
            </div>
          </div>
          <div className="transition-stagger">
            <p className="f-1 mt-3 t-light mb-2 mb-4-sm">This site was built with {'<3'} using React.js <a href="https://github.com/kevinports/portfolio-website" className="btn__link">View source</a></p>
          </div>
        </Wrapper>
      </TransitionRoot>
    )
  }
}

export default ProfilePage;
