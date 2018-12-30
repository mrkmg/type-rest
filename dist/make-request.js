"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var build_query_string_1 = require("./build-query-string");
function makeRequest(preHookEvent, raw) {
    var params = Object.assign({}, preHookEvent.options.params);
    var url = preHookEvent.uri;
    params.method = preHookEvent.method;
    if (preHookEvent.requestBody !== null) {
        params.body = preHookEvent.requestBody;
    }
    if (preHookEvent.requestQuery !== null) {
        url = url + "?" + build_query_string_1.buildQueryString(preHookEvent.requestQuery);
    }
    if (raw) {
        return fetch(url, params);
    }
    else {
        return fetch(url, params).then(function (r) { return r.ok ? r.json() : Promise.reject(r); });
    }
}
exports.makeRequest = makeRequest;
