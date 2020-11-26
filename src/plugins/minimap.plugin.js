/* Written by Ye Liu */

import mapboxgl from 'mapbox-gl';

import { mapStyles } from '@utils/map.utils';

Minimap.prototype = Object.assign({}, mapboxgl.NavigationControl.prototype, {
    options: {
        style: Object.values(mapStyles)[0],
        center: [0, 0]
    },

    onAdd: function (parentMap) {
        this._container = this.createContainer(parentMap);
        this.parentMap = parentMap;

        this.miniMap = new mapboxgl.Map({
            attributionControl: false,
            container: this._container,
            style: this.options.style,
            center: this.options.center,
            zoom: 0
        });

        this.miniMap.on('load', this.load.bind(this));
        return this._container;
    },

    createContainer: function (parentMap) {
        const container = document.createElement('div');

        container.id = 'minimap';
        container.className = 'mapboxgl-ctrl mapboxgl-ctrl-minimap';
        container.addEventListener('contextmenu', this.preventDefault);

        parentMap.getContainer().appendChild(container);
        return container;
    },

    preventDefault: function (e) {
        e.preventDefault();
    },

    load: function () {
        this.zoomAdjust();

        ['dragPan', 'boxZoom', 'dragRotate', 'keyboard', 'doubleClickZoom', 'touchZoomRotate'].map(item => {
            this.miniMap[item].disable();
            return true;
        });

        const bounds = this.miniMap.getBounds();
        this.convertBoundsToPoints(bounds);

        this.miniMap.addSource('trackingRect', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': { 'name': 'trackingRect' },
                'geometry': { 'type': 'Polygon', 'coordinates': this.trackingRectCoordinates }
            }
        });

        this.miniMap.addLayer({
            'id': 'trackingRectOutline',
            'type': 'line',
            'source': 'trackingRect',
            'layout': {},
            'paint': { 'line-color': '#08F', 'line-width': 1, 'line-opacity': 1 }
        });

        this.miniMap.addLayer({
            'id': 'trackingRectFill',
            'type': 'fill',
            'source': 'trackingRect',
            'layout': {},
            'paint': { 'fill-color': '#08F', 'fill-opacity': 0.25 }
        });

        this.trackingRect = this.miniMap.getSource('trackingRect');

        this.parentMap.on('move', this.update.bind(this));
        this.parentMap.on('zoom', this.zoomAdjust.bind(this));

        this.miniMap.on('mousemove', this.mouseMove.bind(this));
        this.miniMap.on('mousedown', this.mouseDown.bind(this));
        this.miniMap.on('mouseup', this.mouseUp.bind(this));

        this.miniMap.on('touchmove', this.mouseMove.bind(this));
        this.miniMap.on('touchstart', this.mouseDown.bind(this));
        this.miniMap.on('touchend', this.mouseUp.bind(this));

        this.miniMapCanvas = this.miniMap.getCanvasContainer();
        this.miniMapCanvas.addEventListener('wheel', this.preventDefault);
        this.miniMapCanvas.addEventListener('mousewheel', this.preventDefault);

        this.update();
    },

    mouseDown: function (e) {
        if (this.cursorOverFeature) {
            this.dragging = true;
            this.previousPoint = this.currentPoint;
            this.currentPoint = [e.lngLat.lng, e.lngLat.lat];
        }
    },

    mouseUp: function () {
        this.dragging = false;
        this.ticking = false;
    },

    mouseMove: function (e) {
        this.ticking = false;

        const features = this.miniMap.queryRenderedFeatures(e.point, {
            layers: ['trackingRectFill']
        });

        if (!this.cursorOverFeature || features.length <= 0) {
            this.cursorOverFeature = features.length > 0;
            this.miniMapCanvas.style.cursor = this.cursorOverFeature ? 'move' : '';
        }

        if (this.dragging) {
            this.previousPoint = this.currentPoint;
            this.currentPoint = [e.lngLat.lng, e.lngLat.lat];

            const offset = [this.currentPoint[0] - this.previousPoint[0], this.currentPoint[1] - this.previousPoint[1]];
            const newBounds = this.moveTrackingRect(offset);

            newBounds._ne.lat = Math.max(Math.min(newBounds._ne.lat, Math.max(-90, 90)), Math.min(-90, 90));
            newBounds._sw.lat = Math.max(Math.min(newBounds._sw.lat, Math.max(-90, 90)), Math.min(-90, 90));

            this.parentMap.fitBounds(newBounds, {
                duration: 80,
                noMoveStart: true
            });
        }
    },

    moveTrackingRect: function (offset) {
        const bounds = this.trackingRect._data.properties.bounds;

        bounds._ne.lng += offset[0];
        bounds._ne.lat += offset[1];
        bounds._sw.lng += offset[0];
        bounds._sw.lat += offset[1];

        this.convertBoundsToPoints(bounds);
        this.trackingRect.setData(this.trackingRect._data);

        return bounds;
    },

    setTrackingRectBounds: function (bounds) {
        this.convertBoundsToPoints(bounds);
        this.trackingRect._data.properties.bounds = bounds;
        this.trackingRect.setData(this.trackingRect._data);
    },

    convertBoundsToPoints: function (bounds) {
        this.trackingRectCoordinates[0][0][0] = bounds._ne.lng;
        this.trackingRectCoordinates[0][0][1] = bounds._ne.lat;
        this.trackingRectCoordinates[0][1][0] = bounds._sw.lng;
        this.trackingRectCoordinates[0][1][1] = bounds._ne.lat;
        this.trackingRectCoordinates[0][2][0] = bounds._sw.lng;
        this.trackingRectCoordinates[0][2][1] = bounds._sw.lat;
        this.trackingRectCoordinates[0][3][0] = bounds._ne.lng;
        this.trackingRectCoordinates[0][3][1] = bounds._sw.lat;
        this.trackingRectCoordinates[0][4][0] = bounds._ne.lng;
        this.trackingRectCoordinates[0][4][1] = bounds._ne.lat;
    },

    update: function () {
        if (this.dragging) {
            return;
        }

        const parentBounds = this.parentMap.getBounds();
        this.setTrackingRectBounds(parentBounds);
    },

    zoomAdjust: function () {
        const parentZoom = parseInt(this.parentMap.getZoom());
        this.miniMap.flyTo({
            center: this.parentMap.getCenter(),
            zoom: parentZoom < 4 ? 0 : parentZoom - 3,
            bearing: 0
        });
    }
});

function Minimap(options) {
    Object.assign(this.options, options);
    this.ticking = false;
    this.lastMouseMoveEvent = null;
    this.parentMap = null;
    this.dragging = false;
    this.cursorOverFeature = false;
    this.previousPoint = [0, 0];
    this.currentPoint = [0, 0];
    this.trackingRectCoordinates = [[[], [], [], [], []]];
}

export default Minimap;
