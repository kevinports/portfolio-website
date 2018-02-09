import React from 'react';

import Header from './common/Header';
import Wrapper from './common/Wrapper';

import Card from './common/Card';
import Footer from './common/Footer';
import data from '../data';

const WorkPage = () => (
  <Wrapper>
    <Header />
    <div className="measure-lg pb-3 mb-1">
      <h3 className="f-4 pr-3 f-medium">Kevin Ports is a designer, front-end developer and problem solver based in Madison, WI, USA</h3>
    </div>
    <div className="card-list">
      {data.map(project =>
        <Card
          project={project}
          key={project.id}/>
      )}
    </div>
    <Footer />
  </Wrapper>
)

export default WorkPage;
