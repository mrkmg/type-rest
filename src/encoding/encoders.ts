function solve(v: unknown): string {
    while (typeof v === "function") {
        v = v();
    }
    if (v === null || v === undefined) {
        v = "";
    }
    return encodeURIComponent(v as string | number | boolean);
}

function add(k: string, v: unknown) {
    v = solve(v);

    if (v === "") {
        return k;
    } else {
        return k + "=" + v;
    }
}

function makeParams(prefix: string, value: unknown, queryStringOptions: string[] = []): string[] {
    if (typeof value === "object") {
        for (const key in value) {
            if (key in value) {
                const encodedKey = solve(key);

                makeParams(prefix === "" ? encodedKey : `${prefix}[${encodedKey}]`, value[key], queryStringOptions);
            }
        }
    } else if (prefix !== "") {
        queryStringOptions.push(add(prefix, value));
    } else {
        queryStringOptions.push(add(solve(value), null));
    }
    return queryStringOptions;
}

export async function queryString(request: unknown): Promise<string> {
    return makeParams("", request).join("&");
}

export async function csv(request: (string|number|null)[][]): Promise<string> {
    return request
        .map(row => row.map(column =>
            /* eslint-disable indent */
            column === null ? "" :
            typeof column === "number" ? column.toString() :
            /[,"\n]/g.test(column) ? `"${column.replace(/(["])/g, "\"\"")}"` :
            column
            /* eslint-enable indent */
        ).join(",")).join("\n");
}
