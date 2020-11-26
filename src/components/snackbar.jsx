/* Written by Ye Liu */

import React from 'react';
import { withSnackbar } from 'notistack';

import { Button } from '@material-ui/core';

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
            // Set error message
            if (variant === 'error') {
                message = 'Error: ' + message;
            }

            // Show snackbar
            this.props.enqueueSnackbar(message, {
                variant: variant,
                autoHideDuration: 3000,
                action
            });
        });

        this.showLoggingInSnackbarListener = emitter.addListener('showLoggingInSnackbar', e => {
            // Show persist snackbar
            const key = this.props.enqueueSnackbar(`Logging in to ${e}...`, {
                variant: 'info',
                persist: true, anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center'
                }
            });

            // Save snackbar key
            this.setState({
                key: key
            });
        });

        this.hideLoggingInSnackbarListener = emitter.addListener('hideLoginingSnackbar', () => {
            // Hide persist snackbar
            this.props.closeSnackbar(this.state.key);
        });
    }

    componentWillUnmount() {
        // Remove event listeners
        emitter.removeListener(this.showSnackbarListener);
        emitter.removeListener(this.showLoggingInSnackbarListener);
        emitter.removeListener(this.hideLoggingInSnackbarListener);
    }

    render() {
        return <div></div>;
    }
}

export default withSnackbar(Snackbar);
