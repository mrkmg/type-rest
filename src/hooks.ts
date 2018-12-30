import {Index, ITypeRestOptions} from "./index";
import {IEndPointParams} from "./make-endpoint";

export async function runPreHooks<T>(params: IEndPointParams<T>, preEvent: IPreHookEvent<T>) {
    const matchingHooks = params.current._fullOptions.hooks.filter((hookDefinition: IHookDefinition<T>) => {
        if (hookDefinition.type === "post") {
            return false;
        }
        const isInvalidPath = hookDefinition.path && hookDefinition.path !== preEvent.path;
        const isInvalidMethod = hookDefinition.method && hookDefinition.method !== preEvent.method;
        return !(isInvalidPath || isInvalidMethod);
    }) as IPreHookDefinition[];

    if (matchingHooks.length === 0) {
        return Promise.resolve();
    }

    for (const hook of matchingHooks) {
        await hook.hook(preEvent);
    }
}

export async function runPostHooks<T>(params: IEndPointParams<T>, postEvent: IPostHookEvent<T>) {
    const matchingHooks = params.current._fullOptions.hooks.filter((hookDefinition: IHookDefinition<T>) => {
        if (hookDefinition.type === "pre") {
            return false;
        }
        const isInvalidPath = hookDefinition.path && hookDefinition.path !== postEvent.path;
        const isInvalidMethod = hookDefinition.method && hookDefinition.method !== postEvent.method;
        return !(isInvalidPath || isInvalidMethod);
    }) as IPostHookDefinition[];

    if (matchingHooks.length === 0) {
        return Promise.resolve();
    }

    for (const hook of matchingHooks) {
        await hook.hook(postEvent);
    }
}

export type IHookDefinition<T = any> = IPreHookDefinition<T> | IPostHookDefinition<T>;

export interface IPreHookDefinition<T = any> {
    type: "pre";
    hook: (event: IPreHookEvent<T>) => Promise<void> | void;
    path?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export interface IPostHookDefinition<T = any> {
    type: "post";
    hook: (event: IPostHookEvent<T>) => Promise<void> | void;
    path?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export interface IPreHookEvent<T> {
    instance: Index<T>;
    options: ITypeRestOptions<T>;
    path: string;
    requestBody: any;
    requestQuery: any;
    uri: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export interface IPostHookEvent<T> {
    instance: Index<T>;
    options: ITypeRestOptions<T>;
    path: string;
    requestBody: any;
    requestQuery: any;
    uri: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    response: any;
}
