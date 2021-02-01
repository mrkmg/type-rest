import {Index, ITypeRestOptions, UntypedTypeRestApi} from "./index";
import {IEndPointParams} from "./make-endpoint";

export async function runPreHooks<T>(params: IEndPointParams<T>, preEvent: IPreHookEvent<T>): Promise<void> {
    const matchingHooks = params.current._fullOptions.hooks.filter((hookDefinition: IHookDefinition<T>) => {
        if (hookDefinition.type === "post") {
            return false;
        }
        const isInvalidPath = hookDefinition.path && hookDefinition.path !== preEvent.path;
        const isInvalidMethod = hookDefinition.method && hookDefinition.method !== preEvent.method;
        return !(isInvalidPath || isInvalidMethod);
    }) as IPreHookDefinition<T>[];

    if (matchingHooks.length === 0) {
        return Promise.resolve();
    }

    for (const hook of matchingHooks) {
        await hook.hook(preEvent);
    }
}

export async function runPostHooks<T>(params: IEndPointParams<T>, postEvent: IPostHookEvent<T>): Promise<void> {
    const matchingHooks = params.current._fullOptions.hooks.filter((hookDefinition: IHookDefinition<T>) => {
        if (hookDefinition.type === "pre") {
            return false;
        }
        const isInvalidPath = hookDefinition.path && hookDefinition.path !== postEvent.path;
        const isInvalidMethod = hookDefinition.method && hookDefinition.method !== postEvent.method;
        return !(isInvalidPath || isInvalidMethod);
    }) as IPostHookDefinition<T>[];

    if (matchingHooks.length === 0) {
        return Promise.resolve();
    }

    for (const hook of matchingHooks) {
        await hook.hook(postEvent);
    }
}

export type IHookDefinition<
    T = UntypedTypeRestApi,
    RequestBody = unknown,
    RequestQuery = unknown,
    Response = unknown> =
        IPreHookDefinition<T, RequestBody, RequestQuery> |
        IPostHookDefinition<T, RequestBody, RequestQuery, Response>;

export interface IPreHookDefinition<T = UntypedTypeRestApi, RequestBody = unknown, RequestQuery = unknown> {
    type: "pre";
    hook: (event: IPreHookEvent<T, RequestBody, RequestQuery>) => Promise<void> | void;
    path?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export interface IPostHookDefinition<T = UntypedTypeRestApi, RequestBody = unknown, RequestQuery = unknown, Response = unknown> {
    type: "post";
    hook: (event: IPostHookEvent<T, RequestBody, RequestQuery, Response>) => Promise<void> | void;
    path?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export interface IPreHookEvent<T, RequestBody = unknown, RequestQuery = unknown> {
    instance: Index<T>;
    options: ITypeRestOptions<T>;
    path: string;
    requestBody: RequestBody;
    requestQuery: RequestQuery;
    uri: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export interface IPostHookEvent<T, RequestBody = unknown, RequestQuery = unknown, Response = unknown> {
    instance: Index<T>;
    options: ITypeRestOptions<T>;
    path: string;
    requestBody: RequestBody;
    requestQuery: RequestQuery;
    uri: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    response: Response;
}
