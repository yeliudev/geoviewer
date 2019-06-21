/* Written by Ye Liu */

import React from 'react';
import M from 'materialize-css';

class About extends React.Component {
    state = {
        modal: null
    }

    componentDidMount() {
        // Initialize Modal
        document.addEventListener('DOMContentLoaded', () => {
            var elem = document.getElementById('about');
            var modal = M.Modal.init(elem);
            this.setState({
                modal: modal
            });
        });
    }

    componentWillUnmount() {
        // Destory Modal
        this.state.modal.destory();
    }

    render() {
        return (
            <div id="about" className="modal">
                <div className="modal-content">
                    <h4>About</h4>
                    <p>
                        GeoViewer is an online, light-weight and user-friendly geographical information visualizer, made with ReactJS + Material-UI + Mapbox-GL.
                    </p>
                    <p>
                        Designed & Written by&nbsp;
                        <a href="https://yeliu.me">Ye Liu</a>.
                    </p>
                    <p>
                        Source code licensed&nbsp;
                        <a href="https://opensource.org/licenses/mit-license.php">MIT</a>.
                        Website content licensed&nbsp;
                        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>.
                    </p>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-light btn-flat">OK</button>
                </div>
            </div>
        );
    }
}

export default About;
