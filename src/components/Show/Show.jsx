import React, { Component } from 'react';
import ShowCredits from './ShowCredits';
import ShowSimilar from './ShowSimilar';
import Rating from '../Rating';
import Config from '../../config.json';
import { getNamesStr, fetchMultiple, dateDMY, pageTitle, showHideCredits, showHideSimilar } from '../../utils.js';

class Show extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };
        this.mediaType = props.location.state.mediaType;
    }

    componentWillMount() {
        var show = location.pathname;
        document.title = pageTitle(show); //TODO: still need title solution
    }

    componentDidMount() {
        if (this.props.location.state.id && this.props.location.state.mediaType) {
            this.getShowData(this.props.location.state.id, this.props.location.state.mediaType);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.state.id !== this.props.location.state.id && nextProps.location.state.id !== '') {
            this.getShowData(nextProps.location.state.id, nextProps.location.state.mediaType);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.data[0]) {
            if (this.state.data[0].id === nextState.data[0].id) {
                return false;
            }
        }
        return true;
    }

    getShowData(id, mType) {
        var urls = [];
        const mediaBase = mType === 'tv' ? Config.tvBaseURL : Config.movieBaseURL;

        if (navigator.onLine) {
            urls = urls.concat(mediaBase + id + Config.apiKeyQry, mediaBase + id + '/similar' + Config.apiKeyQry, mediaBase + id + '/credits' + Config.apiKeyQry);
        }
        else {
            var loc = location.origin + '/src/js/';
            if (mType === 'tv') {
                urls = urls.concat(loc + 'walkingDead.json', loc + 'walkingDeadSimilar.json', loc + 'walkingDeadCast.json'); // TODO: test this with 1 or more failing
            }
            else {
                urls = urls.concat(loc + 'pulpFiction.json', loc + 'pulpFictionSimilar.json', loc + 'pulpFictionCast.json');
            }
        }

        fetchMultiple.call(this, urls); // utils, setState here
    }

    render() {
        const reCurrency = new RegExp(Config.reCurrency, 'g');
        if (this.state.data.length) {
            // 3 arrays here
            // 1: show info
            // 2: similar movies
            // 3: cast/crew

            // tv and movie fields
            const { backdrop_path: backdropPath, genres, homepage, original_language: orgLang, overview, poster_path: posterPath, production_companies: prodComp, status, vote_average: voteAvg, vote_count: voteCnt } = this.state.data[0];
            const genreNames = getNamesStr(genres);
            const prodCompNames = getNamesStr(prodComp);
            const img = navigator.onLine ? Config.imgResizeURL + posterPath : Config.pulpFictCover;
            var dtYear = '';

            if (this.mediaType === 'tv') {
                var { created_by: cBy, first_air_date: fAirDate, last_air_date: lAirDate, name, networks, number_of_episodes: episodes, number_of_seasons: nOSeasons, origin_country: orgCtry } = this.state.data[0];
                var bDrop = Config.imgURL + backdropPath;
                var createdBy = getNamesStr(cBy);
                var netWorks = getNamesStr(networks);
                var firstAirDate = dateDMY(fAirDate);
                var lastAirDate = dateDMY(lAirDate);
                dtYear = firstAirDate.split('/')[2];
            }
            else {
                // movie
                var { budget, title, release_date: relDate, revenue, runtime, spoken_languages: sLangs, tagline } = this.state.data[0];
                var releaseDate = dateDMY(relDate); // utils function
                var budgetCommas = budget.toString().replace(reCurrency, '$1,');
                var revenueCommas = revenue.toString().replace(reCurrency, '$1,');
                var spokenLangs = getNamesStr(sLangs);
                dtYear = releaseDate.split('/')[2];
            }

            const showTitle = name ? name : title;

            var bDropBG;
            if (navigator.onLine) {
                bDropBG = {
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url(' + Config.imgURL + backdropPath + ')'
                };
            }
            else {
                bDropBG = {
                    backgroundImage: Config.movieBackDrop
                };
            }

            return (
                <div className="showCont">
                    <section className="show" style={bDropBG}>
                        <ShowDetails bDrop={bDrop} showTitle={showTitle} img={img} dtYear={dtYear} voteAvg={voteAvg} genreNames={genreNames} overview={overview} />
                    </section>
                    {this.mediaType === 'tv' ?
                        <section className="other">
                            <div><span className="label">Created By:</span> {createdBy}</div>
                            <h2 >{showTitle} facts: </h2>
                            <TVOther homepage={homepage} prodComp={prodCompNames} FAD={firstAirDate} LAD={lastAirDate} networks={netWorks} status={status}
                                seasons={nOSeasons} episodes={episodes} voteCnt={voteCnt} orgLang={orgLang} orgCtry={orgCtry} showTitle={showTitle} />
                        </section>
                        :
                        <section className="other">
                            <div><span className="label">Tag Line:</span> {tagline}</div>
                            <h2 >{showTitle} facts: </h2>
                            <MovieOther homepage={homepage} budget={budgetCommas} revenue={revenueCommas} prodCompNames={prodCompNames} releaseDate={releaseDate}
                                runtime={runtime} status={status} voteCnt={voteCnt} orgLang={orgLang} languages={spokenLangs} showTitle={showTitle} />
                        </section>
                    }
                    {this.state.data[2] && this.state.data[2].cast ?
                        <section className="credits">
                            <h2>Starring:</h2>
                            <ShowCredits {...this.state.data[2]} />
                            <div className="col-12">
                                <div className="moreCredits btn stdBtn" onClick={showHideCredits}>Show more credits</div>
                            </div>
                        </section>
                        : null}
                    {this.state.data[1] && this.state.data[1].results ?
                        <section className="similar showHide row">
                            <ShowSimilar {...this.state.data[1]} mediaType={this.props.location.state.mediaType} />
                            <div className="moreSimilar btn stdBtn" onClick={showHideSimilar}>Show more similar</div>
                        </section>
                        : null}
                </div>
            );
        }
        return null;
    }
}

const ShowDetails = props => {
    const { dtYear, genreNames, img, overview, showTitle, voteAvg } = props;

    return (
        <div className="showContInner">
            <div className="img">
                <img src={img} alt={showTitle} title={showTitle} />
            </div>
            <div className="info">
                <div className="hero">
                    <img src={img} alt={showTitle} title={showTitle} />
                </div>
                <div className="showInfo">
                    <h1 className="title">{showTitle} <span>({dtYear})</span></h1>
                    <Rating score={voteAvg} />
                    <p><span className="label">Genre:</span> {genreNames}</p>
                    <p><span className="label">Overview: </span>{overview}</p>
                </div>
            </div>
        </div>
    );
};

const TVOther = props => {
    const { FAD, LAD, episodes, homepage, networks, orgCtry, orgLang, prodComp, seasons, showTitle, status, voteCnt } = props;

    return (
        <div className="otherInner">
            {homepage ?
                <div><span className="label">Homepage:</span><a href={homepage} target="_blank">{showTitle}</a></div> :
                null}
            <div><span className="label">Production companies:</span>{prodComp}</div>
            <div><span className="label">First air date:</span>{FAD}</div>
            <div><span className="label">Last air date:</span>{LAD}</div>
            <div><span className="label">Networks:</span>{networks}</div>
            <div><span className="label">Status:</span>{status}</div>
            <div><span className="label">Seasons:</span>{seasons}</div>
            <div><span className="label">Episodes:</span>{episodes}</div>
            <div><span className="label">Vote count:</span>{voteCnt}</div>
            <div><span className="label">Original language:</span>{orgLang}</div>
            <div><span className="label">Origin country:</span>{orgCtry}</div>
        </div>
    );
};

const MovieOther = props => {
    const { budget, homepage, languages, orgLang, prodCompNames, releaseDate, revenue, runtime, showTitle, status, voteCnt } = props;

    return (
        <div className="otherInner">
            {homepage ?
                <div><span className="label">Homepage</span>:<a href={homepage} target="_blank">{showTitle}</a></div> :
                null}
            <div><span className="label">Budget:</span>${budget}</div>
            <div><span className="label">Revenue:</span>${revenue}</div>
            <div><span className="label">Production Companies:</span>{prodCompNames}</div>
            <div><span className="label">Release Date:</span>{releaseDate}</div>
            <div><span className="label">Run Time:</span>{runtime} mins</div>
            <div><span className="label">Status:</span>{status}</div>
            <div><span className="label">Vote count:</span>{voteCnt}</div>
            <div><span className="label">Original Language:</span>{orgLang}</div>
            <div><span className="label">Languages:</span>{languages}</div>
        </div>
    );
};

export default Show;