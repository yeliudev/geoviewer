/* Written by Ye Liu */

// Mapbox-GL library access token
const ACCESS_TOKEN = 'pk.eyJ1IjoieWxpdWRldiIsImEiOiJja2ZldGpkZTcwNDN4MnpvYThsbno3OGd0In0.7OiaH8u5zpRSF7tjly1l7A';

// Server host url
const API_ROOT = 'https://api.catcatdev.com/geoviewer';

// Service endpoints
const SERVICE = {
    // User login endpoint
    login: {
        url: `${API_ROOT}/login`,
        method: 'POST'
    },

    // User logout endpoint
    logout: {
        url: `${API_ROOT}/logout`,
        method: 'POST'
    },

    // Insert spatial object endpoint
    insert: {
        url: `${API_ROOT}/insert`,
        method: 'POST'
    },

    // Update spatial object endpoint
    update: {
        url: `${API_ROOT}/update`,
        method: 'POST'
    },

    // Delete spatial object endpoint
    delete: {
        url: `${API_ROOT}/delete`,
        method: 'POST'
    },

    // Dataset fetching endpoint
    dataset: {
        url: `${API_ROOT}/dataset`,
        method: 'GET'
    },

    // Spatial query endpoint
    search: {
        url: `${API_ROOT}/search`,
        method: 'GET'
    }
};

export { ACCESS_TOKEN, SERVICE };
