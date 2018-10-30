"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function makeRequest(url, method, init, body) {
    var params = Object.assign({
        method: method,
        body: body
    }, init);
    return fetch(url, params).then(function (r) { return r.ok ? r.json() : Promise.reject(r); });
}
exports.makeRequest = makeRequest;
//# sourceMappingURL=make-request.js.map