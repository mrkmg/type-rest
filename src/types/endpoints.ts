import {WithOptionalBodyAndOptionalQuery, WithOptionalQuery} from "./callables";

export type DeleteRoute<TQuery = unknown, TResponse = unknown> = WithOptionalQuery<TQuery, TResponse>;
export type GetRoute<TQuery = unknown, TResponse = unknown> = WithOptionalQuery<TQuery, TResponse>;
export type PostRoute<TBody = unknown, TQuery = unknown, TResponse = unknown> = WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse>;
export type PatchRoute<TBody = unknown, TQuery = unknown, TResponse = unknown> = WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse>;
export type PutRoute<TBody = unknown, TQuery = unknown, TResponse = unknown> = WithOptionalBodyAndOptionalQuery<TBody, TQuery, TResponse>;