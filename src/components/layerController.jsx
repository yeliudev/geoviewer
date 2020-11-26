/* Written by Ye Liu */

import React from 'react';
import Sortable from 'sortablejs';

import { Slide, Card, CardContent, Typography, FormControl, InputLabel, Select, Input, MenuItem, Checkbox, Chip, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Avatar, IconButton, Icon } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors';

import emitter from '@utils/events.utils';
import request from '@utils/request.utils';
import datasets from '@utils/datasets.utils';
import '@styles/layerController.style.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: indigo.A200
        }
    }
});

const styles = {
    root: {
        position: 'fixed',
        top: 74,
        right: 10,
        width: 300,
        borderRadius: 4,
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
    content: {
        paddingBottom: 16
    },
    select: {
        width: '100%'
    },
    placeholder: {
        height: 28,
        lineHeight: '28px',
        cursor: 'pointer'
    },
    chipContainer: {
        display: 'flex',
        overflow: 'hidden'
    },
    chip: {
        height: 28,
        lineHeight: '28px',
        marginRight: 5
    },
    layerList: {
        marginTop: 6,
        paddingBottom: 0
    },
    layerItem: {
        paddingLeft: 2
    },
    sortAction: {
        right: 12
    }
};

class LayerController extends React.Component {
    state = {
        open: false,
        selected: []
    }

    handleCloseClick = () => {
        this.setState({
            open: false
        });
    }

    handleDatasetChange = (e) => {
        // Check if deleting dataset
        var deleting = false;
        this.state.selected.map(item => {
            if (e.target.value.indexOf(item) === -1) {
                emitter.emit('removeDataset', item);
                deleting = true;
            }
            return true;
        });

        // Load dataset
        if (!deleting && e.target.value.length) {
            // Get dataset id
            const id = e.target.value[e.target.value.length - 1];

            // Display snackbar
            emitter.emit('showSnackbar', 'default', `Downloading dataset '${id}'.`);

            // Initialize request
            request({
                url: datasets[id].url,
                method: 'GET',
                successCallback: (res) => {
                    emitter.emit('displayDataset', id, res.geometry, datasets[id].color);
                    emitter.emit('showSnackbar', 'success', `Dataset '${id}' downloaded successfully.`);
                }
            });
        }

        // Save selected datasets
        this.setState({
            selected: e.target.value.reverse()
        });
    }

    handleLayerListUpdate = (e) => {
        // Update chips
        const selected = this.state.selected;
        const removed = selected.splice(e.oldIndex, 1);
        const length = selected.push(0);
        for (var i = length - 1; i > e.newIndex; i--) {
            selected[i] = selected[i - 1];
        }
        selected[e.newIndex] = removed[0];

        // Move layer
        emitter.emit('moveLayer', selected[e.newIndex], e.newIndex > 0 ? selected[e.newIndex - 1] : null);

        this.setState({
            selected: this.state.selected
        });
    }

    componentDidMount() {
        // Bind event listeners
        this.openLayerControllerListener = emitter.addListener('openLayerController', () => {
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

    componentDidUpdate() {
        // Initialize sortable list
        if (document.getElementById('layers')) {
            Sortable.create(document.getElementById('layers'), {
                group: 'layers',
                handle: '.handle',
                animation: 200,
                onUpdate: this.handleLayerListUpdate
            });
        }
    }

    componentWillUnmount() {
        // Remove event listeners
        emitter.removeListener(this.openLayerControllerListener);
        emitter.removeListener(this.closeAllControllerListener);
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Slide direction="left" in={this.state.open}>
                    <Card style={styles.root}>
                        {/* Card header */}
                        <CardContent style={styles.header}>
                            <Typography gutterBottom variant="h5" component="h2">Layers</Typography>
                            <Typography variant="body2" color="textSecondary">Download and display layers</Typography>
                            <IconButton style={styles.closeBtn} aria-label="Close" onClick={this.handleCloseClick}>
                                <Icon fontSize="inherit">chevron_right</Icon>
                            </IconButton>
                        </CardContent>

                        {/* Card content */}
                        <CardContent style={this.state.selected.length ? styles.content : null}>
                            <FormControl style={styles.select}>
                                <InputLabel shrink htmlFor="dataset-label">Datasets</InputLabel>
                                <Select
                                    multiple
                                    displayEmpty
                                    value={this.state.selected}
                                    onChange={this.handleDatasetChange}
                                    input={<Input id="dataset-label" />}
                                    renderValue={selected => (
                                        selected.length ?
                                            <div style={styles.chipContainer}>
                                                {selected.map(item => (
                                                    <Chip key={item} style={styles.chip} label={item} />
                                                ))}
                                            </div> :
                                            <InputLabel style={styles.placeholder}>Choose datasets</InputLabel>
                                    )}
                                >
                                    {Object.keys(datasets).map(item => (
                                        <MenuItem key={item} value={item}>
                                            <Checkbox checked={this.state.selected.indexOf(item) > -1} color="primary" />
                                            <ListItemText primary={item} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {this.state.selected.length ?
                                <List id="layers" style={styles.layerList}>
                                    {this.state.selected.map(item => (
                                        <ListItem style={styles.layerItem} key={item}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <Icon color="action">layers</Icon>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={item} />
                                            <ListItemSecondaryAction style={styles.sortAction}>
                                                <IconButton className="handle" edge="end" aria-label="Sort" disableRipple disableFocusRipple>
                                                    <Icon>menu</Icon>
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                                : null}
                        </CardContent>
                    </Card>
                </Slide>
            </MuiThemeProvider>
        );
    }
}

export default LayerController;
