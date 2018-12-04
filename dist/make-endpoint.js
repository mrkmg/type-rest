"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var build_query_string_1 = require("./build-query-string");
var hooks_1 = require("./hooks");
var make_request_1 = require("./make-request");
function makeEndpoint(params) {
    switch (params.type) {
        case "DELETE":
        case "GET":
            return withoutBodyFunc(params);
        case "POST":
        case "PATCH":
        case "PUT":
            return withBodyFunc(params);
        default:
            throw new Error("Unknown Endpoint Type: " + params.type);
    }
}
exports.makeEndpoint = makeEndpoint;
function withoutBodyFunc(params) {
    var uri = params.current._uri;
    var type = params.type;
    var options = params.current._fullOptions;
    var func = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        switch (args.length) {
            case 0:
                return make_request_1.makeRequest(uri, type, options)
                    .then(hooks_1.buildHookRunner(params, null, null));
            case 1:
                return make_request_1.makeRequest(uri + "?" + build_query_string_1.buildQueryString(args[0]), type, options)
                    .then(hooks_1.buildHookRunner(params, args[0], null));
            default:
                return Promise.reject("Improper number of arguments for " + params.type + " call");
        }
    };
    func.raw = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        switch (args.length) {
            case 0:
                return make_request_1.makeRequest(uri, type, options, null, true);
            case 1:
                return make_request_1.makeRequest(uri + "?" + build_query_string_1.buildQueryString(args[0]), type, options, undefined, true);
            default:
                return Promise.reject("Improper number of arguments for " + params.type + " call");
        }
    };
    return func;
}
function withBodyFunc(params) {
    var uri = params.current._uri;
    var type = params.type;
    var options = params.current._fullOptions;
    var func = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        switch (args.length) {
            case 1:
                return make_request_1.makeRequest(uri, type, options, args[0])
                    .then(hooks_1.buildHookRunner(params, null, args[0]));
            case 2:
                return make_request_1.makeRequest(uri + "?" + build_query_string_1.buildQueryString(args[1]), type, options, args[0])
                    .then(hooks_1.buildHookRunner(params, args[1], args[0]));
            default:
                return Promise.reject("Improper number of arguments for " + type + " call");
        }
    };
    func.raw = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        switch (args.length) {
            case 1:
                return make_request_1.makeRequest(uri, type, options, args[0], true);
            case 2:
                return make_request_1.makeRequest(uri + "?" + build_query_string_1.buildQueryString(args[1]), type, options, args[0], true);
            default:
                return Promise.reject("Improper number of arguments for " + type + " call");
        }
    };
    return func;
}
