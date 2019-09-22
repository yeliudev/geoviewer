/* Written by Ye Liu */

import React from 'react';
import ReactDOM from 'react-dom';

import Router from '@router/router';
import * as serviceWorker from '@serviceWorker';

const App = () => (
    <Router />
);

// Render pages
ReactDOM.render(<App />, document.getElementById('root'));

// Let the app work offline and load faster
serviceWorker.register();
