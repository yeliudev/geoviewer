/* Written by Ye Liu */

import React from 'react';
import md5 from 'md5';

import { Dialog, Slide, TextField, FormControlLabel, Checkbox, Button, CircularProgress } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors';

import emitter from '@utils/events.utils';
import request from '@utils/request.utils';
import { SERVICE } from '@config';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: indigo.A200
        }
    }
});

const styles = {
    loginContainer: {
        width: 320,
        height: 420,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    logo: {
        height: 100,
        width: 100,
        margin: '55px 0 30px'
    },
    inputBox: {
        width: 240,
        marginTop: 15
    },
    checkBox: {
        width: 150,
        margin: '5px 0 -5px'
    },
    loginBtnContainer: {
        display: 'inline-block',
        position: 'relative'
    },
    loginBtn: {
        width: 110,
        marginTop: 15
    },
    loginBtnProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -3,
        marginLeft: -12
    }
};

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="down" ref={ref} {...props} />;
});

class Login extends React.Component {
    state = {
        open: false,
        remember: false,
        processing: false,
        username: '',
        password: ''
    }

    handleLoginClose = () => {
        this.setState({
            open: false
        });
    }

    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value
        });
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    handleRememberChange = (e) => {
        this.setState({
            remember: e.target.checked
        });
    }

    handleLoginClick = () => {
        const username = document.getElementById('username').value;

        // Show logging in progress
        emitter.emit('showLoggingInSnackbar', username);
        this.setState({
            processing: true
        });

        var password = document.getElementById('password').value;
        password = password.substr(0, 5) === '$md5$' ? password.substr(5) : md5(password);

        // Generate request parameters
        const params = {
            username: username,
            password: password
        };

        // Initialize request
        request({
            url: SERVICE.login.url,
            method: SERVICE.login.method,
            params: params,
            successCallback: (res) => {
                // Show snackbar
                emitter.emit('showSnackbar', 'success', `User '${res.user}' logged in successfully.`);

                // Switch login icon
                emitter.emit('setLoginState', true);

                // Save login data
                if (this.state.remember) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('password', '$md5$' + password);
                }

                this.setState({
                    open: false
                });
            },
            finallyCallback: () => {
                // Clear login data
                if (!this.state.remember) {
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');

                    this.setState({
                        username: '',
                        password: ''
                    })
                }

                emitter.emit('hideLoginingSnackbar');
                this.setState({
                    processing: false
                });
            }
        });
    }

    componentDidMount() {
        // Get saved login data
        if (localStorage.hasOwnProperty('username') && localStorage.hasOwnProperty('password')) {
            this.setState({
                username: localStorage.getItem('username'),
                password: localStorage.getItem('password'),
                remember: true
            });
        }

        // Bind event listener
        this.loginListener = emitter.addListener('login', () => {
            this.setState({
                open: true
            });
        });
    }

    componentWillUnmount() {
        // Remove event listener
        emitter.removeListener(this.loginListener);
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Dialog open={this.state.open} TransitionComponent={Transition} onClose={this.handleLoginClose}>
                    <div style={styles.loginContainer}>
                        <img style={styles.logo} src="static/assets/logo-circle.png" alt="" />
                        <TextField
                            style={styles.inputBox}
                            variant="outlined"
                            margin="dense"
                            id="username"
                            label="Username"
                            value={this.state.username}
                            onChange={this.handleUsernameChange}
                        />
                        <TextField
                            style={styles.inputBox}
                            variant="outlined"
                            margin="dense"
                            id="password"
                            type="password"
                            label="Password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                        />
                        <FormControlLabel
                            style={styles.checkBox}
                            control={
                                <Checkbox
                                    checked={this.state.remember}
                                    onChange={this.handleRememberChange}
                                    value="remember"
                                    color="primary"
                                />
                            }
                            label="Remember me"
                        />
                        <div style={styles.loginBtnContainer}>
                            <Button style={styles.loginBtn} variant="contained" color="primary" disabled={this.state.processing} onClick={this.handleLoginClick}>LOGIN</Button>
                            {this.state.processing && <CircularProgress style={styles.loginBtnProgress} size={24} />}
                        </div>
                    </div>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

export default Login;
