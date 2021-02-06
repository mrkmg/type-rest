import {runPostHooks, runPreHooks} from "./hooks";
import {makeRequest} from "./make-request";
import {IHookDefinition} from "./types";
import {Index} from "./types";

export type ValidEndpoint = "DELETE" | "GET" | "POST" | "PATCH" | "PUT";

export interface IEndPointParams<T> {
    current: Index<T>;
    type: ValidEndpoint;
}

export function makeEndpoint<T>(params: IEndPointParams<T>): (...args: unknown[]) => Promise<unknown> {
    switch (params.type) {
    case "DELETE":
    case "GET":
        return withoutBodyFunc<T>(params);
    case "POST":
    case "PATCH":
    case "PUT":
        return withBodyFunc<T>(params);
    }
}

function withoutBodyFunc<T>(params: IEndPointParams<T>) {
    const func = async (...args: unknown[]) => {
        return runRequest(params, null, args.length >= 1 ? args[0] : null, false);
    };

    func.raw = (...args: unknown[]) => {
        return runRequest(params, null, args.length >= 1 ? args[0] : null, true);
    };

    func._addHook = (hook: Omit<IHookDefinition<T>, "path" | "method">) => {
        const path = params.current._fullPath;
        path.shift(); // remove root
        params.current._addHook(
            path.length === 0 ?
                Object.assign({}, hook) :
                Object.assign({}, hook, {
                    path,
                    method: params.type
                }));
    };

    return func;
}

function withBodyFunc<T>(params: IEndPointParams<T>) {
    const func = async (...args: unknown[]) => {
        return runRequest(params, args.length >= 1 ? args[0] : null, args.length >= 2 ? args[1] : null, false);
    };

    func.raw = (...args: unknown[]) => {
        return runRequest(params, args.length >= 1 ? args[0] : null, args.length >= 2 ? args[1] : null, true);
    };

    func._addHook = (hook: Omit<IHookDefinition<T>, "path" | "method">) => {
        const path = params.current._fullPath;
        path.shift(); // remove root
        params.current._addHook(
            path.length === 0 ?
                Object.assign({}, hook) :
                Object.assign({}, hook, {
                    path,
                    method: params.type
                }));
    };

    return func;
}

async function runRequest<T>(params: IEndPointParams<T>, body: unknown, query: unknown, raw: boolean) {
    const preHookEvent = {
        instance: params.current,
        method: params.type,
        options: params.current._resolvedOptions,
        path: params.current._encodedPath,
        requestBody: body,
        requestQuery: query,
        uri: params.current._uri,
    };

    if (!raw) {
        await runPreHooks(params, preHookEvent);
    }

    const rawResponse = await makeRequest(preHookEvent);

    if (raw) {
        return rawResponse;
    }

    if (rawResponse.ok) {
        const response = await preHookEvent.options.encoder.responseDecoder(rawResponse);
        const postHookEvent = {
            ...preHookEvent,
            rawResponse: rawResponse,
            response,
        };
        await runPostHooks(params, postHookEvent);
        return response;
    } else {
        const postHookEvent = {
            ...preHookEvent,
            rawResponse: rawResponse,
            response: null
        };
        await runPostHooks(params, postHookEvent);
        return Promise.reject(rawResponse);
    }
}
