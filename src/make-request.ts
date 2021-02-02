import {buildQueryString} from "./build-query-string";
import {IPreHookEvent} from "./hooks";
import {TypeRestDefaults} from "./type-rest";

export async function makeRequest<T>(preHookEvent: IPreHookEvent<T>): Promise<Response> {
    const params: RequestInit = Object.assign({}, preHookEvent.options.params);

    let url = preHookEvent.uri;

    params.method = preHookEvent.method;
    if (preHookEvent.requestBody !== null) {
        params.body = await preHookEvent.options.encoder.requestEncoder(preHookEvent.requestBody);
        params.headers["Content-Type"] = preHookEvent.options.encoder.requestContentType;
    }

    if (preHookEvent.requestQuery !== null) {
        url = url + "?" + buildQueryString(preHookEvent.requestQuery);
    }

    // tslint:disable-next-line
    params.headers["Accept"] = preHookEvent.options.encoder.requestAcceptType;

    return TypeRestDefaults.fetchImplementation(url, params);
}
