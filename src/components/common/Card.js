import React from "react";
import { Link } from 'react-router-dom';

class Card extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  render () {
    const { project } = this.props;
    let footer = null;

    if (project.cardForegroundImg){
      const src = `/assets/img/${project.slug}-card-fore@2x.png`;
      const srcSet = `/assets/img/${project.slug}-card-fore@2x.png 1x, /assets/img/${project.slug}-card-fore@2x.png 2x`;
      footer = <div className="card__footer "><img className="card__fore-img" src={src} srcSet={srcSet} /></div>
    }

    return (
      <Link
        to={`/projects/${project.slug}`}
        className={`card card--${project.slug} transition-stagger`}
        style={{"backgroundColor": project.color, "borderColor": project.color}}
        ref={(el) => { this.el = el; }}>

          <div className="card__header pt-2 pl-2">
            <div  className="measure-sm">
              <h3 className="f-2 f-3-sm f-medium">{project.title}</h3>
              <h4 className="f-1 f-1-md dib pt-1">See case study</h4>
            </div>
          </div>
          { footer }

      </Link>
    )
  }
}

export default Card;
