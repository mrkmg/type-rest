import { Index } from "./type-rest";
export declare type ValidEndpoint = "DELETE" | "GET" | "POST" | "PATCH" | "PUT";
export interface IEndPointParams<T> {
    current: Index<T>;
    type: ValidEndpoint;
}
export declare function makeEndpoint<T>(params: IEndPointParams<T>): {
    (...args: any[]): Promise<any>;
    raw(...args: any[]): Promise<any>;
};
