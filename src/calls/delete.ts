import {makeRequest} from "../make-request";
import {buildParams} from "../build-params";
import {IDynamicRestInit} from "../types";

export function ApiDelete(path: string, init: IDynamicRestInit) {
    return (...args: any[]) => {
        switch (args.length) {
            case 0:
                return makeRequest(path, "DELETE", init);
            case 1:
                path = path + "?" + buildParams(args[0]);
                return makeRequest(path, "DELETE", init);
            default:
                return Promise.reject("Improper number of arguments for DELETE call");
        }
    };
}