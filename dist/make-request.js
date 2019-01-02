"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var build_query_string_1 = require("./build-query-string");
function makeRequest(preHookEvent, raw) {
    var params = Object.assign({}, preHookEvent.options.params);
    var url = preHookEvent.uri;
    params.method = preHookEvent.method;
    if (preHookEvent.requestBody !== null) {
        params.body = JSON.stringify(preHookEvent.requestBody);
        params.headers["Content-Type"] = "application/json";
    }
    if (preHookEvent.requestQuery !== null) {
        url = url + "?" + build_query_string_1.buildQueryString(preHookEvent.requestQuery);
    }
    // tslint:disable-next-line
    params.headers["Accept"] = "application/json";
    if (raw) {
        return fetch(url, params);
    }
    else {
        return fetch(url, params).then(function (r) { return r.ok ? r.json() : Promise.reject(r); });
    }
}
exports.makeRequest = makeRequest;
