import {Index, ITypeRestOptions} from "./index";
import {buildParams} from "./build-params";
import {makeProxy, ValidEndpoint} from "./make-proxy";

export function buildHookRunner<T>(rootPath: string, path: string, type: ValidEndpoint, query: any, body: any,
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

export interface IHook<T = any> {
    path?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    hook: (event: IHookEvent<T>) => Promise<void> | void;
}

export interface IHookEvent<T> {
    rootPath: string;
    fullPath: string;
    path: string;
    requestQuery: any;
    requestBody: any;
    response: any;
    instance: Index<T>;
}