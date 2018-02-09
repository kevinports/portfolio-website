import React, { Fragment } from 'react';
import Header from './common/Header';
import Wrapper from './common/Wrapper';
import TransitionRoot from './common/TransitionRoot';

class ProfilePage extends React.Component {
  render () {
    return(
      <TransitionRoot>
        <Wrapper name="transition-header">
          <Header />
        </Wrapper>
        <Wrapper name="transition-body">
          <h1 className="transition-stagger">Profile</h1>
          <h1 className="transition-stagger">Something</h1>
          <h1 className="transition-stagger">Else</h1>
          <h1 className="transition-stagger">To</h1>
          <h1 className="transition-stagger">Say</h1>
        </Wrapper>
      </TransitionRoot>
    )
  }
}

export default ProfilePage;
