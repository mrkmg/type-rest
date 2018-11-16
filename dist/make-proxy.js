"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var make_endpoint_1 = require("./make-endpoint");
function makeProxy(initialPath, path, options) {
    return new Proxy({}, {
        get: function (target, name) {
            switch (name) {
                case "_options":
                    return options;
                case "Get":
                    return make_endpoint_1.makeEndpoint(initialPath, "GET", path, options);
                case "Post":
                    return make_endpoint_1.makeEndpoint(initialPath, "POST", path, options);
                case "Patch":
                    return make_endpoint_1.makeEndpoint(initialPath, "PATCH", path, options);
                case "Delete":
                    return make_endpoint_1.makeEndpoint(initialPath, "DELETE", path, options);
                case "Put":
                    return make_endpoint_1.makeEndpoint(initialPath, "PUT", path, options);
                default:
                    var formattedName = formatPath(name);
                    return makeProxy(initialPath, "" + path + formattedName + "/", options);
            }
        },
    });
}
exports.makeProxy = makeProxy;
function formatPath(path) {
    return path.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
