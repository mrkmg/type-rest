import {UntypedTypeRestApi} from "./untyped";
import {Index, ITypeRestOptions} from "./type-rest";

type AddHook<T> = (hook: Omit<IHookDefinition<T>, "path" | "method">) => void;

/**
 * Defines a request with no body and no query
 */
export type WithNone<TResponse> = (() => Promise<TResponse>) & { raw: WithNoneRaw, _addHook: AddHook<TResponse> };

/**
 * Defines a request with a body and no query
 */
export type WithBody<TBody, TResponse> = ((body: TBody) => Promise<TResponse>) & { raw: WithBodyRaw<TBody>, _addHook: AddHook<TResponse> } ;

/**
 * Defines a request with a body and no query
 */
export type WithQuery<TQuery, TResponse> = ((query: TQuery) => Promise<TResponse>) & { raw: WithQueryRaw<TQuery>, _addHook: AddHook<TResponse> };

/**
 * Defines a request with a body and a query
 */
export type WithBodyAndQuery<TBody, TQuery, TResponse> =
    ((body: TBody, query: TQuery) => Promise<TResponse>) & { raw: WithBodyAndQueryRaw<TBody, TQuery>, _addHook: AddHook<TResponse> };

/**
 * Defines a request with no body and optionally a query
 */
export type WithOptionalQuery<TQuery, TResponse> = WithNone<TResponse> & WithQuery<TQuery, TResponse>;

/**
 * Defines a request with a body and optionally a query
 */
export type WithBodyAndOptionalQuery<TBody, TQuery, TResponse> = WithBody<TBody, TResponse> & WithBodyAndQuery<TBody, TQuery, TResponse>;

/**
 * Defines a request with an optional body and an optional query.
 */
export type WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse> = WithNone<TResponse> & WithBody<TBody, TResponse> & WithBodyAndQuery<TBody, TQuery, TResponse>;

export type WithNoneRaw = () => Promise<Response>;
export type WithBodyRaw<TBody> = (body: TBody) => Promise<Response>;
export type WithQueryRaw<TQuery> = (query: TQuery) => Promise<Response>;
export type WithBodyAndQueryRaw<TBody, TQuery> = (body: TBody, query: TQuery) => Promise<Response>;

export type DeleteRoute<TQuery = unknown, TResponse = unknown> = WithOptionalQuery<TQuery, TResponse>;
export type GetRoute<TQuery = unknown, TResponse = unknown> = WithOptionalQuery<TQuery, TResponse>;
export type PostRoute<TBody = unknown, TQuery = unknown, TResponse = unknown> = WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse>;
export type PatchRoute<TBody = unknown, TQuery = unknown, TResponse = unknown> = WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse>;
export type PutRoute<TBody = unknown, TQuery = unknown, TResponse = unknown> = WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse>;

type MergeBase<T, TT> = T & Omit<TT, keyof T>;

/**
 * Merges types together.
 *
 * Any conflicts in keys are resolved to the first instance of that key.
 */
export type Merge<T1, T2, T3 = void, T4 = void, T5 = void, T6 = void, T7 = void> =
    MergeBase<T1, MergeBase<T2, MergeBase<T3, MergeBase<T4, MergeBase<T5, MergeBase<T6, T7>>>>>>;


export type IHookDefinition<
    T = UntypedTypeRestApi,
    TRequestBody = unknown,
    TRequestQuery = unknown,
    TResponse = unknown> =
    IPreHookDefinition<T, TRequestBody, TRequestQuery> |
    IPostHookDefinition<T, TRequestBody, TRequestQuery, TResponse>;

export interface IPreHookDefinition<T = UntypedTypeRestApi, TRequestBody = unknown, TRequestQuery = unknown> {
    type: "pre";
    hook: (event: IPreHookEvent<T, TRequestBody, TRequestQuery>) => Promise<void> | void;
    path?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export interface IPostHookDefinition<T = UntypedTypeRestApi, TRequestBody = unknown, TRequestQuery = unknown, TResponse = unknown> {
    type: "post";
    hook: (event: IPostHookEvent<T, TRequestBody, TRequestQuery, TResponse>) => Promise<void> | void;
    path?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export interface IPreHookEvent<T, TRequestBody = unknown, TRequestQuery = unknown> {
    instance: Index<T>;
    options: ITypeRestOptions<T>;
    path: string;
    requestBody: TRequestBody;
    requestQuery: TRequestQuery;
    uri: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export interface IPostHookEvent<T, TRequestBody = unknown, TRequestQuery = unknown, TResponse = unknown> {
    instance: Index<T>;
    options: ITypeRestOptions<T>;
    path: string;
    requestBody: TRequestBody;
    requestQuery: TRequestQuery;
    uri: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    response: TResponse;
    rawResponse: Response
}
