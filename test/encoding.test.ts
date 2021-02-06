import fetch, {MockParams} from "jest-fetch-mock";
import {typeRest, CommonEncodings} from "../src";

describe("Encoding", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("jsonToJson (default)", async () => {
        fetch.mockResponse("{\"result\":\"data\"}");

        const api = typeRest("https://api1.test-domain.local/api/v1/", {fetch});
        const result = await api.Post({input: "data"});

        expect(result).toEqual({result: "data"});
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"input\":\"data\"}");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Content-Type", "application/json");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Accept", "application/json");
    });

    it("formDataToJson (default)", async () => {
        fetch.mockResponse("{\"result\":\"data\"}");

        const api = typeRest("https://api1.test-domain.local/api/v1/", {fetch, encoder: CommonEncodings.formDataToJson});
        const fd = new FormData();
        fd.append("key", "value");
        const result = await api.Post(fd);

        expect(result).toEqual({result: "data"});
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", fd);
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Content-Type", "multipart/form-data");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Accept", "application/json");
    });

    it("jsonToCsv", async () => {
        fetch.mockResponse("a,b,,1,2\n\n\"ss\",\"\", ,\"\n\"\na,b,c,d,e,f,g,");

        const api = typeRest("https://api1.test-domain.local/api/v1/", {fetch, encoder: CommonEncodings.jsonToCsv});
        const result = await api.Post({input: "data"});

        expect(result).toEqual([["a", "b", "", "1", "2"], [""], ["ss", "", " ", "\n"], ["a", "b", "c", "d", "e", "f", "g"]]);
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"input\":\"data\"}");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Content-Type", "application/json");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Accept", "text/csv");
    });

    it("jsonToText", async () => {
        fetch.mockResponse("raw text example");
        const api = typeRest("https://api1.test-domain.local/api/v1", {
            fetch,
            encoder: CommonEncodings.jsonToText,
        });
        const result = await api.Post({input: "data"});

        expect(result).toEqual("raw text example");
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"input\":\"data\"}");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Content-Type", "application/json");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Accept", "text/*");
    });

    it("jsonToBlob", async () => {
        fetch.mockResponse("testing 1 2 3");
        const api = typeRest("https://api1.test-domain.local/api/v1", {
            fetch,
            encoder: CommonEncodings.jsonToBlob,
        });
        const result = await api.Post({input: "data"}) as Blob;

        await expect(result.text()).resolves.toEqual("testing 1 2 3");
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"input\":\"data\"}");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Content-Type", "application/json");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Accept", "*/*");
    });

    it("custom", async () => {
        fetch.mockResponse("a,b,c,d\ne,f,g,h");

        const api = typeRest("https://api1.test-domain.local/api/v1", {
            fetch,
            encoder: {
                requestContentType: "text/crappy-csv",
                requestAcceptType: "text/crappy-csv",
                responseDecoder: async response => (await response.text()).split("\n").map(v => v.split(",")),
                requestEncoder: async (data: string[][]) => data.map(row => row.join(",")).join("\n"),
            }
        });
        const result = await api.Post([[1,2,3,4],[5,6,7,8]]);
        expect(result).toEqual([["a", "b", "c", "d"],["e", "f", "g", "h"]]);
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "1,2,3,4\n5,6,7,8");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Content-Type", "text/crappy-csv");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Accept", "text/crappy-csv");
    });
});
