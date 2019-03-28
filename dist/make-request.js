"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var build_query_string_1 = require("./build-query-string");
function makeRequest(preHookEvent) {
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
    return fetch(url, params);
}
exports.makeRequest = makeRequest;
