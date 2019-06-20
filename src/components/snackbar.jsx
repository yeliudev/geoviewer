/* Written by Ye Liu */

import React from 'react';
import { withSnackbar } from 'notistack';

import Button from '@material-ui/core/Button';

import emitter from '@utils/events.utils';
import '@styles/snackbar.style.css';

class Snackbar extends React.Component {
    state = {
        key: null
    }

    handleCloseClick = (key) => {
        this.props.closeSnackbar(key);
    }

    componentDidMount() {
        // Initialize dismiss action
        const action = (key) => (
            <React.Fragment>
                <Button className="snackbar-btn white-text" onClick={this.handleCloseClick.bind(this, key)}>DISMISS</Button>
            </React.Fragment>
        );

        // Bind event listeners
        this.showSnackbarListener = emitter.addListener('showSnackbar', (variant, message) => {
            // Show snackbar
            this.props.enqueueSnackbar(message, {
                variant: variant,
                autoHideDuration: 3000,
                action
            });
        });

        this.showloggingSnackbarListener = emitter.addListener('showloggingSnackbar', (e) => {
            // Show persist snackbar
            var message = `Logging to ${e}...`;
            var key = this.props.enqueueSnackbar(message, {
                variant: 'info',
                persist: true,
            });

            // Save snackbar key
            this.setState({
                key: key
            });
        });

        this.hideloggingSnackbarListener = emitter.addListener('hideloggingSnackbar', () => {
            // Hide persist snackbar
            this.props.closeSnackbar(this.state.key);
        });
    }

    componentWillUnmount() {
        // Remove event listeners
        emitter.removeListener(this.showSnackbarListener);
        emitter.removeListener(this.showloggingSnackbarListener);
        emitter.removeListener(this.hideloggingSnackbarListener);
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default withSnackbar(Snackbar);
