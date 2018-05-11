import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Item = props => {
    // used for showSimilar, ShowList & ActorCredits

    const { id, cname, character, img, link, media, overview, title, score } = props;
    return (
        <div className={"col-md-6 item " + cname}>
            <div className="overlay">
                <div className="leftItem">
                    <Link to={{ pathname: link, state: { id: id, mediaType: media } }} className="image">
                        <img src={img} alt={title} title={title} />
                    </Link>
                    <Rating score={score} />
                </div>
                <Link to={{ pathname: link, state: { id: id, mediaType: media } }}><h3>{title}</h3></Link>
                {character ?
                    <div className="character"><span className="label">As: </span>{character}</div> :
                    null}
                <div className="plot clearFix">{overview}
                    <Link to={{ pathname: link, state: { id: id, mediaType: media } }} className="btn stdBtn">Find out more..</Link>
                </div>
            </div>
        </div>
    );
};

export default Item;