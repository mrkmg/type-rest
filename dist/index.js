"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var make_proxy_1 = require("./make-proxy");
function typeRest(path, options) {
    if (typeof options === "undefined") {
        options = {};
    }
    if (typeof options.params === "undefined") {
        options.params = {};
    }
    if (typeof options.hooks === "undefined") {
        options.hooks = [];
    }
    options.params = Object.assign({
        cache: "default",
        credentials: "same-origin",
        headers: {},
        mode: "same-origin",
        redirect: "follow",
        referrer: "client",
    }, options.params);
    if (path[path.length - 1] !== "/") {
        path = path + "/";
    }
    return make_proxy_1.makeProxy(path, "", options);
}
exports.typeRest = typeRest;
