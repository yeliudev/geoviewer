/* Written by Ye Liu */

import mapboxgl from 'mapbox-gl';

import { mapStyles } from '@utils/map.utils';

Minimap.prototype = Object.assign({}, mapboxgl.NavigationControl.prototype, {
    options: {
        style: mapStyles.Streets,
        center: [0, 0]
    },

    onAdd: function (parentMap) {
        this._container = this._createContainer(parentMap);
        this._parentMap = parentMap;

        this._miniMap = new mapboxgl.Map({
            attributionControl: false,
            container: this._container,
            style: this.options.style,
            center: this.options.center,
            zoom: 0
        });

        this._miniMap.on('load', this._load.bind(this));

        return this._container;
    },

    _createContainer: function (parentMap) {
        var container = document.createElement('div');

        container.id = 'minimap';
        container.className = 'mapboxgl-ctrl mapboxgl-ctrl-minimap';
        container.addEventListener('contextmenu', this._preventDefault);

        parentMap.getContainer().appendChild(container);

        return container;
    },

    _preventDefault: function (e) {
        e.preventDefault();
    },

    _load: function () {
        this._zoomAdjust();

        ['dragPan', 'boxZoom', 'dragRotate', 'keyboard', 'doubleClickZoom', 'touchZoomRotate'].map(item => {
            this._miniMap[item].disable();
            return true;
        });

        var bounds = this._miniMap.getBounds();
        this._convertBoundsToPoints(bounds);

        this._miniMap.addSource('trackingRect', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {
                    'name': 'trackingRect'
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': this._trackingRectCoordinates
                }
            }
        });

        this._miniMap.addLayer({
            'id': 'trackingRectOutline',
            'type': 'line',
            'source': 'trackingRect',
            'layout': {},
            'paint': {
                'line-color': '#08F',
                'line-width': 1,
                'line-opacity': 1
            }
        });

        this._miniMap.addLayer({
            'id': 'trackingRectFill',
            'type': 'fill',
            'source': 'trackingRect',
            'layout': {},
            'paint': {
                'fill-color': '#08F',
                'fill-opacity': 0.25
            }
        });

        this._trackingRect = this._miniMap.getSource('trackingRect');

        this._parentMap.on('move', this._update.bind(this));
        this._parentMap.on('zoom', this._zoomAdjust.bind(this));

        this._miniMap.on('mousemove', this._mouseMove.bind(this));
        this._miniMap.on('mousedown', this._mouseDown.bind(this));
        this._miniMap.on('mouseup', this._mouseUp.bind(this));

        this._miniMap.on('touchmove', this._mouseMove.bind(this));
        this._miniMap.on('touchstart', this._mouseDown.bind(this));
        this._miniMap.on('touchend', this._mouseUp.bind(this));

        this._miniMapCanvas = this._miniMap.getCanvasContainer();
        this._miniMapCanvas.addEventListener('wheel', this._preventDefault);
        this._miniMapCanvas.addEventListener('mousewheel', this._preventDefault);

        this._update();
    },

    _mouseDown: function (e) {
        if (this._isCursorOverFeature) {
            this._isDragging = true;
            this._previousPoint = this._currentPoint;
            this._currentPoint = [e.lngLat.lng, e.lngLat.lat];
        }
    },

    _mouseUp: function () {
        this._isDragging = false;
        this._ticking = false;
    },

    _mouseMove: function (e) {
        this._ticking = false;

        var features = this._miniMap.queryRenderedFeatures(e.point, {
            layers: ['trackingRectFill']
        });

        if (!this._isCursorOverFeature || features.length <= 0) {
            this._isCursorOverFeature = features.length > 0;
            this._miniMapCanvas.style.cursor = this._isCursorOverFeature ? 'move' : '';
        }

        if (this._isDragging) {
            this._previousPoint = this._currentPoint;
            this._currentPoint = [e.lngLat.lng, e.lngLat.lat];

            var offset = [this._currentPoint[0] - this._previousPoint[0], this._currentPoint[1] - this._previousPoint[1]];
            var newBounds = this._moveTrackingRect(offset);

            this._parentMap.fitBounds(newBounds, {
                duration: 80,
                noMoveStart: true
            });
        }
    },

    _moveTrackingRect: function (offset) {
        var bounds = this._trackingRect._data.properties.bounds;

        bounds._ne.lng += offset[0];
        bounds._ne.lat += offset[1];
        bounds._sw.lng += offset[0];
        bounds._sw.lat += offset[1];

        this._convertBoundsToPoints(bounds);
        this._trackingRect.setData(this._trackingRect._data);

        return bounds;
    },

    _setTrackingRectBounds: function (bounds) {
        this._convertBoundsToPoints(bounds);
        this._trackingRect._data.properties.bounds = bounds;
        this._trackingRect.setData(this._trackingRect._data);
    },

    _convertBoundsToPoints: function (bounds) {
        this._trackingRectCoordinates[0][0][0] = bounds._ne.lng;
        this._trackingRectCoordinates[0][0][1] = bounds._ne.lat;
        this._trackingRectCoordinates[0][1][0] = bounds._sw.lng;
        this._trackingRectCoordinates[0][1][1] = bounds._ne.lat;
        this._trackingRectCoordinates[0][2][0] = bounds._sw.lng;
        this._trackingRectCoordinates[0][2][1] = bounds._sw.lat;
        this._trackingRectCoordinates[0][3][0] = bounds._ne.lng;
        this._trackingRectCoordinates[0][3][1] = bounds._sw.lat;
        this._trackingRectCoordinates[0][4][0] = bounds._ne.lng;
        this._trackingRectCoordinates[0][4][1] = bounds._ne.lat;
    },

    _update: function () {
        if (this._isDragging) {
            return;
        }

        var parentBounds = this._parentMap.getBounds();
        this._setTrackingRectBounds(parentBounds);
    },

    _zoomAdjust: function () {
        var parentZoom = parseInt(this._parentMap.getZoom());
        this._miniMap.flyTo({
            center: this._parentMap.getCenter(),
            zoom: parentZoom < 4 ? 0 : parentZoom - 3,
            bearing: 0
        });
    }
});

function Minimap(options) {
    Object.assign(this.options, options);

    this._ticking = false;
    this._lastMouseMoveEvent = null;
    this._parentMap = null;
    this._isDragging = false;
    this._isCursorOverFeature = false;
    this._previousPoint = [0, 0];
    this._currentPoint = [0, 0];
    this._trackingRectCoordinates = [[[], [], [], [], []]];
}

export default Minimap;
