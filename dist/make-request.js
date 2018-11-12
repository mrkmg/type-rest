"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function makeRequest(url, method, options, body, raw) {
    var params = Object.assign({}, options.params);
    params.method = method;
    if (typeof body !== "undefined") {
        params.body = body;
    }
    if (raw) {
        return fetch(url, params);
    }
    else {
        return fetch(url, params).then(function (r) { return r.ok ? r.json() : Promise.reject(r); });
    }
}
exports.makeRequest = makeRequest;
