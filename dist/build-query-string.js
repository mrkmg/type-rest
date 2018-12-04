"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildQueryString(obj) {
    var queryStringOptions = [];
    var solve = function (v) {
        while (typeof v === "function") {
            v = v();
        }
        if (v === null || v === undefined) {
            v = "";
        }
        return encodeURIComponent(v);
    };
    var add = function (k, v) {
        v = solve(v);
        if (v === "") {
            queryStringOptions.push(k);
        }
        else {
            queryStringOptions.push(k + "=" + v);
        }
    };
    var makeParams = function (prefix, innerObj) {
        if (typeof innerObj === "object") {
            for (var key in innerObj) {
                if (innerObj.hasOwnProperty(key)) {
                    var encodedKey = solve(key);
                    makeParams(prefix === "" ? encodedKey : prefix + "[" + encodedKey + "]", innerObj[key]);
                }
            }
        }
        else if (prefix !== "") {
            add(prefix, innerObj);
        }
        else {
            add(solve(innerObj), null);
        }
    };
    makeParams("", obj);
    return queryStringOptions.join("&");
}
exports.buildQueryString = buildQueryString;
