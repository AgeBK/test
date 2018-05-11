import React from 'react';
import Config from '../config.json';

const MainOuter = props => {

    return (
        <div className="results home">
            <div className="row">
                <a className="homeLink" href="/">
                    <div className="col-12 intro bgMain">
                        <h1>{Config.siteTitle}</h1>
                        <p>{Config.siteIntro}</p>
                    </div>
                </a>
                <hr />
                {props.children}
            </div>
        </div>
    );
};

export default MainOuter;