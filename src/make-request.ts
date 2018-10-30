import {IDynamicRestInit} from "./types";

export function makeRequest(url: string, method: string, init: IDynamicRestInit, body?: any) {
    const params = Object.assign({
        method,
        body
    }, init);
    return fetch(url, params).then((r: Response) => r.ok ? r.json() : Promise.reject(r));
}