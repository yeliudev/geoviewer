/* Written by Ye Liu */

import React from 'react';
import M from 'materialize-css';

class Feature extends React.Component {
    state = {
        tapTarget: null
    }

    componentDidMount() {
        document.addEventListener('DOMContentLoaded', () => {
            // Set anchor id
            document.getElementsByClassName('MuiSpeedDial-fab')[0].setAttribute('id', 'menu');

            // Initialize TapTarget
            var elems = document.querySelectorAll('.tap-target');
            var tapTarget = M.TapTarget.init(elems)[0];

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
    }

    render() {
        return (
            <div className="tap-target indigo accent-2" data-target="menu">
                <div className="tap-target-content white-text">
                    <h5>Welcome to GeoViewer!</h5>
                    <p>This is an online, light-weight and user-friendly geographical information visualizer, made with ReactJS + Material-UI + Mapbox-GL.</p>
                </div>
            </div>
        );
    }
}

export default Feature;
