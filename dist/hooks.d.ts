import { Index } from "./index";
import { IEndPointParams } from "./make-endpoint";
export declare function buildHookRunner<T>(params: IEndPointParams<T>, query: any, body: any): (data: any) => Promise<any>;
export interface IHookDefinition<T = any> {
    path?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    hook: (event: IHookEvent<T>) => Promise<void> | void;
}
export interface IHookEvent<T> {
    uri: string;
    path: string;
    requestQuery: any;
    requestBody: any;
    response: any;
    instance: Index<T>;
}
