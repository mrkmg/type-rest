import {buildQueryString} from "./build-query-string";
import {IPreHookEvent} from "./hooks";

export function makeRequest<T>(preHookEvent: IPreHookEvent<T>) {
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

    return fetch(url, params);
}
