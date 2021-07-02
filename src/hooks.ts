import {Index, ITypeRestOptions, UntypedTypeRestApi} from "./index";
import {IEndPointParams} from "./make-endpoint";

type HookDefinition = Pick<IPreHookDefinition, "path" | "method">;
type EventDefinition = Pick<IPreHookEvent<unknown>, "path" | "method">;
function hookMatchesEvent(hookDefinition: HookDefinition, event: EventDefinition) {
    return (!hookDefinition.path || hookDefinition.path === event.path) &&
        (!hookDefinition.method || hookDefinition.method === event.method);
}

export async function runPreHooks<T>(params: IEndPointParams<T>, preEvent: IPreHookEvent<T>): Promise<void> {
    for (const hookDefinition of params.current._fullOptions.hooks) {
        if (hookDefinition.type !== "pre" || !hookMatchesEvent(hookDefinition, preEvent))
            continue;
        await hookDefinition.hook(preEvent);
    }
}

export async function runPostHooks<T>(params: IEndPointParams<T>, postEvent: IPostHookEvent<T>): Promise<void> {
    for (const hookDefinition of params.current._fullOptions.hooks) {
        if (hookDefinition.type !== "post" || !hookMatchesEvent(hookDefinition, postEvent))
            continue;
        await hookDefinition.hook(postEvent);
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
