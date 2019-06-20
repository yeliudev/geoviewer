/* Written by Ye Liu */

import React from 'react';
import M from 'materialize-css';
import MaterialTable, { MTableEditField } from 'material-table';

import Slide from '@material-ui/core/Slide';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

import emitter from '@utils/events.utils';
import request from '@utils/request.utils';
import { checkEmptyObject } from '@utils/method.utils';
import { ACCESS_TOKEN, SERVICE } from '@/config';
import '@styles/dataController.style.css';

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
        borderRadius: 4,
        minWidth: 350,
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
    searchField: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: 40,
        padding: '2px 4px'
    },
    searchBox: {
        marginLeft: 8,
        flex: 1,
        border: 'none !important'
    },
    searchBoxBtn: {
        padding: 8
    },
    searchOptionsContainer: {
        padding: '5px 2px'
    },
    searchOption: {
        color: 'rgba(0, 0, 0, 0.6)',
        cursor: 'pointer'
    },
    searchBoxProgress: {
        marginRight: 8
    },
    searchBoxDivider: {
        width: 1,
        height: 28,
        margin: 4
    },
    resultWrapperOpen: {
        maxWidth: 800
    },
    resultWrapperClosed: {
        maxWidth: 350
    },
    resultContainer: {
        paddingTop: 0,
        paddingBottom: 0
    },
    resultTable: {
        boxShadow: 'none'
    },
    uploadBoxInput: {
        display: 'none'
    },
    uploadBoxBtnEdit: {
        width: 40,
        height: 40,
        lineHeight: '40px',
        textAlign: 'center',
        borderRadius: '50%',
        fontSize: 22
    },
    wrapBtn: {
        position: 'absolute',
        bottom: 12,
        left: 18,
        padding: 10,
        fontSize: 24
    },
    addPointWrapperOpen: {
        maxWidth: 350
    },
    addPointWrapperClose: {
        width: 0
    },
    uploadBoxBtnAdd: {
        width: 90,
        height: 90,
        lineHeight: '90px',
        textAlign: 'center',
        borderRadius: '50%',
        fontSize: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
    },
    previewImageContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    nameTextField: {
        margin: '0 20px 0 13px'
    },
    pinyinTextField: {
        margin: '10px 20px 10px 13px'
    },
    introTextField: {
        width: '100%',
        marginTop: 5
    },
    locationImageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    locationImage: {
        display: 'block',
        marginTop: 5,
        width: 225,
        height: 140,
        borderRadius: 3,
        cursor: 'pointer'
    },
    locationLabel: {
        display: 'block',
        marginTop: 6
    },
    actions: {
        paddingTop: 10
    },
    saveBtn: {
        display: 'inline-block',
        position: 'relative',
        marginRight: 10
    },
    saveBtnProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
};

class DataController extends React.Component {
    state = {
        open: false,
        resultUnwrap: false,
        addPointUnwrap: false,
        optionsOpen: false,
        searching: false,
        submitting: false,
        anchorEl: null,
        geometry: null,
        previewImage: null,
        previewMapUrl: null,
        previewCoordinate: {},
        data: [],
        searchOptions: [
            {
                value: 'gid',
                label: 'Gid',
                checked: true
            },
            {
                value: 'name',
                label: 'Name',
                checked: true
            },
            {
                value: 'pinyin',
                label: 'Pinyin',
                checked: true
            },
            {
                value: 'introduction',
                label: 'Introduction',
                checked: false
            }
        ]
    }

    initMaterialbox = () => {
        var elems = document.querySelectorAll('.materialboxed');
        M.Materialbox.init(elems, {
            onOpenStart: (e) => {
                e.parentNode.style.overflow = 'visible';
            },
            onCloseEnd: (e) => {
                e.parentNode.style.overflow = 'hidden';
            }
        });
    }

    resetPreviewImage = () => {
        this.setState({
            previewImage: null
        });
    }

    resetNewPointData = () => {
        this.setState({
            previewMapUrl: null,
            geometry: null,
            previewCoordinate: {}
        });
    }

    handleCloseClick = () => {
        this.setState({
            open: false
        });
    }

    handleAddClick = () => {
        // Get GeoJSON from map
        emitter.emit('getPoint');

        // Exit search mode
        this.handleWrapClick();

        // Initialize new point data
        this.resetPreviewImage();
        this.resetNewPointData();

        // Wrap add point panel
        this.setState({
            addPointUnwrap: false
        });
    }

    handleWrapClick = () => {
        // Remove temp layer
        emitter.emit('removeTempLayer');

        // Reset preview image
        this.resetPreviewImage();

        // Clear search box
        document.getElementById('search-box').value = '';

        this.setState({
            resultUnwrap: false
        });
    }

    handleImageChange = (e) => {
        // Check if file selected
        if (!e.target.files[0]) {
            return;
        }

        // Check image size (smaller than 1MB)
        if (e.target.files[0].size > 1048576) {
            emitter.emit('showSnackbar', 'error', 'Error: Image must be smaller than 1MB.');
            return;
        }

        // Encode image with base64
        this.state.reader.readAsDataURL(e.target.files[0]);
    }

    handleDoneEdit = () => {
        // Reset preview image
        this.resetPreviewImage();

        // Initialize Materialbox
        setTimeout(this.initMaterialbox, 800);
    }

    handleSearchOptionsClick = () => {
        this.setState({
            optionsOpen: true
        });
    }

    handleSearchOptionsClose = () => {
        this.setState({
            optionsOpen: false
        });
    }

    handleSearchOptionChange = (e) => {
        // Update search options
        var option = null;
        var flag = false;
        this.state.searchOptions.map(item => {
            if (item.value === e.currentTarget.value) {
                item.checked = e.currentTarget.checked;
                option = item;
            }
            flag = flag || item.checked;
            return true;
        });

        // Check whether at least one option checked
        if (!flag) {
            emitter.emit('showSnackbar', 'error', 'Error: Please select at least one option.');
            option.checked = true;
            return;
        }

        this.setState({
            searchOptions: this.state.searchOptions
        });
    }

    handleSearchClick = () => {
        // Exit add point mode
        this.handleCancelClick();

        // Get keyword
        var keyword = document.getElementById('search-box').value;
        if (!keyword) {
            return;
        }

        // Show searching progress
        this.setState({
            searching: true
        });

        // Get search options
        var options = {};
        this.state.searchOptions.map(item => {
            options[item.value] = item.checked;
            return true;
        });

        // Initiate request
        request({
            url: SERVICE.search.url,
            method: SERVICE.search.method,
            params: {
                keyword: keyword,
                options: JSON.stringify(options)
            },
            successCallback: (res) => {
                // Display data
                this.setState({
                    addPointWrapperClose: false,
                    resultUnwrap: true,
                    data: res.data
                }, this.initMaterialbox);
            },
            finallyCallback: () => {
                // Show search button
                this.setState({
                    searching: false
                });
            }
        });
    }

    handlePreviewClick = (e, data) => {
        // Show marker and popup on map
        emitter.emit('displayTempLayer', data);
    }

    handlePreviewMapClick = () => {
        // Get GeoJSON from map
        emitter.emit('getPoint');

        this.setState({
            addPointUnwrap: false
        });
    }

    handleSubmitClick = () => {
        // Remove temp point
        emitter.emit('removeTempPoint');

        // Show button progress
        this.setState({
            submitting: true
        });

        // Generate request parameters
        var params = {
            name: document.getElementById('name').value,
            pinyin: document.getElementById('pinyin').value,
            introduction: document.getElementById('introduction').value,
            image: this.state.previewImage ? this.state.previewImage : {},
            geometry: this.state.geometry
        };

        // Initiate request
        request({
            url: SERVICE.insert.url,
            method: SERVICE.insert.method,
            params: params,
            successCallback: (res) => {
                // Show snackbar
                emitter.emit('showSnackbar', 'success', `Insert new object with Gid = '${res.gid}' successfully.`);

                this.handleCancelClick();
            },
            finallyCallback: () => {
                this.setState({
                    searching: false,
                    submitting: false
                });
            }
        });
    }

    handleCancelClick = () => {
        // Remove temp point
        emitter.emit('removeTempPoint');

        // Empty input box
        document.getElementById('name').value = '';
        document.getElementById('pinyin').value = '';
        document.getElementById('introduction').value = '';

        // Reset data
        this.resetPreviewImage();
        this.resetNewPointData();

        // Wrap add point panel
        this.setState({
            addPointUnwrap: false
        });
    }

    handleRowUpdate = (newData, oldData) => {
        return new Promise(resolve => {
            // Check if Gid changed
            if (oldData.gid !== newData.gid) {
                emitter.emit('showSnackbar', 'error', "Column 'Gid' is readonly.");
            }

            // Generate request parameters
            var params = {
                gid: oldData.gid
            };

            if (this.state.previewImage) {
                newData.image = this.state.previewImage;
            } else {
                newData.image = {};
            }

            Object.keys(newData).map(key => {
                if (key !== 'geometry' && newData[key] !== oldData[key]) {
                    params[key] = newData[key]
                }
                return true;
            });

            // return if nothing to update
            if (checkEmptyObject(params)) {
                emitter.emit('showSnackbar', 'default', 'Nothing to update.');
                return;
            }

            // Initiate request
            request({
                url: SERVICE.update.url,
                method: SERVICE.update.method,
                params: params,
                successCallback: (res) => {
                    // Show success snackbar
                    var message = `Update ${res.count} ${res.count > 1 ? 'objects' : 'object'} successfully.`;
                    emitter.emit('showSnackbar', 'success', message);

                    // Refresh table
                    var data = this.state.data;
                    data[data.indexOf(oldData)] = newData;
                    this.setState({
                        data: data
                    });
                },
                finallyCallback: () => {
                    // Resolve promise
                    resolve();

                    // Exit edit mode
                    this.handleDoneEdit();
                }
            });
        });
    }

    handleRowDelete = (oldData) => {
        return new Promise(resolve => {
            // Initiate request
            request({
                url: SERVICE.delete.url,
                method: SERVICE.delete.method,
                params: {
                    gid: oldData.gid
                },
                successCallback: (res) => {
                    // Show success snackbar
                    var message = `Delete ${res.count} ${res.count > 1 ? 'objects' : 'object'} successfully.`;
                    emitter.emit('showSnackbar', 'success', message);

                    // Refresh table
                    var data = [...this.state.data];
                    data.splice(data.indexOf(oldData), 1);
                    this.setState({ ...this.state, data });
                },
                finallyCallback: () => {
                    // Resolve promise
                    resolve();

                    // Remove temp layer
                    emitter.emit('removeTempLayer');

                    // Exit edit mode
                    this.handleDoneEdit();
                }
            });
        });
    }

    componentDidMount() {
        // Initialize popover
        var anchorEl = document.getElementById('anchorEl');

        // Initialize file reader
        var reader = new FileReader();
        reader.onload = (e) => {
            // Get image info
            var image = new Image();
            image.src = e.target.result;

            // Construct preview image object
            var previewImage = {
                longitude: image.height > image.width,
                src: e.target.result
            }

            // Preview image
            this.setState({
                previewImage: previewImage
            });
        };

        this.setState({
            reader: reader,
            anchorEl: anchorEl
        });

        // Bind event listeners
        this.openDataControllerListener = emitter.addListener('openDataController', () => {
            this.setState({
                open: true
            });
        });

        this.closeAllControllerListener = emitter.addListener('closeAllController', () => {
            this.setState({
                open: false
            });
        });

        this.updatePointListener = emitter.addListener('setPoint', (feature, styleCode, zoom) => {
            var [lng, lat] = feature.geometry.coordinates;
            var previewMapUrl = `https://api.mapbox.com/styles/v1/${styleCode}/static/pin-s+f00(${lng},${lat})/${lng},${lat},${zoom},0,1/250x155@2x?access_token=${ACCESS_TOKEN}`;

            this.setState({
                addPointUnwrap: true,
                previewMapUrl: previewMapUrl,
                geometry: feature,
                previewCoordinate: {
                    lng: parseFloat(lng).toFixed(3),
                    lat: parseFloat(lat).toFixed(3)
                }
            });
        });
    }

    componentWillUnmount() {
        // Remove event listeners
        emitter.removeListener(this.openDataControllerListener);
        emitter.removeListener(this.closeAllControllerListener);
        emitter.removeListener(this.addPointListener);
        emitter.removeListener(this.updatePointListener);

        // Destory Materialbox
        var elems = document.querySelectorAll('.materialboxed');
        elems.map(elem => elem.destory());
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Slide direction="left" in={this.state.open}>
                    <Card style={styles.root}>
                        {/* Card header */}
                        <CardContent style={styles.header}>
                            <Typography gutterBottom variant="h5" component="h2">Spatial Data</Typography>
                            <Typography variant="body2" color="textSecondary">Search and configure spatial data</Typography>
                            <IconButton style={styles.closeBtn} aria-label="Close" onClick={this.handleCloseClick}>
                                <Icon fontSize="inherit">chevron_right</Icon>
                            </IconButton>
                        </CardContent>

                        {/* Search box */}
                        <CardContent>
                            <Paper id="anchorEl" style={styles.searchField}>
                                <IconButton style={styles.searchBoxBtn} aria-label="Menu" onClick={this.handleSearchOptionsClick}>
                                    <Icon>menu</Icon>
                                </IconButton>
                                <Popover
                                    open={this.state.optionsOpen}
                                    anchorEl={this.state.anchorEl}
                                    onClose={this.handleSearchOptionsClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    <FormControl style={styles.searchOptionsContainer}>
                                        {this.state.searchOptions.map(item => (
                                            <FormControlLabel
                                                style={styles.searchOption}
                                                key={item.value}
                                                checked={item.checked}
                                                value={item.value}
                                                control={<Checkbox color="primary" />}
                                                label={item.label}
                                                onChange={this.handleSearchOptionChange}
                                            />
                                        ))}
                                    </FormControl>
                                </Popover>
                                <InputBase id="search-box" style={styles.searchBox} placeholder="Search Data..." />
                                {this.state.searching ?
                                    <CircularProgress style={styles.searchBoxProgress} size={18} /> :
                                    <IconButton style={styles.searchBoxBtn} aria-label="Search" onClick={this.handleSearchClick}>
                                        <Icon>search</Icon>
                                    </IconButton>}
                                <Divider style={styles.searchBoxDivider} />
                                <IconButton style={styles.searchBoxBtn} color="primary" aria-label="Add" onClick={this.handleAddClick}>
                                    <Icon>add_circle</Icon>
                                </IconButton>
                            </Paper>
                        </CardContent>

                        {/* Search result wrapper */}
                        <Collapse style={this.state.resultUnwrap ? styles.resultWrapperOpen : styles.resultWrapperClosed} className="wrapper" in={this.state.resultUnwrap}>
                            {/* Divider */}
                            <Divider variant="middle" />

                            {/* Result table */}
                            <CardContent style={styles.resultContainer}>
                                <MaterialTable
                                    style={styles.resultTable}
                                    data={this.state.data}
                                    columns={[
                                        { title: 'Gid', field: 'gid', editable: 'never' },
                                        { title: 'Name', field: 'name' },
                                        { title: 'Pinyin', field: 'pinyin' },
                                        { title: 'Introduction', field: 'introduction' },
                                        {
                                            title: 'Image', field: 'image', render: rowData => (
                                                (rowData.image && rowData.image.src) &&
                                                <div className="preview-image-container">
                                                    <img id={rowData.gid} className={(rowData.image.longitude ? 'longitude-image' : 'latitude-image') + ' materialboxed'} src={rowData.image.src} alt="" />
                                                </div>
                                            )
                                        }
                                    ]}
                                    options={{
                                        actionsColumnIndex: -1,
                                        pageSize: 7,
                                        pageSizeOptions: [3, 5, 7, 9]
                                    }}
                                    actions={[
                                        {
                                            icon: () => <Icon color="action" fontSize="small">my_location</Icon>,
                                            tooltip: 'Diaplay on map',
                                            onClick: this.handlePreviewClick
                                        }
                                    ]}
                                    icons={{
                                        Edit: () => <Icon color="action" fontSize="small">edit</Icon>,
                                        Delete: () => <Icon color="action" fontSize="small">delete</Icon>,
                                        Check: () => <Icon color="action" fontSize="small">check</Icon>,
                                        Clear: () => <Icon color="action" fontSize="small" onClick={this.handleDoneEdit}>clear</Icon>
                                    }}
                                    components={{
                                        Toolbar: () => null,
                                        EditField: props => (
                                            props.columnDef.field === 'image' ?
                                                <label className="preview-image-container-edit">
                                                    <input style={styles.uploadBoxInput} type="file" accept="image/*" onChange={this.handleImageChange} />
                                                    <Tooltip title="Choose Image" aria-label="Choose Image">
                                                        {this.state.previewImage || (props.rowData.image && props.rowData.image.src) ?
                                                            <img className={(this.state.previewImage && this.state.previewImage.longitude) || (!this.state.previewImage && props.rowData.image.longitude) ? 'longitude-image' : 'latitude-image'} src={this.state.previewImage ? this.state.previewImage.src : props.rowData.image.src} alt="" /> :
                                                            <Icon className="upload-box-btn waves-effect" style={styles.uploadBoxBtnEdit}>create_new_folder</Icon>}
                                                    </Tooltip>
                                                </label> :
                                                <MTableEditField {...props} />
                                        )
                                    }}
                                    editable={{
                                        onRowUpdate: this.handleRowUpdate,
                                        onRowDelete: this.handleRowDelete
                                    }}
                                />
                            </CardContent>

                            {/* Wrap button */}
                            <Tooltip title="Wrap" aria-label="Wrap">
                                <IconButton className={this.state.resultUnwrap ? null : 'hidden'} style={styles.wrapBtn} aria-label="Wrap" onClick={this.handleWrapClick}>
                                    <Icon fontSize="inherit">keyboard_arrow_up</Icon>
                                </IconButton>
                            </Tooltip>
                        </Collapse>

                        {/* Add point panel wrapper */}
                        <Collapse style={this.state.addPointUnwrap ? styles.addPointWrapperOpen : styles.addPointWrapperClose} className="wrapper" in={this.state.addPointUnwrap}>
                            {/* Divider */}
                            <Divider variant="middle" />

                            {/* Form */}
                            <CardContent>
                                <Grid container spacing={3}>
                                    {/* Name, Pinyin, Image */}
                                    <Grid item xs={7}>
                                        <FormControl>
                                            <TextField id="name" style={styles.nameTextField} label="Name" />
                                            <TextField id="pinyin" style={styles.pinyinTextField} label="Pinyin" />
                                        </FormControl>
                                    </Grid>
                                    <Grid style={styles.previewImageContainer} item xs={5}>
                                        <label className="preview-image-container-add">
                                            <input style={styles.uploadBoxInput} type="file" accept="image/*" onChange={this.handleImageChange} />
                                            <Tooltip title="Choose Image" aria-label="Choose Image">
                                                {this.state.previewImage ?
                                                    <img className={this.state.previewImage.longitude ? 'longitude-image' : 'latitude-image'} src={this.state.previewImage.src} alt="" /> :
                                                    <Icon className="waves-effect" style={styles.uploadBoxBtnAdd}>create_new_folder</Icon>}
                                            </Tooltip>
                                        </label>
                                    </Grid>

                                    {/* Introduction */}
                                    <Grid item xs={12}>
                                        <TextField
                                            id="introduction"
                                            style={styles.introTextField}
                                            label="Introduction"
                                            variant="outlined"
                                            multiline
                                            rows={3}
                                            rowsMax={5}
                                        />
                                    </Grid>

                                    {/* Location */}
                                    <Grid style={styles.locationImageContainer} item xs={12}>
                                        <Tooltip title="Change Location" aria-label="Change Location">
                                            <img style={styles.locationImage} className="waves-effct" src={this.state.previewMapUrl} alt="" onClick={this.handlePreviewMapClick} />
                                        </Tooltip>
                                        <label style={styles.locationLabel}>Lng: {this.state.previewCoordinate.lng}&nbsp;&nbsp;Lat: {this.state.previewCoordinate.lat}</label>
                                    </Grid>
                                </Grid>
                            </CardContent>

                            {/* Actions */}
                            <CardContent style={styles.actions}>
                                <div style={styles.saveBtn}>
                                    <Button variant="contained" color="primary" disabled={this.state.submitting} onClick={this.handleSubmitClick}>SUBMIT</Button>
                                    {this.state.submitting && <CircularProgress style={styles.saveBtnProgress} size={24} />}
                                </div>
                                <Button color="primary" onClick={this.handleCancelClick}>CANCEL</Button>
                            </CardContent>
                        </Collapse>
                    </Card>
                </Slide>
            </MuiThemeProvider >
        );
    }
}

export default DataController;
