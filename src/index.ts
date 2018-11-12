import {makeProxy} from "./make-endpoint";

export type Index<T> = T & {
    readonly _options: ITypeRestOptions<T>;
};

export function typeRest<T = UntypedTypeRestApi>(path: string, options?: Partial<ITypeRestOptions<T>>): Index<T> {
    if (typeof options === "undefined") {
        options = {};
    }

    if (typeof options.params === "undefined") {
        options.params = {};
    }

    if (typeof options.hooks === "undefined") {
        options.hooks = [];
    }

    options.params = Object.assign({
        cache: "default",
        credentials: "same-origin",
        headers: {},
        mode: "same-origin",
        redirect: "follow",
        referrer: "client",
    }, options.params);

    if (path[path.length - 1] !== "/") {
        path = path + "/";
    }

    return makeProxy<T>(path, "", options as ITypeRestOptions<T>);
}

export type WithNone<TResponse> = (() => Promise<TResponse>) & { raw: WithNoneRaw };
export type WithBody<TBody, TResponse> = ((body: TBody) => Promise<TResponse>) & { raw: WithBodyRaw<TBody> } ;
export type WithQuery<TQuery, TResponse> = ((query: TQuery) => Promise<TResponse>) & { raw: WithQueryRaw<TQuery> };
export type WithBodyAndQuery<TBody, TQuery, TResponse> =
    ((body: TBody, query: TQuery) => Promise<TResponse>) & { raw: WithBodyAndQueryRaw<TBody, TQuery> };

export type WithNoneRaw = () => Promise<Response>;
export type WithBodyRaw<TBody> = (body: TBody) => Promise<Response>;
export type WithQueryRaw<TQuery> = (query: TQuery) => Promise<Response>;
export type WithBodyAndQueryRaw<TBody, TQuery> = (body: TBody, query: TQuery) => Promise<Response>;

export type DeleteRoute = WithNone<any> & WithQuery<any, any>;
export type GetRoute = WithNone<any> & WithQuery<any, any>;
export type PostRoute = WithBody<any, any> & WithBodyAndQuery<any, any, any>;
export type PatchRoute = WithBody<any, any> & WithBodyAndQuery<any, any, any>;
export type PutRoute =  WithBody<any, any> & WithBodyAndQuery<any, any, any>;

export type AllowedInitKeys = "mode" | "cache" | "credentials" | "headers" | "redirect" | "referrer";

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

export interface ITypeRestOptions<T> {
    hooks: Array<IHook<T>>;
    params: Pick<RequestInit, AllowedInitKeys>;
}

export type UntypedTypeRestApi = ITypeRestIntermediary & ITypeRestEndpoints;

export interface ITypeRestIntermediary {
    [part: number]: UntypedTypeRestApi;
    [part: string]: UntypedTypeRestApi;
}

export interface ITypeRestEndpoints {
    Delete: DeleteRoute;
    Get: GetRoute;
    Post: PostRoute;
    Patch: PatchRoute;
    Put: PutRoute;
}
