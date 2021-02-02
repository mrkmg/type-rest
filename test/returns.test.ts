import fetch from "jest-fetch-mock";
import {typeRest, TypeRestDefaults} from "../src";

describe("Returns", () => {
    beforeAll(() => {
        TypeRestDefaults.fetchImplementation = fetch;
    });

    beforeEach(() => {
        fetch.resetMocks();
    });

    it("json response, successful", async () => {
        fetch.mockResponse("{\"responseParam1\": \"responseValue1\"}");
        const api = typeRest("https://localhost/");
        const result = await api.Get();
        expect(result).toEqual({responseParam1: "responseValue1"});
    });

    it("json response, 500", async () => {
        fetch.mockResponse("{\"responseParam1\": \"responseValue1\"}", {status: 500});
        const api = typeRest("https://localhost/");
        expect.assertions(1);
        await api.Get().catch((e) => expect(e).toHaveProperty("status", 500));
    });

    it("raw response, successful", async () => {
        fetch.mockResponse("abc-123");
        const api = typeRest("https://localhost/");
        const result1 = await api.Get.raw();
        const result2 = await api.Post.raw({bodyParam: "bodyValue"});
        await expect(result1.text()).resolves.toEqual("abc-123");
        await expect(result2.text()).resolves.toEqual("abc-123");
    });

    it("raw response, 500", async () => {
        fetch.mockResponse("{\"responseParam1\": \"responseValue1\"}", {status: 500});
        const api = typeRest("https://localhost/");
        expect.assertions(1);
        await api.Get().catch((e) => expect(e).toHaveProperty("status", 500));
    });

    it("network error", async () => {
        fetch.mockReject({message: "Network Failure", name: "NetworkError"});
        const api = typeRest("https://localhost/");
        expect.assertions(1);
        await api.Get().catch((e) => expect(e).toHaveProperty("message", "Network Failure"));
    });
});
