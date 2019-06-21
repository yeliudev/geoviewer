/* Written by Ye Liu */

import emitter from '@utils/events.utils';
import request from '@utils/request.utils';

const datasets = [
    {
        name: 'Chicago crimes',
        type: 'heatmap',
        url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson?$$app_token=HfTMb1j20uT2qH3kEGf20VQia&$limit=1000'
    },
    {
        name: 'Chicago taxi trips',
        type: 'heatmap',
        url: 'https://data.cityofchicago.org/resource/wrvz-psew.geojson?$$app_token=HfTMb1j20uT2qH3kEGf20VQia&$limit=1000'
    },
    {
        name: 'Global earthquake',
        type: 'circle',
        url: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
    },
    {
        name: 'Boundary',
        type: 'line',
        url: 'http://localhost:5757/api/getData'
    }
];

const loadDataset = (id) => {
    // Initiate request
    request({
        url: datasets[id].url,
        method: 'GET',
        successCallback: (res) => {
            // Save data
            datasets[id].data = res.data;

            emitter.emit('refreshDatasets', id);
            emitter.emit('showSnackbar', 'success', `Dataset '${datasets[id].name}' download succeed.`);
        },
        failedCallback: () => {
            emitter.emit('showSnackbar', 'error', `Dataset '${datasets[id].name}' download failed.`);
        }
    });
};

export { datasets, loadDataset };
