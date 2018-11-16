import { IHook, IHookEvent } from "./hooks";
export { IHook, IHookEvent };
export declare type Index<T> = T & {
    readonly _options: ITypeRestOptions<T>;
};
export declare function typeRest<T = UntypedTypeRestApi>(path: string, options?: Partial<ITypeRestOptions<T>>): Index<T>;
export declare type WithNone<TResponse> = (() => Promise<TResponse>) & {
    raw: WithNoneRaw;
};
export declare type WithBody<TBody, TResponse> = ((body: TBody) => Promise<TResponse>) & {
    raw: WithBodyRaw<TBody>;
};
export declare type WithQuery<TQuery, TResponse> = ((query: TQuery) => Promise<TResponse>) & {
    raw: WithQueryRaw<TQuery>;
};
export declare type WithBodyAndQuery<TBody, TQuery, TResponse> = ((body: TBody, query: TQuery) => Promise<TResponse>) & {
    raw: WithBodyAndQueryRaw<TBody, TQuery>;
};
export declare type WithNoneRaw = () => Promise<Response>;
export declare type WithBodyRaw<TBody> = (body: TBody) => Promise<Response>;
export declare type WithQueryRaw<TQuery> = (query: TQuery) => Promise<Response>;
export declare type WithBodyAndQueryRaw<TBody, TQuery> = (body: TBody, query: TQuery) => Promise<Response>;
export declare type DeleteRoute = WithNone<any> & WithQuery<any, any>;
export declare type GetRoute = WithNone<any> & WithQuery<any, any>;
export declare type PostRoute = WithBody<any, any> & WithBodyAndQuery<any, any, any>;
export declare type PatchRoute = WithBody<any, any> & WithBodyAndQuery<any, any, any>;
export declare type PutRoute = WithBody<any, any> & WithBodyAndQuery<any, any, any>;
export declare type AllowedInitKeys = "mode" | "cache" | "credentials" | "headers" | "redirect" | "referrer";
export interface ITypeRestOptions<T> {
    hooks: Array<IHook<T>>;
    params: Pick<RequestInit, AllowedInitKeys>;
}
export declare type UntypedTypeRestApi = ITypeRestIntermediary & ITypeRestEndpoints;
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
