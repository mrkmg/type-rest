"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var build_params_1 = require("./build-params");
var make_request_1 = require("./make-request");
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
function formatPath(path) {
    return path.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function makeProxy(initialPath, path, options) {
    return new Proxy({}, {
        get: function (target, name) {
            switch (name) {
                case "_options":
                    return options;
                case "Get":
                    return makeEndpoint(initialPath, "GET", path, options);
                case "Post":
                    return makeEndpoint(initialPath, "POST", path, options);
                case "Patch":
                    return makeEndpoint(initialPath, "PATCH", path, options);
                case "Delete":
                    return makeEndpoint(initialPath, "DELETE", path, options);
                case "Put":
                    return makeEndpoint(initialPath, "PUT", path, options);
                default:
                    var formattedName = formatPath(name);
                    return makeProxy(initialPath, "" + path + formattedName + "/", options);
            }
        },
    });
}
exports.makeProxy = makeProxy;
function buildHookRunner(rootPath, path, type, query, body, options) {
    var _this = this;
    return function (data) { return __awaiter(_this, void 0, void 0, function () {
        var matchingHooks, event, _i, matchingHooks_1, hook;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    matchingHooks = options.hooks.filter(function (hook) {
                        return !((hook.path && hook.path !== "/" + path) || (hook.method && hook.method !== type));
                    });
                    event = {
                        fullPath: rootPath + path + (query ? "?" + build_params_1.buildParams(query) : ""),
                        instance: makeProxy(rootPath, path, options),
                        path: "/" + path,
                        requestBody: body,
                        requestQuery: query,
                        response: data,
                        rootPath: rootPath,
                    };
                    _i = 0, matchingHooks_1 = matchingHooks;
                    _a.label = 1;
                case 1:
                    if (!(_i < matchingHooks_1.length)) return [3 /*break*/, 4];
                    hook = matchingHooks_1[_i];
                    return [4 /*yield*/, hook.hook(event)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, data];
            }
        });
    }); };
}
function withoutBodyFunc(rootPath, type, path, options) {
    var func = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        switch (args.length) {
            case 0:
                return make_request_1.makeRequest(rootPath + path, type, options)
                    .then(buildHookRunner(rootPath, path, type, null, null, options));
            case 1:
                return make_request_1.makeRequest(rootPath + path + "?" + build_params_1.buildParams(args[0]), type, options)
                    .then(buildHookRunner(rootPath, path, type, args[0], null, options));
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
                    .then(buildHookRunner(rootPath, path, type, null, args[0], options));
            case 2:
                return make_request_1.makeRequest(rootPath + path + "?" + build_params_1.buildParams(args[1]), type, options, args[0])
                    .then(buildHookRunner(rootPath, path, type, args[1], args[0], options));
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
