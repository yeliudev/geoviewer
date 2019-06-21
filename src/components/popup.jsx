/* Written by Ye Liu */

import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import emitter from '@utils/events.utils';

const styles = {
    root: {
        minWidth: 320,
        maxWidth: 345
    },
    image: {
        height: 140
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'space-between',
        padding: '5px 16px 2px'
    },
    titleContainerEnd: {
        display: 'flex',
        alignItems: 'space-between',
        padding: '5px 16px 10px'
    },
    nameContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: 65
    },
    popupName: {
        display: 'inline-block'
    },
    popupPinyin: {
        display: 'inline-block'
    },
    weatherWidgetContainer: {
        position: 'absolute',
        right: 0,
        width: 155
    },
    introductionContainer: {
        paddingTop: 5
    },
    popupIntroduction: {
        wordWrap: 'break-word',
        wordBreak: 'break-all'
    }
};

class Popup extends React.Component {
    state = {
        open: false,
        data: {}
    }

    componentDidMount() {
        // Bind event listener
        this.bindPopupListener = emitter.addListener('bindPopup', e => {
            // Bind popup
            var el = document.getElementById('popup');
            document.getElementById('popup-container').appendChild(el);

            // Load weather widget
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://darksky.net/widget/default-small/${e.geometry.geometry.coordinates[1].toString()},${e.geometry.geometry.coordinates[0].toString()}/ca12/en.js?height=60`;
            document.getElementById('customize-script-container').appendChild(script);

            // Display popup
            this.setState({
                open: true,
                data: e
            });
        });
    }

    componentWillUnmount() {
        // Remove event listener
        emitter.removeListener(this.bindPopupListener);
    }

    render() {
        return (
            <Card id="popup" style={styles.root} className={this.state.open ? null : 'hidden'}>
                {/* Image */}
                <CardMedia
                    className={this.state.data.image && this.state.data.image.src ? null : 'hidden'}
                    style={styles.image}
                    image={this.state.data.image && this.state.data.image.src ? this.state.data.image.src : '#'}
                />

                {/* Object Name */}
                <CardContent style={this.state.data.introduction ? styles.titleContainer : styles.titleContainerEnd}>
                    <div style={styles.nameContainer}>
                        <Typography style={styles.popupName} variant="h5" component="h2">{this.state.data.name}</Typography>
                        <Typography style={styles.popupPinyin} variant="subtitle1" color="textSecondary" component="h3">{this.state.data.pinyin}</Typography>
                    </div>
                    <div id="customize-script-container" style={styles.weatherWidgetContainer}></div>
                </CardContent>

                {/* Object Introduction */}
                <CardContent style={styles.introductionContainer} className={this.state.data.introduction ? null : 'hidden'}>
                    <Typography style={styles.popupIntroduction} variant="body2" color="textSecondary" component="p">{this.state.data.introduction}</Typography>
                </CardContent>
            </Card >
        );
    }
}

export default Popup;
