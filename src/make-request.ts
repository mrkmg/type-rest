import {buildQueryString} from "./build-query-string";
import {IPreHookEvent} from "./hooks";

export function makeRequest<T>(preHookEvent: IPreHookEvent<T>, raw?: boolean) {
    const params: RequestInit = Object.assign({}, preHookEvent.options.params);

    let url = preHookEvent.uri;

    params.method = preHookEvent.method;
    if (preHookEvent.requestBody !== null) {
        params.body = preHookEvent.requestBody;
    }

    if (preHookEvent.requestQuery !== null) {
        url = url + "?" + buildQueryString(preHookEvent.requestQuery);
    }

    if (raw) {
        return fetch(url, params);
    } else {
        return fetch(url, params).then((r: Response) => r.ok ? r.json() : Promise.reject(r));
    }
}
