import {ITypeRestOptions} from "./index";
import {makeRequest} from "./make-request";
import {buildHookRunner} from "./hooks";
import {buildParams} from "./build-params";
import {ValidEndpoint} from "./make-proxy";

export function makeEndpoint<T>(rootPath: string, type: ValidEndpoint, path: string, options: ITypeRestOptions<T>) {
    switch (type) {
        case "DELETE":
        case "GET":
            return withoutBodyFunc(rootPath, type, path, options);
        case "POST":
        case "PATCH":
        case "PUT":
            return withBodyFunc(rootPath, type, path, options);
        default:
            throw new Error(`Unknown Endpoint Type: ${type}`);
    }
}

function withoutBodyFunc(rootPath: string, type: ValidEndpoint, path: string, options: ITypeRestOptions<any>) {
    const func: any = (...args: any[]) => {
        switch (args.length) {
            case 0:
                return makeRequest(rootPath + path, type, options)
                    .then(buildHookRunner(rootPath, path, type, null, null, options));
            case 1:
                return makeRequest(rootPath + path + "?" + buildParams(args[0]), type, options)
                    .then(buildHookRunner(rootPath, path, type, args[0], null, options));
            default:
                return Promise.reject(`Improper number of arguments for ${type} call`);
        }
    };

    func.raw = (...args: any[]) => {
        switch (args.length) {
            case 0:
                return makeRequest(rootPath + path, type, options, undefined, true);
            case 1:
                return makeRequest(rootPath + path + "?" + buildParams(args[0]), type, options, undefined, true);
            default:
                return Promise.reject(`Improper number of arguments for ${type} call`);
        }
    };

    return func;
}

function withBodyFunc(rootPath: string, type: ValidEndpoint, path: string, options: ITypeRestOptions<any>) {
    const func: any = (...args: any[]) => {
        switch (args.length) {
            case 1:
                return makeRequest(rootPath + path, type, options, args[0])
                    .then(buildHookRunner(rootPath, path, type, null, args[0], options));
            case 2:
                return makeRequest(rootPath + path + "?" + buildParams(args[1]), type, options, args[0])
                    .then(buildHookRunner(rootPath, path, type, args[1], args[0], options));
            default:
                return Promise.reject(`Improper number of arguments for ${type} call`);
        }
    };

    func.raw = (...args: any[]) => {
        switch (args.length) {
            case 1:
                return makeRequest(rootPath + path, type, options, args[0], true);
            case 2:
                return makeRequest(rootPath + path + "?" + buildParams(args[1]), type, options, args[0], true);
            default:
                return Promise.reject(`Improper number of arguments for ${type} call`);
        }
    };

    return func;
}
