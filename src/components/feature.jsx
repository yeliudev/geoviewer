/* Written by Ye Liu */

import React from 'react';
import M from 'materialize-css';

class Feature extends React.Component {
    state = {
        tapTarget: null
    }

    componentDidMount() {
        // Bind event listener
        document.addEventListener('DOMContentLoaded', () => {
            // Init TapTarget
            var elems = document.querySelectorAll('.tap-target');
            var tapTarget = M.TapTarget.init(elems)[0];
            this.setState({
                tapTarget: tapTarget
            });

            setTimeout(() => {
                this.state.tapTarget.open();
            }, 1000);
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
                    <p>This is an online, light-weight and user-friendly geographical information visualizer, made with ReactJS + Materialize + Mapbox-GL.</p>
                </div>
            </div>
        );
    }
}

export default Feature;
