/* Written by Ye Liu */

import React from 'react';

import { SnackbarProvider } from 'notistack';

import Snackbar from '@components/snackbar';
import About from '@components/about';
import Navigator from '@components/navigator';
import Menu from '@components/menu';
// import Feature from '@components/feature';
import StyleController from '@components/styleController';
import LayerController from '@components/layerController';
import DataController from '@components/dataController';
import Canvas from '@components/canvas';
import Popup from '@components/popup';
import '@styles/materialize.min.style.css';

class Main extends React.Component {
    render() {
        return (
            <SnackbarProvider maxSnack={3}>
                <React.Fragment>
                    <Snackbar />
                    <About />
                    <Navigator />
                    <Menu />
                    <StyleController />
                    <LayerController />
                    <DataController />
                    <Popup />
                    <Canvas />
                </React.Fragment>
            </SnackbarProvider>
        );
    }
}

export default Main;
