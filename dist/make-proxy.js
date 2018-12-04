"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mergeOptions = require("merge-options");
var make_endpoint_1 = require("./make-endpoint");
// Todo: Type target
function getHandler(target, name, current) {
    switch (name) {
        case "_root":
            if (current._parent) {
                return current._parent;
            }
            return current;
        case "_uri":
            if (!current._parent) {
                return current._path;
            }
            return "" + current._parent._uri + formatPath(current._path) + "/";
        case "_fullPath":
            if (!current._parent) {
                return "/";
            }
            return "" + current._parent._fullPath + formatPath(current._path) + "/";
        case "_fullOptions":
            if (!current._parent) {
                return mergeOptions.call({ concatArrays: true }, {}, current._options);
            }
            return mergeOptions.call({ concatArrays: true }, current._parent._fullOptions, current._options);
        case "Get":
        case "Post":
        case "Patch":
        case "Delete":
        case "Put":
            var endPointParams = {
                current: current,
                type: name.toUpperCase(),
            };
            return make_endpoint_1.makeEndpoint(endPointParams);
        default:
            if (target.hasOwnProperty(name)) {
                return target[name];
            }
            var proxy = makeProxy(current, name, { hooks: [], params: { headers: {} } });
            target[name] = proxy;
            return proxy;
    }
}
var proxyHandler = { get: getHandler };
function makeProxy(parent, path, options) {
    return new Proxy({
        _options: options,
        _parent: parent,
        _path: path,
    }, proxyHandler);
}
exports.makeProxy = makeProxy;
function formatPath(path) {
    return path.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
