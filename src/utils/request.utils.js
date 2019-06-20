/* Written by Ye Liu */

import emitter from '@utils/events.utils';

const parseUrl = (url, params) => {
    // Return if no parameters to be used
    if (!params) {
        return;
    }

    // Generate URL with parameters
    var arr = [];
    Object.keys(params).map(key => {
        arr.push(key + '=' + params[key]);
        return true;
    })

    return url + '?' + arr.join('&');
}

const request = (options) => {
    // Save parameters
    var url = options.method === 'POST' ? options.url : parseUrl(options.url, options.params);
    options.successCallback = options.successCallback || (() => { });
    options.finallyCallback = options.finallyCallback || (() => { });
    options.failedCallback = options.failedCallback || ((res) => emitter.emit('showSnackbar', 'error', res.errMsg));
    options.errorCallback = options.errorCallback || ((err) => emitter.emit('showSnackbar', 'error', err.toString()));

    // Fetch data
    fetch(url, {
        method: options.method,
        body: options.method === 'POST' ? JSON.stringify(options.params) : undefined
    })
        .then(req => req.json())
        .then(res => res.success ? options.successCallback(res) : options.failedCallback(res))
        .finally(options.finallyCallback)
        .catch(options.errorCallback);
}

export default request;
