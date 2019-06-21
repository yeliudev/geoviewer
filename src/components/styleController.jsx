/* Written by Ye Liu */

import React from 'react';

import Slide from '@material-ui/core/Slide';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import emitter from '@utils/events.utils';
import { mapStyles } from '@utils/map.utils';
import '@styles/styleController.style.css';

const styles = {
    root: {
        position: 'fixed',
        top: 74,
        right: 10,
        borderRadius: 4,
        width: 320,
        margin: 0,
        zIndex: 900
    },
    header: {
        backgroundColor: '#f1f1f1'
    },
    closeBtn: {
        position: 'absolute',
        top: 6,
        right: 8,
        fontSize: 22
    },
    stylePreview: {
        width: 60,
        height: 60,
        borderRadius: 2,
        cursor: 'pointer'
    }
};

class StyleController extends React.Component {
    state = {
        open: false
    }

    handleCloseClick = () => {
        this.setState({
            open: false
        });
    }

    handleStyleClick = (e) => {
        emitter.emit('setMapStyle', e);
        this.handleCloseClick();
    }

    componentDidMount() {
        // Bind event listeners
        this.openStyleControllerListener = emitter.addListener('openStyleController', () => {
            this.setState({
                open: true
            });
        });

        this.closeAllControllerListener = emitter.addListener('closeAllController', () => {
            this.setState({
                open: false
            });
        });
    }

    componentWillUnmount() {
        // Remove event listeners
        emitter.removeListener(this.openStyleControllerListener);
        emitter.removeListener(this.closeAllControllerListener);
    }

    render() {
        return (
            <Slide direction="left" in={this.state.open}>
                <Card style={styles.root}>
                    {/* Card header */}
                    <CardContent style={styles.header}>
                        <Typography gutterBottom variant="h5" component="h2">Map Styles</Typography>
                        <Typography variant="body2" color="textSecondary">Click to choose a map style</Typography>
                        <IconButton style={styles.closeBtn} aria-label="Close" onClick={this.handleCloseClick}>
                            <Icon fontSize="inherit">chevron_right</Icon>
                        </IconButton>
                    </CardContent>

                    {/* Card content */}
                    <CardContent>
                        <Grid container spacing={2}>
                            {Object.keys(mapStyles).map((item, index) => {
                                return (
                                    <Grid item style={styles.styleCard} key={index} xs={3}>
                                        <img src={`./static/assets/${item}.png`} alt="" className="hoverable" style={styles.stylePreview} onClick={this.handleStyleClick.bind(this, item)} />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </CardContent>
                </Card>
            </Slide>
        );
    }
}

export default StyleController;
