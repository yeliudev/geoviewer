/* Written by Ye Liu */

import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Main from '@pages/main';

const Router = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={Main} />
        </Switch>
    </HashRouter>
);

export default Router;
