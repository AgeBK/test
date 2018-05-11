import React from 'react';
import ReactDOM, { render } from 'react-dom'; // TODO: check this

import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import './sass/app.scss';
import App from './components/App.jsx';

ReactDOM.render(<App />, document.getElementById('root'));  