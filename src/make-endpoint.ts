import {IHook, IHookEvent, Index, ITypeRestOptions} from "./";
import {buildParams} from "./build-params";
import {makeRequest} from "./make-request";

export type ValidEndpoint = "DELETE" | "GET" | "POST" | "PATCH" | "PUT";

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

function formatPath(path: string) {
    return path.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function makeProxy<T>(initialPath: string, path: string, options: ITypeRestOptions<T>): Index<T> {
    return new Proxy({}, {
        get: (target, name: string) => {
            switch (name) {
                case "_options":
                    return options;
                case "Get":
                    return makeEndpoint(initialPath, "GET", path, options);
                case "Post":
                    return makeEndpoint(initialPath, "POST", path, options);
                case "Patch":
                    return makeEndpoint(initialPath, "PATCH", path, options);
                case "Delete":
                    return makeEndpoint(initialPath, "DELETE", path, options);
                case "Put":
                    return makeEndpoint(initialPath, "PUT", path, options);
                default:
                    const formattedName = formatPath(name);
                    return makeProxy(initialPath, `${path}${formattedName}/`, options);
            }
        },
    }) as Index<T>;
}

function buildHookRunner<T>(rootPath: string, path: string, type: ValidEndpoint, query: any, body: any,
                            options: ITypeRestOptions<T>) {
    return async (data: any) => {
        const matchingHooks = options.hooks.filter((hook: IHook) =>
            ! ( (hook.path && hook.path !== "/" + path) || (hook.method && hook.method !== type) ));

        const event: IHookEvent<T> = {
            fullPath: rootPath + path + (query ? "?" + buildParams(query) : ""),
            instance: makeProxy(rootPath, path, options),
            path: "/" + path,
            requestBody: body,
            requestQuery: query,
            response: data,
            rootPath,
        };

        for (const hook of matchingHooks) {
            await hook.hook(event);
        }

        return data;
    };
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
