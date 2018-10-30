import {makeRequest} from "../make-request";
import {buildParams} from "../build-params";
import {IDynamicRestInit} from "../types";

export function ApiPost(path: string, init: IDynamicRestInit) {
    return (...args: any[]) => {
        switch (args.length) {
            case 1:
                return makeRequest(path, "POST", init, args[0]);
            case 2:
                path = path + "?" + buildParams(args[0]);
                return makeRequest(path, "POST", init, args[1]);
            default:
                return Promise.reject("Improper number of arguments for POST call");
        }
    };
}