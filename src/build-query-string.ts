export function buildQueryString(obj: any) {
    const queryStringOptions: string[] = [];

    const solve = (v: any) => {
        while (typeof v === "function") {
            v = v();
        }
        if (v === null || v === undefined) {
            v = "";
        }
        return encodeURIComponent(v);
    };

    const add = (k: string, v: any) => {
        v = solve(v);

        if (v === "") {
            queryStringOptions.push(k);
        } else {
            queryStringOptions.push(k + "=" + v);
        }
    };

    const makeParams = (prefix: string, innerObj: any) => {
        if (typeof innerObj === "object") {
            for (const key in innerObj) {
                if (innerObj.hasOwnProperty(key)) {
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
