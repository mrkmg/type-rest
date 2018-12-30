import { IPreHookEvent } from "./hooks";
export declare function makeRequest<T>(preHookEvent: IPreHookEvent<T>, raw?: boolean): Promise<any>;
