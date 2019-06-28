/* Written by Ye Liu */

import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Icon from '@material-ui/core/Icon';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

import emitter from '@utils/events.utils';
import request from '@utils/request.utils';
import { SERVICE } from '@/config';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: grey[900]
        }
    }
});

const styles = {
    root: {
        position: 'fixed',
        top: 0,
        zIndex: 900
    },
    logoContainer: {
        height: 24,
        padding: '2px 5px'
    },
    logo: {
        height: 20
    },
    flexContainer: {
        position: 'absolute',
        right: 12,
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start'
    },
    svgIcon: {
        width: 24,
        height: 24
    },
    fontIcon: {
        fontSize: 29
    }
};

class Navigator extends React.Component {
    state = {
        loggedin: false
    }

    handleLoginClick = () => {
        // Display login modal
        emitter.emit('login');
    }

    handleLogoutClick = () => {
        // Initiate request
        request({
            url: SERVICE.logout.url,
            method: SERVICE.logout.method,
            successCallback: (res) => {
                // Display snackbar
                emitter.emit('showSnackbar', 'success', res.user ? `User ${res.user} logout successfully.` : 'Logout successfully.');

                // Switch login icon
                this.setState({
                    loggedin: false
                })
            }
        });
    }

    componentDidMount() {
        // Bind event listener
        this.setLoginStateListener = emitter.addListener('setLoginState', e => {
            this.setState({
                loggedin: e
            })
        });
    }

    componentWillUnmount() {
        // Remove event listener
        emitter.removeListener(this.setLoginStateListener);
    }

    render() {
        return (
            <MuiThemeProvider theme={theme} >
                <AppBar style={styles.root} position="static">
                    <Toolbar>
                        {/* Logo */}
                        <a style={styles.logoContainer} href="/">
                            <img style={styles.logo} src="./static/assets/logo.png" alt="" />
                        </a>

                        {/* Icons */}
                        <div style={styles.flexContainer}>
                            <Tooltip title="About" aria-label="About">
                                <IconButton className="icon-container modal-trigger" aria-label="About" color="inherit" data-target="about">
                                    <Icon style={styles.fontIcon}>info_outline</Icon>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="GitHub Repository" aria-label="GitHub Repository">
                                <IconButton className="icon-container" href="https://github.com/goolhanrry/geoviewer" aria-label="Github" color="inherit">
                                    <SvgIcon style={styles.svgIcon}>
                                        <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                            {this.state.loggedin ?
                                <Tooltip title="Logout" aria-label="Logout">
                                    <IconButton className="icon-container" aria-label="Logout" color="inherit" onClick={this.handleLogoutClick}>
                                        <Icon style={styles.fontIcon}>exit_to_app</Icon>
                                    </IconButton>
                                </Tooltip> :
                                <Tooltip title="Login" aria-label="Login">
                                    <IconButton className="icon-container" aria-label="Login" color="inherit" onClick={this.handleLoginClick}>
                                        <Icon style={styles.fontIcon}>account_circle</Icon>
                                    </IconButton>
                                </Tooltip>}
                        </div>
                    </Toolbar>
                </AppBar>
            </MuiThemeProvider>
        );
    }
}

export default Navigator;
