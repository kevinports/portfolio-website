import React, { Fragment } from 'react';

import Header from './common/Header';
import Wrapper from './common/Wrapper';
import TransitionRoot from './common/TransitionRoot';
import Card from './common/Card';
import Footer from './common/Footer';

import data from '../data';


class WorkPage extends React.Component {
  render() {
    return (
      <TransitionRoot>
        <Wrapper name="transition-header">
          <Header />
        </Wrapper>
        <Wrapper name="transition-body">
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
      </TransitionRoot>
    )
  }
}

export default WorkPage;
