/* Written by Ye Liu */

import { SERVICE } from '@config';

const datasets = {
    'Province Capitals': {
        type: 'heatmap',
        url: `${SERVICE.getDataset.url}?id=capitals`,
        method: 'GET'
    },
    'Chicago Crimes': {
        type: 'heatmap',
        url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson?$$app_token=HfTMb1j20uT2qH3kEGf20VQia&$limit=1000',
        method: 'GET'
    }
};

export default datasets;
