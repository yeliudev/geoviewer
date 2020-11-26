/* Written by Ye Liu */

import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import Minimap from '@plugins/minimap.plugin';
import geocoder from '@plugins/geocoder.plugin';
import marker from '@plugins/marker.plugin';

import emitter from '@utils/events.utils';
import { mapStyles, buildHeatmapStyle } from '@utils/map.utils';
import { ACCESS_TOKEN } from '@config';
import '@styles/map.style.css';

const styles = {
    root: {
        width: '100%',
        position: 'fixed',
        top: 64,
        bottom: 0
    }
};

class Canvas extends React.Component {
    state = {
        map: null,
        draw: null,
        minimap: null,
        popup: null,
        gettingPoint: null,
        tempId: null,
        styleCode: Object.values(mapStyles)[0].substring(16)
    }

    removeTempLayer = () => {
        // Remove layers
        const layers = this.state.map.getStyle().layers;
        layers.map(layer => {
            if (layer.id === 'custom-temp-point') {
                this.state.map.removeLayer('custom-temp-point');
                this.state.map.removeSource('custom-temp-point');
            }
            return true;
        });

        // Remove popup
        if (this.state.popup.isOpen()) {
            this.state.popup.remove();
        }
    }

    removeTempPoint = () => {
        this.state.draw.delete(this.state.tempId);
        this.setState({
            tempId: null
        });
    }

    componentDidMount() {
        // Verify access token
        mapboxgl.accessToken = ACCESS_TOKEN;

        // Check for browser support
        if (!mapboxgl.supported()) {
            alert('Your browser does not support Mapbox GL');
            return;
        }

        // Initialize map object
        const map = new mapboxgl.Map({
            container: 'map',
            style: Object.values(mapStyles)[0],
            center: [103.000, 35.000],
            zoom: 3,
            antialias: true
        });

        // Initialize map draw plugin
        const draw = new MapboxDraw({
            controls: {
                combine_features: false,
                uncombine_features: false
            }
        });

        // Add map controls
        const minimap = new Minimap({
            center: map.getCenter()
        });

        map.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            localGeocoder: geocoder,
            placeholder: 'Search Address',
            marker: {
                color: 'red'
            }
        }), 'top-left');
        map.addControl(new mapboxgl.NavigationControl(), 'top-left');
        map.addControl(new mapboxgl.GeolocateControl(), 'top-left');
        map.addControl(new MapboxTraffic({
            trafficSource: new RegExp('/*/')
        }), 'top-left');
        map.addControl(draw, 'top-left');
        map.addControl(minimap, 'bottom-left');

        // Initialize popup
        const popup = new mapboxgl.Popup({
            closeButton: false,
            anchor: 'bottom'
        }).setHTML('<div id="popup-container"></div>');

        // Cover search box style
        document.getElementsByClassName('mapboxgl-ctrl-geocoder--input')[0].setAttribute('type', 'search-box');

        // Bind event listeners
        map.on('load', () => {
            // Hide loader
            document.getElementById('loader-wrapper').classList.add('loaded');
        });

        map.on('draw.create', e => {
            if (!this.state.gettingPoint) {
                return;
            }

            // Save temp id
            this.setState({
                tempId: e.features[0].id
            });

            // Set point
            emitter.emit('setPoint', e.features[0], this.state.styleCode, this.state.map.getZoom());

            // Reset state
            this.setState({
                gettingPoint: false
            })
        });

        this.setMapStyleListener = emitter.addListener('setMapStyle', e => {
            // Remove last popup
            if (this.state.popup.isOpen()) {
                this.state.popup.remove();
            }

            // Set main map style
            this.state.map.setStyle(mapStyles[e]);

            // Set minimap style
            const minimap = new Minimap({
                center: this.state.map.getCenter(),
                style: mapStyles[e]
            });
            this.state.map.removeControl(this.state.minimap);
            this.state.map.addControl(minimap, 'bottom-left');

            this.setState({
                minimap: minimap,
                styleCode: mapStyles[e].substring(16)
            });
        });

        this.displayDatasetListener = emitter.addListener('displayDataset', (id, geometry, color) => {
            // Remove last data source
            if (this.state.map.getSource(id)) {
                this.state.map.removeSource(id);
            }

            // Add new data source
            this.state.map.addSource(id, {
                'type': 'geojson',
                'data': geometry
            });

            // Add layer
            this.state.map.addLayer({
                'id': id,
                'type': 'heatmap',
                'source': id,
                'paint': buildHeatmapStyle(color)
            });
        });

        this.removeDatasetListener = emitter.addListener('removeDataset', e => {
            // Return if layer not found
            if (!this.state.map.getLayer(e)) {
                return;
            }

            // Remove layer and data source
            this.state.map.removeLayer(e);
            this.state.map.removeSource(e);
        });

        this.moveLayerListener = emitter.addListener('moveLayer', (id, beforeId) => {
            // Move layer
            if (beforeId) {
                this.state.map.moveLayer(id, beforeId);
            } else {
                this.state.map.moveLayer(id);
            }
        });

        this.displayTempLayerListener = emitter.addListener('displayTempLayer', e => {
            // Remove previews temp layer
            this.removeTempLayer();

            // Add rendering resource
            if (!this.state.map.hasImage('marker')) {
                this.state.map.addImage('marker', marker, { pixelRatio: 3 });
            }

            // Add point layer on map
            this.state.map.addLayer({
                id: 'custom-temp-point',
                type: 'symbol',
                source: {
                    type: 'geojson',
                    data: e.geometry
                },
                layout: {
                    'icon-image': 'marker'
                }
            });

            // Add popup on map
            this.state.popup.setLngLat(e.geometry.geometry.coordinates).addTo(this.state.map);
            emitter.emit('bindPopup', e);

            // Fly to the point
            this.state.map.flyTo({
                center: e.geometry.geometry.coordinates,
                zoom: 6,
                bearing: 0
            });
        });

        this.removeTempLayerListener = emitter.addListener('removeTempLayer', () => {
            // Remove temp layer
            this.removeTempLayer();
        });

        this.getPointListener = emitter.addListener('getPoint', () => {
            // Remove temp point
            this.removeTempPoint();

            // Active draw_point mode
            this.state.draw.changeMode('draw_point');
            emitter.emit('showSnackbar', 'default', 'Click on the map to select a point.');
            this.setState({
                gettingPoint: true
            })
        });

        this.removeTempPointListener = emitter.addListener('removeTempPoint', () => {
            // Remove temp point
            this.removeTempPoint();
        });

        // Set state
        this.setState({
            map: map,
            draw: draw,
            minimap: minimap,
            popup: popup
        });
    }

    componentWillUnmount() {
        // Remove event listeners
        emitter.removeListener(this.setMapStyleListener);
        emitter.removeListener(this.displayDatasetListener);
        emitter.removeListener(this.removeDatasetListener);
        emitter.removeListener(this.moveLayerListener);
        emitter.removeListener(this.displayTempLayerListener);
        emitter.removeListener(this.removeTempLayerListener);
        emitter.removeListener(this.getPointListener);
        emitter.removeListener(this.removeTempPointListener);
    }


    render() {
        return (
            <div id="map" style={styles.root}></div>
        );
    }
}

export default Canvas;
