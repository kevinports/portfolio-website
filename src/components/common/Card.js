import React from "react";
import assetProvider from '../../base/assetProvider';
import GlobalStore from '../../base/GlobalStore';
import { Link } from 'react-router-dom';

class Card extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  render () {
    const { project } = this.props;
    const isRetina = GlobalStore.get('isRetina');
    const bgImagePath = isRetina ? assetProvider(project.cardBackgroundSrc2x) : assetProvider(project.cardBackgroundSrc);
    let footer = null;

    if (project.cardForegroundImg){
      const foregroundSrc = assetProvider(`img/${project.slug}-card-fore.png`);
      const foregroundSrc2x = assetProvider(`img/${project.slug}-card-fore@2x.png`);
      const foregroundSrcSet = `${foregroundSrc} 1x, ${foregroundSrc2x} 2x`;
      footer = <div className="card__footer "><img className="card__fore-img" src={foregroundSrc} srcSet={foregroundSrcSet} /></div>
    }

    return (
      <Link
        to={`/projects/${project.slug}`}
        className={`card card--${project.slug} transition-stagger`}
        style={{
          "backgroundColor": project.color,
          "borderColor": project.color
        }}
        ref={(el) => { this.el = el; }}>

          <div className="card__header pt-2 pl-2">
            <div  className="measure-sm">
              <h3 className="f-2 f-3-sm f-medium">{project.title}</h3>
              <h4 className="f-1 f-1-md dib pt-1">See case study</h4>
            </div>
          </div>
          { footer }
          <div
            className="card__background-img"
            style={{"backgroundImage": `url('${bgImagePath}')`}}
            role="img"
            aria-label={`${project.title} illustration`}
            ></div>
      </Link>
    )
  }
}

export default Card;
