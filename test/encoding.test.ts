import fetch from "jest-fetch-mock";
import {typeRest, TypeRestDefaults} from "../src";

describe("Encoding", () => {
    beforeAll(() => {
        TypeRestDefaults.fetchImplementation = fetch;
    });

    beforeEach(() => {
        fetch.resetMocks();
    });

    it("json (default)", async () => {
        fetch.mockResponse("{\"result\":\"data\"}");

        const api = typeRest("https://api1.test-domain.local/api/v1/");
        const result = await api.Post({input: "data"});

        expect(result).toEqual({result: "data"});
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "{\"input\":\"data\"}");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Content-Type", "application/json");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Accept", "application/json");
    });

    it("custom", async () => {
        fetch.mockResponse("a,b,c,d");

        const api = typeRest("https://api1.test-domain.local/api/v1", {
            encoder: {
                requestContentType: "text/csv",
                requestAcceptType: "text/csv",
                responseDecoder: async response => (await response.text()).split(","),
                requestEncoder: async (data: string[]) => data.join(","),
            }
        });
        const result = await api.Post(["d", "e", "f", "g"]);
        expect(result).toEqual(["a", "b", "c", "d"]);
        expect(fetch.mock.calls[0][1]).toHaveProperty("body", "d,e,f,g");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Content-Type", "text/csv");
        expect(fetch.mock.calls[0][1].headers).toHaveProperty("Accept", "text/csv");

    });
});
