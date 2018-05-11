import React from 'react';
import Item from '../Item.jsx';
import Config from '../../config.json';
import { strConcat, uniqueId } from '../../utils.js';

const ShowSimilar = props => {
    const data = props.results;
    const mediaType = props.mediaType;
    if (data.length) {
        const keys = uniqueId(data.length);

        const titles = data.map((title, i) => {
            const name = title.name ? title.name : title.title;
            const id = title.id;
            const imgLink = navigator.onLine ? Config.imgResizeURL + title.poster_path : Config.pulpFictCover;
            const reRemSpacSpec = new RegExp(Config.reRemoveSpacesSpecials, 'g');
            const link = '/showlist/' + name.replace(reRemSpacSpec, '');
            var cName = (i + 1) % 2 === 0 ? 'similar even' : 'similar odd';
            if (i > Config.showSimilarLimit) {
                cName += ' hide';
            }
            const voteAvg = title.vote_average;
            const overview = strConcat(title.overview, Config.strLength250);

            return <Item key={keys[i]} cname={cName} id={id} img={imgLink} link={link} media={mediaType} overview={overview} score={voteAvg} title={name} />;
        });

        return (
            <section className="results showlist">
                <div className="row">
                    <h2>Other similar movies</h2>
                    {titles}
                </div>
            </section>
        );
    }
    return null;
};


export default ShowSimilar;