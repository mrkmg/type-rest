import {buildQueryString} from "./build-query-string";
import {IPreHookEvent} from "./hooks";
import {TypeRestDefaults} from "./type-rest";

export function makeRequest<T>(preHookEvent: IPreHookEvent<T>): Promise<Response> {
    const params: RequestInit = Object.assign({}, preHookEvent.options.params);

    let url = preHookEvent.uri;

    params.method = preHookEvent.method;
    if (preHookEvent.requestBody !== null) {
        params.body = JSON.stringify(preHookEvent.requestBody);
        params.headers["Content-Type"] = "application/json";
    }

    if (preHookEvent.requestQuery !== null) {
        url = url + "?" + buildQueryString(preHookEvent.requestQuery);
    }

    // tslint:disable-next-line
    params.headers["Accept"] = "application/json";

    return TypeRestDefaults.fetchImplementation(url, params);
}
