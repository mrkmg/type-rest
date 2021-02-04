import {json, csv} from "./decoders";

export const CommonEncodings = Object.freeze({
    "jsonToJson": {
        requestAcceptType: "application/json",
        requestContentType: "application/json",
        requestEncoder: async (request: unknown) => JSON.stringify(request),
        responseDecoder: json,
    },
    "formDataToJson": {
        requestAcceptType: "application/json",
        requestContentType: "multipart/form-data",
        requestEncoder: async (request: FormData) => request,
        responseDecoder: json,
    },
    "jsonToCsv": {
        requestAcceptType: "text/csv",
        requestContentType: "application/json",
        requestEncoder: async (request: unknown) => JSON.stringify(request),
        responseDecoder: csv,
    }
});