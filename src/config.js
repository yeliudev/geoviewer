/* Written by Ye Liu */

// Mapbox-GL library access token
const ACCESS_TOKEN = 'pk.eyJ1IjoieWxpdWRldiIsImEiOiJja2ZldGpkZTcwNDN4MnpvYThsbno3OGd0In0.7OiaH8u5zpRSF7tjly1l7A';

// Server host url
const API_ROOT = 'https://api.catcatserver.xyz/geoviewer';

const SERVICE = {
    // User login interface
    login: {
        url: `${API_ROOT}/login`,
        method: 'POST'
    },

    // User logout interface
    logout: {
        url: `${API_ROOT}/logout`,
        method: 'POST'
    },

    // Insert spatial object interface
    insert: {
        url: `${API_ROOT}/insert`,
        method: 'POST'
    },

    // Update spatial object interface
    update: {
        url: `${API_ROOT}/update`,
        method: 'POST'
    },

    // Delete spatial object interface
    delete: {
        url: `${API_ROOT}/delete`,
        method: 'POST'
    },

    // Dataset fetching interface
    dataset: {
        url: `${API_ROOT}/dataset`,
        method: 'GET'
    },

    // Spatial query interface
    search: {
        url: `${API_ROOT}/search`,
        method: 'GET'
    }
};

export { ACCESS_TOKEN, SERVICE };
