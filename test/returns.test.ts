import {typeRest} from "../src";
import fetch = require("jest-fetch-mock");

describe("Returns", () => {

    beforeEach(() => {
        fetch.resetMocks();
    });

    it("json response, successful", async () => {
        const api = typeRest("https://localhost/");
        fetch.mockResponse('{"responseParam1": "responseValue1"}');
        const result = await api.Get();
        expect(result).toEqual({responseParam1: "responseValue1"});
    });

    it("json response, 500", async () => {
        const api = typeRest("https://localhost/");
        fetch.mockResponse('{"responseParam1": "responseValue1"}', {status: 500});
        expect.assertions(1);
        await api.Get().catch(e => expect(e).toHaveProperty("status", 500));
    });

    it("raw response, successful", async () => {
        const api = typeRest("https://localhost/");
        fetch.mockResponse('abc-123');
        const result1 = await api.Get.raw();
        expect(result1).toHaveProperty("body", "abc-123");

        const result2 = await api.Post.raw({bodyParam: "bodyValue"});
        expect(result2).toHaveProperty("body", 'abc-123');
    });

    it("raw response, 500", async () => {
        const api = typeRest("https://localhost/");
        fetch.mockResponse('{"responseParam1": "responseValue1"}', {status: 500});
        expect.assertions(1);
        await api.Get().catch(e => expect(e).toHaveProperty("status", 500));
    });

    it("network error", async () => {
        const api = typeRest("https://localhost/");
        fetch.mockReject({message: "Network Failure", name: "NetworkError"});
        expect.assertions(1);
        await api.Get().catch(e => expect(e).toHaveProperty("message", "Network Failure"));
    });
});