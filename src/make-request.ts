import {ITypeRestOptions} from "./";

export function makeRequest(url: string, method: string, options: ITypeRestOptions<any>, body?: any, raw?: boolean) {
    const params: RequestInit = Object.assign({}, options.params);

    params.method = method;
    if (typeof body !== "undefined") {
        params.body = body;
    }

    if (raw) {
        return fetch(url, params);
    } else {
        return fetch(url, params).then((r: Response) => r.ok ? r.json() : Promise.reject(r));
    }
}
