import React from 'react';
import _ from 'lodash';
import renderHTML from 'react-render-html';

import Header from './common/Header';
import Wrapper from './common/Wrapper';
import NavControl from './project/NavControl';
import SectionHeader from './project/SectionHeader';
import Video from './project/Video';
import Img from './project/Img';
import ScreenViewer from './project/ScreenViewer';

import data from '../data';

class ProjectPage extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  componentWillAppear () {
    console.log('project will appear')
  }

  componentWillLeave(cb) {
    console.log('project componentWillLeave')
    cb()
  }

  componentDidMount () {
    document.body.scrollTop = 0;
  }

  componentDidUpdate () {
    document.body.scrollTop = 0;
  }

  render (){
    const slug = this.props.match.params.id;
    const project = _.find(data, {'slug': slug})
    const nextProject = getNextProject(data, project.id).slug;
    const lastProject = getLastProject(data, project.id).slug;

    let projectContent = '';
    if (project.content && project.content.length) {
      projectContent = project.content.map((content, i) =>{
        switch (content.type) {
          case 'section-header':
            return <SectionHeader
                      key={i}
                      headline={content.headline}
                      align={content.align}
                      body={content.body}/>
          case 'video':
            return <Video
                      key={i}
                      srcMp4={content.srcMp4}
                      srcWebM={content.srcWebM}
                      poster={content.poster}
                      caption={content.caption}
                      chromed={content.chromed}/>
          case 'img':
            return <Img key={i}
                      src={content.src}
                      src2x={content.src2x}
                      caption={content.caption}/>
          case 'screenViewer':
            return <ScreenViewer key={i}
                      images={content.images}/>
          default:
            return '';
        }
      })
    }

    return(
      <Wrapper>
        <NavControl
          next={nextProject}
          last={lastProject}/>

        <section role="content" className="mb-5">

          <div className="row mb-3">
            <div className="col-12 col-6-md">
              <div className="pr-3">
                <h1 className="f-4 f-medium measure-md" >{project.title}</h1>
              </div>
            </div>
            <div className="col-12 col-6-md mt-1 mt-0-md">
              {project.overview.map((text, i) =>
                <p className="f-3 measure-lg" key={i}>{renderHTML(text)}</p>
              )}

              <div className="flex mt-3">
                <ul className="list mr-3">
                  <h5 className="f-1 f-medium">My role</h5>
                  {project.roles.map((text, i) =>
                    <li key={i}>{text}</li>
                  )}
                </ul>
                <ul className="list list--unstyled">
                  <h5 className="f-1 f-medium">When</h5>
                  <li>{ project.when }</li>
                </ul>
              </div>

            </div>
          </div>

          <div>
            {projectContent}
          </div>

        </section>
        <NavControl
          next={nextProject}
          last={lastProject}/>
      </Wrapper>
    );
  }
}

export default ProjectPage;

function getLastProject(projects, id) {
  let targetId;
  if (id == 0){
    targetId = projects.length - 1;
  } else {
    targetId = id - 1;
  }
  return _.find(projects, {id: targetId});
}

function getNextProject(projects, id) {
  let targetId;
  if (id == projects.length - 1){
    targetId = 0;
  } else {
    targetId = id + 1;
  }
  return _.find(projects, {id: targetId});
}
