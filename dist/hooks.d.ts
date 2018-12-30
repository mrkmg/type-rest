import { Index, ITypeRestOptions } from "./index";
import { IEndPointParams } from "./make-endpoint";
export declare function runPreHooks<T>(params: IEndPointParams<T>, preEvent: IPreHookEvent<T>): Promise<void>;
export declare function runPostHooks<T>(params: IEndPointParams<T>, postEvent: IPostHookEvent<T>): Promise<void>;
export declare type IHookDefinition<T = any> = IPreHookDefinition<T> | IPostHookDefinition<T>;
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
