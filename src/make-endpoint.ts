import {buildQueryString} from "./build-query-string";
import {buildHookRunner} from "./hooks";
import {makeRequest} from "./make-request";
import {Index} from "./type-rest";

export type ValidEndpoint = "DELETE" | "GET" | "POST" | "PATCH" | "PUT";

export interface IEndPointParams<T> {
    current: Index<T>;
    type: ValidEndpoint;
}

export function makeEndpoint<T>(params: IEndPointParams<T>) {
    switch (params.type) {
        case "DELETE":
        case "GET":
            return withoutBodyFunc<T>(params);
        case "POST":
        case "PATCH":
        case "PUT":
            return withBodyFunc<T>(params);
        default:
            throw new Error(`Unknown Endpoint Type: ${params.type}`);
    }
}

function withoutBodyFunc<T>(params: IEndPointParams<T>) {
    const uri = params.current._uri;
    const type = params.type;
    const options = params.current._fullOptions;

    const func: any = (...args: any[]) => {
        switch (args.length) {
            case 0:
                return makeRequest(uri, type, options)
                    .then(buildHookRunner(params, null, null));
            case 1:
                return makeRequest(uri + "?" + buildQueryString(args[0]), type, options)
                    .then(buildHookRunner(params, args[0], null));
            default:
                return Promise.reject(`Improper number of arguments for ${params.type} call`);
        }
    };

    func.raw = (...args: any[]) => {
        switch (args.length) {
            case 0:
                return makeRequest(uri, type, options, null, true);
            case 1:
                return makeRequest(uri + "?" + buildQueryString(args[0]), type, options, undefined, true);
            default:
                return Promise.reject(`Improper number of arguments for ${params.type} call`);
        }
    };

    return func;
}

function withBodyFunc<T>(params: IEndPointParams<T>) {
    const uri = params.current._uri;
    const type = params.type;
    const options = params.current._fullOptions;

    const func: any = (...args: any[]) => {
        switch (args.length) {
            case 1:
                return makeRequest(uri, type, options, args[0])
                    .then(buildHookRunner(params, null, args[0]));
            case 2:
                return makeRequest( uri + "?" + buildQueryString(args[1]), type, options, args[0])
                    .then(buildHookRunner(params, args[1], args[0]));
            default:
                return Promise.reject(`Improper number of arguments for ${type} call`);
        }
    };

    func.raw = (...args: any[]) => {
        switch (args.length) {
            case 1:
                return makeRequest(uri, type, options, args[0], true);
            case 2:
                return makeRequest(uri + "?" + buildQueryString(args[1]), type, options, args[0], true);
            default:
                return Promise.reject(`Improper number of arguments for ${type} call`);
        }
    };

    return func;
}
