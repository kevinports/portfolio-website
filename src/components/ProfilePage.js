import React from 'react';
import Header from './common/Header';
import Wrapper from './common/Wrapper';

class ProfilePage extends React.Component {
  render () {
    return(
      <Wrapper>
      <Header />
      <h1>Profile</h1>
      </Wrapper>
    )
  }
}

export default ProfilePage;
