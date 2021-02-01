export function buildQueryString(obj: unknown): string {
    const queryStringOptions: string[] = [];

    const solve = (v: unknown) => {
        while (typeof v === "function") {
            v = v();
        }
        if (v === null || v === undefined) {
            v = "";
        }
        return encodeURIComponent(v as string | number | boolean);
    };

    const add = (k: string, v: unknown) => {
        v = solve(v);

        if (v === "") {
            queryStringOptions.push(k);
        } else {
            queryStringOptions.push(k + "=" + v);
        }
    };

    const makeParams = (prefix: string, innerObj: unknown) => {
        if (typeof innerObj === "object") {
            for (const key in innerObj) {
                if (key in innerObj) {
                    const encodedKey = solve(key);

                    makeParams(prefix === "" ? encodedKey : `${prefix}[${encodedKey}]`, innerObj[key]);
                }
            }
        } else if (prefix !== "") {
            add(prefix, innerObj);
        } else {
            add(solve(innerObj), null);
        }
    };

    makeParams("", obj);

    return queryStringOptions.join("&");
}
