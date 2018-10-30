"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var make_request_1 = require("../make-request");
var build_params_1 = require("../build-params");
function ApiPatch(path, init) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        switch (args.length) {
            case 1:
                return make_request_1.makeRequest(path, "PATCH", init, args[0]);
            case 2:
                path = path + "?" + build_params_1.buildParams(args[0]);
                return make_request_1.makeRequest(path, "PATCH", init, args[1]);
            default:
                return Promise.reject("Improper number of arguments for PATCH call");
        }
    };
}
exports.ApiPatch = ApiPatch;
//# sourceMappingURL=patch.js.map