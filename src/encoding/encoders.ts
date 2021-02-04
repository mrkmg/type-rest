import {queryStringEncoder} from "./query-string";

export const Encoders = Object.freeze({
    "queryString": async (request: unknown) => queryStringEncoder(request),
    "json": async (request: unknown) => JSON.stringify(request),
    "formData": async (request: FormData) => {
        if (!(request instanceof FormData)) throw new Error("Body must be FormData");
        return request;
    },
    "csv": async (request: (string|number|null)[][]) =>
        request
            .map(row => row.map(column =>
                /* eslint-disable indent */
                column === null ? "" :
                typeof column === "number" ? column.toString() :
                /[,"\n]/g.test(column) ? `"${column.replace(/(["])/g, "\"\"")}"` :
                column
                /* eslint-enable indent */
            ).join(",")).join("\n")

});