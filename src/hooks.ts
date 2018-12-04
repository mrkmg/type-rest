import {buildQueryString} from "./build-query-string";
import {Index} from "./index";
import {IEndPointParams} from "./make-endpoint";

export function buildHookRunner<T>(params: IEndPointParams<T>, query: any, body: any) {
    const options = params.current._fullOptions;
    const path = params.current._fullPath;
    const uri = params.current._uri;
    const instance = params.current._root;
    const type = params.type;

    const matchingHooks = options.hooks.filter((hookDefinition: IHookDefinition) => {
            const isInvalidPath = hookDefinition.path && hookDefinition.path !== path;
            const isInvalidMethod = hookDefinition.method && hookDefinition.method !== type;
            return !(isInvalidPath || isInvalidMethod);
        },
    );

    if (matchingHooks.length === 0) {
        return (data: any) => Promise.resolve(data);
    }

    return async (data: any) => {
        const event: IHookEvent<T> = {
            uri: uri + (query ? "?" + buildQueryString(query) : ""),
            instance,
            path,
            requestBody: body,
            requestQuery: query,
            response: data,
        };

        for (const hook of matchingHooks) {
            await hook.hook(event);
        }

        return data;
    };
}

export interface IHookDefinition<T = any> {
    path?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    hook: (event: IHookEvent<T>) => Promise<void> | void;
}

export interface IHookEvent<T> {
    uri: string;
    path: string;
    requestQuery: any;
    requestBody: any;
    response: any;
    instance: Index<T>;
}
