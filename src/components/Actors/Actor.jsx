import React, { Component } from 'react';
import Rating from '../Rating';
import Item from '../Item.jsx';
import Config from '../../config.json';
import { dateDMY, fetchMultiple, uniqueId, strConcat, showHideSimilar } from '../../utils.js';

class Actor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        if (this.props.location.state.id) {
            var urls = [];
            const id = this.props.location.state.id;
            // const name = this.props.location.state.name;
            const mediaBase = Config.personBaseURL;

            if (navigator.onLine) {
                urls = urls.concat(mediaBase + id + Config.apiKeyQry, mediaBase + id + '/combined_credits' + Config.apiKeyQry, mediaBase + id + '/images' + Config.apiKeyQry);
            }
            else {
                const loc = location.origin + '/src/js/';
                urls = urls.concat(loc + 'person.json', loc + 'personCredits.json', loc + 'personImgs.json');
            }
            fetchMultiple.call(this, urls); // utils, setState here
        }
    }

    render() {
        if (this.state.data.length) {
            // 3 arrays here
            // 1: actor info
            // 2: actor credits
            // 3: actor images

            //Actor Info
            const { birthday, deathday, name, also_known_as: AKA, biography, place_of_birth: POB, profile_path: profile, homepage } = this.state.data[0];
            const bDay = dateDMY(birthday); // utils
            const bYear = bDay.split('/')[2];
            if (deathday) {
                var dDay = dateDMY(deathday);
                var dYr = dDay.split('/')[2];
            }

            var reNonEng = new RegExp(Config.reRemoveNonEng, 'g');
            const aka = AKA.filter(val => !(reNonEng.test(val)));
            const image = navigator.onLine ? Config.imgURL + profile : Config.dj;

            return (
                <div className="results actorCont">
                    <ActorInfo aka={aka} bDay={bDay} bio={biography} bYear={bYear} dDay={dDay} dYr={dYr} homepage={homepage} img={image} name={name} pob={POB} />
                    <ActorCredits {...this.state.data[1].cast} />
                    <ActorImages name={name} {...this.state.data[2]} />
                </div>
            );
        }
        return null;
    }
}

const ActorInfo = (props) => {
    const { aka, bDay, bio, bYear, dDay, dYr, homepage, img, name, pob } = props;

    return (
        <section className="actor center">
            <h1>{name} <div>({bYear} {dYr ? ' - ' + dYr : null})</div> </h1>
            <hr />
            <div className="image">
                <img src={img} alt={name} title={name} />
            </div>
            <div className="other">
                <div className="bio"><div className="label">Biography:</div><span >{bio}</span></div>
                <h2>Facts</h2>
                <div><span className="label">Born: </span>{bDay} - {pob}</div>
                {dDay ?
                    <div><span className="label">Died: </span>{dDay}</div> :
                    null}
                {aka.length ?
                    <div><span className="label">AKA: </span>{aka.join(', ')}</div> :
                    null}
                {homepage ?
                    <div><span className="label">Homepage: </span><a href={homepage}>{homepage}</a></div> :
                    null}
            </div>
        </section>
    );
};

const ActorCredits = props => {
    var arr = [];
    for (var key in props) {
        if (props.hasOwnProperty(key)) {
            if (props[key].release_date && props[key].vote_average > 0) { // select movies with release date and have been voted for
                arr.push(props[key]);
            }
        }
    }
    arr.sort(function (a, b) { // sort newest to oldest
        const item1 = new Date(a.release_date);
        const item2 = new Date(b.release_date);
        if (item1 < item2) {
            return 1;
        }
        return -1;
    });

    const arrTop20 = arr.slice(0, 20); // just store 20 latest results (there could be hundreds)
    const keys = uniqueId(arr.length);

    const credits = arrTop20.map((title, i) => {
        const name = title.name ? title.name : title.original_title;
        const id = title.id;
        const imgLink = navigator.onLine ? Config.imgResizeURL + title.poster_path : Config.pulpFictCover;
        const reRemSpacSpec = new RegExp(Config.reRemoveSpacesSpecials, 'g');
        const link = '/showlist/' + name.replace(reRemSpacSpec, '');
        var cName = (i + 1) % 2 === 0 ? 'similar even' : 'similar odd';
        if (i > 5) {
            cName += ' hide';
        }
        const voteAvg = title.vote_average;
        const overview = strConcat(title.overview, 250);
        const mediaType = title.media_type;
        var character = title.character;
        return <Item key={keys[i]} cname={cName} id={id} img={imgLink} character={character} link={link} media={mediaType} overview={overview} score={voteAvg} title={name} />;
    });
    return (
        <section className="credits row showHide">
            <h2>Starred in</h2>
            {credits}
            <div className="moreSimilar btn stdBtn" onClick={showHideSimilar}>Show more similar</div>
        </section>
    );
};

const ActorImages = props => {
    var arr = props.profiles;
    const keys = uniqueId(arr.length);
    const name = props.name;

    var ActorImgs = arr.map((val, i) => {
        const { file_path: imgPath, vote_average: voteAvg } = val;
        const img = navigator.onLine ? Config.imgResizeURL + imgPath : Config.dj185;

        return (
            <div key={keys[i]} className="actImg col-xs-12 col-sm-6 col-md-4 col-lg-3">
                <img src={img} alt={name} title={name} />
                <Rating score={voteAvg} />
            </div>
        );
    });

    return (
        <section className="actorImgs row center">
            <h2>{name} images</h2>
            {ActorImgs}
        </section>
    );
};

export default Actor;