/* Written by Ye Liu */

import React from 'react';
import M from 'materialize-css';

import emitter from '@utils/events.utils';

class Feature extends React.Component {
    state = {
        tapTarget: null
    }

    componentDidMount() {
        // Bind event listener
        this.displayFeatureListener = emitter.addListener('displayFeature', () => {
            // Initialize TapTarget
            var elems = document.querySelectorAll('.tap-target');
            var tapTarget = M.TapTarget.init(elems, {
                onClose: () => {
                    emitter.emit('openMenu');
                }
            })[0];

            // Display feature
            tapTarget.open();

            this.setState({
                tapTarget: tapTarget
            });
        });
    }

    componentWillUnmount() {
        // Destory TapTarget
        this.state.tapTarget.destory();

        // Remove event listener
        emitter.removeListener(this.openMenuListener);
    }

    render() {
        return (
            <div className="tap-target indigo accent-2" data-target="menu">
                <div className="tap-target-content white-text">
                    <h5>Welcome to GeoViewer!</h5>
                    <p>This is an online, light-weight and user-friendly geographical information visualizer, made with React + Material-UI + Mapbox-GL + Koa.</p>
                </div>
            </div>
        );
    }
}

export default Feature;
