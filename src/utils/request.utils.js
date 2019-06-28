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
    var url = options.method === 'GET' && options.params ? parseUrl(options.url, options.params) : options.url;
    options.successCallback = options.successCallback || (() => { });
    options.finallyCallback = options.finallyCallback || (() => { });
    options.errorCallback = options.errorCallback || ((err) => emitter.emit('showSnackbar', 'error', err.toString()));
    options.failedCallback = options.failedCallback || ((res) => {
        if (res.authError) {
            emitter.emit('login');
            emitter.emit('setLoginState', false);
        }
        emitter.emit('showSnackbar', 'error', res.errMsg);
    });

    // Fetch data
    fetch(url, {
        method: options.method,
        body: options.method === 'POST' ? JSON.stringify(options.params) : undefined,
        credentials: options.credentials || 'include'
    })
        .then(req => req.json())
        .then(res => res.hasOwnProperty('success') && !res.success ? options.failedCallback(res) : options.successCallback(res))
        .finally(options.finallyCallback)
        .catch(options.errorCallback);
}

export default request;
