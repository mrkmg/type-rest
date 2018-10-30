import {makeRequest} from "../make-request";
import {buildParams} from "../build-params";
import {IDynamicRestInit} from "../types";

export function ApiGet(path: string, init: IDynamicRestInit) {
    return (...args: any[]) => {
        switch (args.length) {
            case 0:
                return makeRequest(path, "GET", init);
            case 1:
                path = path + "?" + buildParams(args[0]);
                return makeRequest(path, "GET", init);
            default:
                return Promise.reject("Improper number of arguments for GET call");
        }
    };
}