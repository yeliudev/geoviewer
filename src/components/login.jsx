/* Written by Ye Liu */

import React from 'react';
import md5 from 'md5';

import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

import emitter from '@utils/events.utils';
import request from '@utils/request.utils';
import { SERVICE } from '@/config';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: indigo.A200
        }
    }
});

const styles = {
    loginContainer: {
        width: 300,
        height: 350,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        marginBottom: 20
    },
    inputBox: {
        width: 240,
        marginTop: 15
    },
    checkBox: {
        width: 140
    },
    loginBtnContainer: {
        display: 'inline-block',
        position: 'relative'
    },
    loginBtn: {
        width: 120,
        marginTop: 20
    },
    loginBtnProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -3,
        marginLeft: -12,
    }
};

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="down" ref={ref} {...props} />;
});

class Login extends React.Component {
    state = {
        open: false,
        remember: false,
        logining: false
    }

    handleLoginClose = () => {
        this.setState({
            open: false
        });
    }

    handleRememberChange = (e) => {
        this.setState({
            remember: e.target.checked
        });
    }

    handleLoginClick = () => {
        // Show button progress
        this.setState({
            logining: true
        });

        // Generate request parameters
        var params = {
            username: document.getElementById('username').value,
            password: md5(document.getElementById('password').value)
        };

        // Initiate request
        request({
            url: SERVICE.login.url,
            method: SERVICE.login.method,
            params: params,
            successCallback: (res) => {
                // Show snackbar
                emitter.emit('showSnackbar', 'success', `User '${res.user}' login successfully.`);

                // Switch login icon
                emitter.emit('setLoginState', true);

                this.setState({
                    open: false
                });
            },
            finallyCallback: () => {
                this.setState({
                    logining: false
                });
            }
        });
    }

    componentDidMount() {
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
                        <Typography style={styles.title} variant="h5" gutterBottom>Sign In</Typography>
                        <TextField
                            style={styles.inputBox}
                            variant="outlined"
                            margin="dense"
                            id="username"
                            label="Username"
                        />
                        <TextField
                            style={styles.inputBox}
                            variant="outlined"
                            margin="dense"
                            id="password"
                            type="password"
                            label="Password"
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
                            <Button style={styles.loginBtn} variant="contained" color="primary" disabled={this.state.logining} onClick={this.handleLoginClick}>LOGIN</Button>
                            {this.state.logining && <CircularProgress style={styles.loginBtnProgress} size={24} />}
                        </div>
                    </div>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

export default Login;
