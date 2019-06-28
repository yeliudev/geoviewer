/* Written by Ye Liu */

import React from 'react';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Icon from '@material-ui/core/Icon';

import emitter from '@utils/events.utils';
import '@styles/menu.style.css';

const styles = {
    root: {
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 1000
    }
};

class Menu extends React.Component {
    state = {
        open: false,
        actions: [
            {
                name: 'Save changes',
                icon: <Icon>publish</Icon>,
                color: "green"
            },
            {
                name: 'Edit data',
                icon: <Icon>insert_chart</Icon>,
                color: "blue",
                callback: () => {
                    emitter.emit('closeAllController');
                    emitter.emit('openDataController');
                    this.handleClose();
                }
            },
            {
                name: 'Configure layers',
                icon: <Icon>layers</Icon>,
                color: "yellow darken-1",
                callback: () => {
                    emitter.emit('closeAllController');
                    emitter.emit('openLayerController');
                    this.handleClose();
                }
            },
            {
                name: 'Switch style',
                icon: <Icon>brush</Icon>,
                color: "red accent-2",
                callback: () => {
                    emitter.emit('closeAllController');
                    emitter.emit('openStyleController');
                    this.handleClose();
                }
            }
        ]
    }

    handleClick = () => {
        this.setState(state => ({
            open: !state.open,
        }));
    }

    handleOpen = () => {
        this.setState({
            open: true
        });
    }

    handleClose = () => {
        this.setState({
            open: false
        });
    }

    componentDidMount() {
        // Set anchor id
        document.getElementsByClassName('MuiSpeedDial-fab')[0].setAttribute('id', 'menu');

        // Bind event listener
        this.openMenuListener = emitter.addListener('openMenu', () => {
            this.setState({
                open: true
            });
        });

        // Display feature
        setTimeout(() => {
            emitter.emit('displayFeature');
        }, 800);
    }

    componentWillUnmount() {
        // Remove event listener
        emitter.removeListener(this.openMenuListener);
    }

    render() {
        return (
            <SpeedDial
                style={styles.root}
                open={this.state.open}
                ariaLabel="Menu"
                icon={<SpeedDialIcon icon={<Icon>menu</Icon>} openIcon={<Icon>clear</Icon>} />}
                onMouseEnter={this.handleOpen}
                onMouseLeave={this.handleClose}
                onClick={this.handleClick}
            >
                {this.state.actions.map(action => {
                    return (
                        <SpeedDialAction
                            key={action.name}
                            className={action.color}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={action.callback} />
                    );
                })}
            </SpeedDial>
        );
    }
}

export default Menu;
