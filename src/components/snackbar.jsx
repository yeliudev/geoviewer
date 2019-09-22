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
            // Show snackbar
            this.props.enqueueSnackbar(message, {
                variant: variant,
                autoHideDuration: 3000,
                action
            });
        });

        this.showLoginingSnackbarListener = emitter.addListener('showLoginingSnackbar', e => {
            // Show persist snackbar
            var message = `Logining to ${e}...`;
            var key = this.props.enqueueSnackbar(message, {
                variant: 'info',
                persist: true,
            });

            // Save snackbar key
            this.setState({
                key: key
            });
        });

        this.hideLoginingSnackbarListener = emitter.addListener('hideLoginingSnackbar', () => {
            // Hide persist snackbar
            this.props.closeSnackbar(this.state.key);
        });
    }

    componentWillUnmount() {
        // Remove event listeners
        emitter.removeListener(this.showSnackbarListener);
        emitter.removeListener(this.showLoginingSnackbarListener);
        emitter.removeListener(this.hideLoginingSnackbarListener);
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default withSnackbar(Snackbar);
