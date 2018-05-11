import React from 'react';
import { withRouter } from "react-router-dom";
import MainOuter from './MainOuter.jsx';
import Config from '../config.json';
import { hideContentPH } from '../utils';

const Info = props => {
    const { data } = props.location.state;
    var info = Config[data];

    return (
        <MainOuter>
            <div className="information">
                <div dangerouslySetInnerHTML={{ __html: (info) }}></div>
            </div>
        </MainOuter>
    );
};

export default withRouter(Info);