/* Written by Ye Liu */

import { SERVICE } from '@config';

const datasets = {
    'Chinese Capitals': {
        url: `${SERVICE.dataset.url}?id=capitals`,
        color: '#CC1E33'
    },
    'Chinese Cities': {
        url: `${SERVICE.dataset.url}?id=cities`,
        color: '#34BE39'
    },
    'Chinese Counties': {
        url: `${SERVICE.dataset.url}?id=counties`,
        color: '#EE9030'
    }
};

export default datasets;
