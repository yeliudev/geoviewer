/* Written by Ye Liu */

const coordinate = (lng, lat) => {
    return {
        type: 'Feature',
        properties: {},
        place_name: 'Lat: ' + lat + ' Lng: ' + lng,
        place_type: ['coordinate'],
        center: [lng, lat],
        geometry: {
            type: 'Point',
            coordinates: [lng, lat]
        }
    };
};

const geocoder = (query) => {
    const matches = query.match(/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i);
    if (!matches) {
        return null;
    }

    const coord1 = Number(matches[1]);
    const coord2 = Number(matches[2]);
    const geocodes = [];

    if (coord1 < -90 || coord1 > 90) {
        geocodes.push(coordinate(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
        geocodes.push(coordinate(coord2, coord1));
    }

    if (geocodes.length === 0) {
        geocodes.push(coordinate(coord1, coord2));
        geocodes.push(coordinate(coord2, coord1));
    }

    return geocodes;
};

export default geocoder;
