import {IHookDefinition} from "./hooks";

/**
 * All valid path styles
 *
 * (examples for the input of testPath)
 * * lowerCase -> convert path to all lower case letters (TESTPATH)
 * * upperCase -> covert path to all upper case letters (testpath)
 * * dashed -> convert path to dashed (test-path)
 * * snakeCase -> convert path to snake case (test_path)
 * * none -> do not modify path (testPath)
 *
 * or a function which takes in an array of path parts and returns the string representation of those parts.
 */
export type ValidPathStyles =
    "lowerCased"
    | "upperCased"
    | "dashed"
    | "snakeCase"
    | "none"
    | ((pathParts: string[]) => string);
type DisallowedRequestInitKeys = "body" | "query" | "method";
// This is a work-around for headers being a stupid type in RequestInit.
export type ITypeRestParams = Omit<RequestInit, DisallowedRequestInitKeys> & { headers?: Record<string, string> };

export interface IRequestEncoder<TRequest = unknown, TResponse = unknown> {
    requestContentType: string;
    requestAcceptType: string;
    requestEncoder: (data: TRequest) => Promise<BodyInit>;
    responseDecoder: (response: Response) => Promise<TResponse>;
}

export interface ITypeRestOptions<T> {
    hooks: Array<IHookDefinition<T>>;
    params: ITypeRestParams;
    pathStyle: ValidPathStyles;
    encoder: Readonly<IRequestEncoder>;
    trailingSlash: boolean;
    fetch: typeof fetch;
}

export type ITypeRestOptionsInit<T> = Partial<ITypeRestOptions<T>>;