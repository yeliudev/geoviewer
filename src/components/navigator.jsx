/* Written by Ye Liu */

import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: grey[900]
        }
    }
});

const useStyles = makeStyles(() => ({
    root: {
        position: 'fixed',
        zIndex: 100
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
    iconContainer: {
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
        }
    },
    svgIcon: {
        width: 24,
        height: 24
    },
    fontIcon: {
        fontSize: 29
    }
}));

// Use function component to enable style hook
const Navigator = () => {
    const classes = useStyles();
    return (
        <MuiThemeProvider theme={theme}>
            <AppBar className={classes.root} position="static">
                <Toolbar>
                    {/* Logo */}
                    <a className={classes.logoContainer} href="/">
                        <img className={classes.logo} src="./assets/logo.png" alt="" />
                    </a>

                    {/* Icons */}
                    <div className={classes.flexContainer}>
                        <Tooltip title="About" aria-label="About" enterDelay={200}>
                            <IconButton className={classes.iconContainer + " modal-trigger"} href="about" aria-label="About" color="inherit" data-target="about">
                                <Icon className={classes.fontIcon}>info_outline</Icon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="GitHub Repository" aria-label="GitHub Repository" enterDelay={200}>
                            <IconButton className={classes.iconContainer} href="https://github.com/goolhanrry/geoviewer" aria-label="Github" color="inherit">
                                <SvgIcon className={classes.svgIcon}>
                                    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Toolbar>
            </AppBar>
        </MuiThemeProvider>
    );
}

export default Navigator;
