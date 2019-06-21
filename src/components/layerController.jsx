/* Written by Ye Liu */

import React from 'react';
import Sortable from 'sortablejs';

import Slide from '@material-ui/core/Slide';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

import emitter from '@utils/events.utils';
import { datasets } from '@utils/dataset.utils';
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
        datasetList: [],
        selected: []
    }

    handleCloseClick = () => {
        this.setState({
            open: false
        });
    }

    handleDatasetChange = (e) => {
        this.setState({
            selected: e.target.value
        })
    }

    handleLayerListUpdate = (e) => {
        [this.state.selected[e.oldIndex], this.state.selected[e.newIndex]] = [this.state.selected[e.newIndex], this.state.selected[e.oldIndex]];
        this.setState({
            selected: this.state.selected
        })
    }

    componentDidMount() {
        // Initialize dataset list
        datasets.map(item => {
            this.state.datasetList.push(item.name);
            return true;
        });

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
        var layers = document.getElementById('layers');
        if (layers) {
            Sortable.create(layers, {
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
                            <Typography variant="body2" color="textSecondary">Configure and sort layers</Typography>
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
                                    {this.state.datasetList.map(item => (
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
