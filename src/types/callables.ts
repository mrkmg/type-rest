import {IPostHookDefinition, IPreHookDefinition} from "./hooks";

type AddHook<T, TBody, TQuery, TResponse> =
    ((hook: Omit<IPreHookDefinition<T, TBody, TQuery>, "path" | "method">) => void)
    & ((hook: Omit<IPostHookDefinition<T, TBody, TQuery, TResponse>, "path" | "method">) => void)
/**
 * Defines a request with no body and no query
 */
export type WithNone<TResponse> =
    (() => Promise<TResponse>)
    & { raw: WithNoneRaw, _addHook: AddHook<unknown, undefined, undefined, TResponse> };
/**
 * Defines a request with a body and no query
 */
export type WithBody<TBody, TResponse> =
    ((body: TBody) => Promise<TResponse>)
    & { raw: WithBodyRaw<TBody>, _addHook: AddHook<unknown, TBody, undefined, TResponse> };
/**
 * Defines a request with a body and no query
 */
export type WithQuery<TQuery, TResponse> =
    ((query: TQuery) => Promise<TResponse>)
    & { raw: WithQueryRaw<TQuery>, _addHook: AddHook<unknown, undefined, TQuery, TResponse> };
/**
 * Defines a request with a body and a query
 */
export type WithBodyAndQuery<TBody, TQuery, TResponse> =
    ((body: TBody, query: TQuery) => Promise<TResponse>)
    & { raw: WithBodyAndQueryRaw<TBody, TQuery>, _addHook: AddHook<unknown, TBody, TQuery, TResponse> };
/**
 * Defines a request with no body and optionally a query
 */
export type WithOptionalQuery<TQuery, TResponse> =
    WithNone<TResponse> & WithQuery<TQuery, TResponse>
    & { _addHook: AddHook<unknown, undefined, undefined & TQuery, TResponse>};
/**
 * Defines a request with a body and optionally a query
 */
export type WithBodyAndOptionalQuery<TBody, TQuery, TResponse> =
    WithBody<TBody, TResponse> & WithBodyAndQuery<TBody, TQuery, TResponse>
    & { _addHook: AddHook<unknown, TBody, undefined & TQuery, TResponse>};
/**
 * Defines a request with an optional body and an optional query.
 */
export type WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse> =
    WithNone<TResponse>
    & WithBody<TBody, TResponse>
    & WithBodyAndQuery<TBody, TQuery, TResponse>
    & { _addHook: AddHook<unknown, undefined & TBody, undefined & TQuery, TResponse>};

export type WithNoneRaw = () => Promise<Response>;
export type WithBodyRaw<TBody> = (body: TBody) => Promise<Response>;
export type WithQueryRaw<TQuery> = (query: TQuery) => Promise<Response>;
export type WithBodyAndQueryRaw<TBody, TQuery> = (body: TBody, query: TQuery) => Promise<Response>;