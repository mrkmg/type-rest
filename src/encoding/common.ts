import {csv} from "./decoders";
import {IRequestEncoder} from "../types";

export const CommonEncodings = Object.freeze({
    "jsonToJson": {
        requestAcceptType: "application/json",
        requestContentType: "application/json",
        requestEncoder: async (request: unknown) => JSON.stringify(request),
        responseDecoder: (response) => response.json(),
    },
    "jsonToText": {
        requestAcceptType: "text/*",
        requestContentType: "application/json",
        requestEncoder: async (request: unknown) => JSON.stringify(request),
        responseDecoder: (response) => response.text(),
    },
    "jsonToBlob": {
        requestAcceptType: "*/*",
        requestContentType: "application/json",
        requestEncoder: async (request: unknown) => JSON.stringify(request),
        responseDecoder: (response) => response.blob(),
    },
    "jsonToCsv": {
        requestAcceptType: "text/csv",
        requestContentType: "application/json",
        requestEncoder: async (request: unknown) => JSON.stringify(request),
        responseDecoder: async (response) => csv(await response.text()),
    },
    "formDataToJson": {
        requestAcceptType: "application/json",
        requestContentType: "multipart/form-data",
        requestEncoder: async (request: FormData) => request,
        responseDecoder: (response) => response.json(),
    }
});