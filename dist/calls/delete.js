"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var make_request_1 = require("../make-request");
var build_params_1 = require("../build-params");
function ApiDelete(path, init) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        switch (args.length) {
            case 0:
                return make_request_1.makeRequest(path, "DELETE", init);
            case 1:
                path = path + "?" + build_params_1.buildParams(args[0]);
                return make_request_1.makeRequest(path, "DELETE", init);
            default:
                return Promise.reject("Improper number of arguments for DELETE call");
        }
    };
}
exports.ApiDelete = ApiDelete;
//# sourceMappingURL=delete.js.map