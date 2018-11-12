import { Index, ITypeRestOptions } from "./";
export declare type ValidEndpoint = "DELETE" | "GET" | "POST" | "PATCH" | "PUT";
export declare function makeEndpoint<T>(rootPath: string, type: ValidEndpoint, path: string, options: ITypeRestOptions<T>): any;
export declare function makeProxy<T>(initialPath: string, path: string, options: ITypeRestOptions<T>): Index<T>;
