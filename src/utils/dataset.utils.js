/* Written by Ye Liu */

import M from 'materialize-css';

import emitter from '@utils/events.utils';

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

const loadDataset = (id, callback) => {
    // Check dataset availability
    if (datasets[id].data) {
        callback();
        return;
    }

    // Download dataset
    fetch(datasets[id].url)
        .then(req => req.json())
        .then(res => {
            if (res.success) {
                // Save data
                datasets[id].data = res.data;

                // Emit events
                emitter.emit('refreshDatasets', id);

                M.toast({ html: `Dataset '${datasets[id].name}' download succeed` });
            } else {
                M.toast({ html: `Dataset '${datasets[id].name}' download failed` });
            }
        });
};

export { datasets, loadDataset };
