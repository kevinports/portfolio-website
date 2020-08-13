import React from 'react';

import Header from './common/Header';
import Wrapper from './common/Wrapper';
import TransitionRoot from './common/TransitionRoot';
import Card from './common/Card';
import Footer from './common/Footer';

class WorkPage extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <TransitionRoot>
        <Wrapper name="transition-header">
          <Header />
        </Wrapper>
        <Wrapper name="transition-body">
          <div className="measure-lg pb-3 pb-4-md mb-1 transition-horiz">
            <h3 className="f-4 pr-3 f-medium">Kevin Ports is a frontend developer and designer based in Madison, WI, USA</h3>
          </div>
          <div className="card-list" aria-label="projects">
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
