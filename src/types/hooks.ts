import {UntypedTypeRestApi} from "./untyped";
import {ITypeRestOptions} from "./options";
import {Index} from "./routes";

type HookMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type HookPath = RegExp | string | (string|number)[];

export enum HookType {
    Pre = "pre",
    Post = "post"
}

export type IHookDefinition<T = UntypedTypeRestApi,
    TRequestBody = unknown,
    TRequestQuery = unknown,
    TResponse = unknown> =
    IPreHookDefinition<T, TRequestBody, TRequestQuery> |
    IPostHookDefinition<T, TRequestBody, TRequestQuery, TResponse>;

export interface IPreHookDefinition<T = UntypedTypeRestApi, TRequestBody = unknown, TRequestQuery = unknown> {
    type: "pre" | HookType.Pre;
    hook: (event: IPreHookEvent<T, TRequestBody, TRequestQuery>) => Promise<void> | void;
    path?: HookPath;
    method?: HookMethod | HookMethod[];
}

export interface IPostHookDefinition<T = UntypedTypeRestApi, TRequestBody = unknown, TRequestQuery = unknown, TResponse = unknown> {
    type: "post" | HookType.Post;
    hook: (event: IPostHookEvent<T, TRequestBody, TRequestQuery, TResponse>) => Promise<void> | void;
    path?: HookPath;
    method?: HookMethod | HookMethod[];
}

export interface IPreHookEvent<T, TRequestBody = unknown, TRequestQuery = unknown> {
    instance: Index<T>;
    options: ITypeRestOptions<T>;
    path: string;
    requestBody: TRequestBody;
    requestQuery: TRequestQuery;
    uri: string;
    method: HookMethod;
}

export interface IPostHookEvent<T, TRequestBody = unknown, TRequestQuery = unknown, TResponse = unknown> {
    instance: Index<T>;
    options: ITypeRestOptions<T>;
    path: string;
    requestBody: TRequestBody;
    requestQuery: TRequestQuery;
    uri: string;
    method: HookMethod;
    response?: TResponse;
    rawResponse: Response
}