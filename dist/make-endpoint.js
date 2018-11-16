"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var make_request_1 = require("./make-request");
var hooks_1 = require("./hooks");
var build_params_1 = require("./build-params");
function makeEndpoint(rootPath, type, path, options) {
    switch (type) {
        case "DELETE":
        case "GET":
            return withoutBodyFunc(rootPath, type, path, options);
        case "POST":
        case "PATCH":
        case "PUT":
            return withBodyFunc(rootPath, type, path, options);
        default:
            throw new Error("Unknown Endpoint Type: " + type);
    }
}
exports.makeEndpoint = makeEndpoint;
function withoutBodyFunc(rootPath, type, path, options) {
    var func = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        switch (args.length) {
            case 0:
                return make_request_1.makeRequest(rootPath + path, type, options)
                    .then(hooks_1.buildHookRunner(rootPath, path, type, null, null, options));
            case 1:
                return make_request_1.makeRequest(rootPath + path + "?" + build_params_1.buildParams(args[0]), type, options)
                    .then(hooks_1.buildHookRunner(rootPath, path, type, args[0], null, options));
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
            case 0:
                return make_request_1.makeRequest(rootPath + path, type, options, undefined, true);
            case 1:
                return make_request_1.makeRequest(rootPath + path + "?" + build_params_1.buildParams(args[0]), type, options, undefined, true);
            default:
                return Promise.reject("Improper number of arguments for " + type + " call");
        }
    };
    return func;
}
function withBodyFunc(rootPath, type, path, options) {
    var func = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        switch (args.length) {
            case 1:
                return make_request_1.makeRequest(rootPath + path, type, options, args[0])
                    .then(hooks_1.buildHookRunner(rootPath, path, type, null, args[0], options));
            case 2:
                return make_request_1.makeRequest(rootPath + path + "?" + build_params_1.buildParams(args[1]), type, options, args[0])
                    .then(hooks_1.buildHookRunner(rootPath, path, type, args[1], args[0], options));
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
                return make_request_1.makeRequest(rootPath + path, type, options, args[0], true);
            case 2:
                return make_request_1.makeRequest(rootPath + path + "?" + build_params_1.buildParams(args[1]), type, options, args[0], true);
            default:
                return Promise.reject("Improper number of arguments for " + type + " call");
        }
    };
    return func;
}
