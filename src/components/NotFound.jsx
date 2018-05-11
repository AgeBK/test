import React from 'react';
import { hideContentPH } from '../utils';
import Config from '../config.json';

const NotFound = () => {
    return (
        <MainOuter>
            <div className="notFound">
                <h1>Page not found</h1>
                <img src={Config.notFoundSad} alt="404" title="404" />
                <h2>404</h2>
                <div></div>
                <a href="/">Config.error404Txt</a>
            </div>
        </MainOuter>
    );
};