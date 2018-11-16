import { ITypeRestOptions } from "./index";
import { ValidEndpoint } from "./make-proxy";
export declare function makeEndpoint<T>(rootPath: string, type: ValidEndpoint, path: string, options: ITypeRestOptions<T>): any;
