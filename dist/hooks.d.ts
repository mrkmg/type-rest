import { Index, ITypeRestOptions } from "./index";
import { ValidEndpoint } from "./make-proxy";
export declare function buildHookRunner<T>(rootPath: string, path: string, type: ValidEndpoint, query: any, body: any, options: ITypeRestOptions<T>): (data: any) => Promise<any>;
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
