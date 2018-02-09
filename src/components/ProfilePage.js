import React from 'react';
import Header from './common/Header';
import Wrapper from './common/Wrapper';

const ProfilePage =() => (
  <Wrapper>
    <Header />
    <div className="row">
      <div className="col-8">
        <div className="box"></div>
      </div>
      <div className="col">
        <div className="box"></div>
      </div>
    </div>
    <div className="row">
      <div className="col-6 col-12-md">
        <div className="box"></div>
      </div>
      <div className="col-6 col-8-md">
        <div className="box"></div>
      </div>
    </div>
  </Wrapper>
);

export default ProfilePage;
