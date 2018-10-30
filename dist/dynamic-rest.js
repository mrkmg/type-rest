"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var get_1 = require("./calls/get");
var post_1 = require("./calls/post");
var patch_1 = require("./calls/patch");
var delete_1 = require("./calls/delete");
var put_1 = require("./calls/put");
/**
 * Formats path from camelCase to dash-case e.g. testPath -> test-path
 * @param path
 */
function formatPath(path) {
    return path.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function dynamicRest(path, init) {
    if (typeof init === "undefined")
        init = {};
    return new Proxy({}, {
        get: function (target, name) {
            switch (name) {
                case "_initParams":
                    return init;
                case "Get":
                    return get_1.ApiGet(path, init);
                case "Post":
                    return post_1.ApiPost(path, init);
                case "Patch":
                    return patch_1.ApiPatch(path, init);
                case "Delete":
                    return delete_1.ApiDelete(path, init);
                case "Put":
                    return put_1.ApiPut(path, init);
                default:
                    var formattedName = formatPath(name);
                    return dynamicRest(path + "/" + formattedName, init);
            }
        },
    });
}
exports.dynamicRest = dynamicRest;
//# sourceMappingURL=dynamic-rest.js.map