import fetch from "jest-fetch-mock";
import {Index, typeRest, UntypedTypeRestApi} from "../src";

describe("End Point Calls", () => {
    let api: Index<UntypedTypeRestApi>;

    beforeAll(() => {
        api = typeRest("https://localhost/",{fetch});
    });

    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponse("{}");
    });

    it("Get", async () => {
        await api.Get();
        await api.Get({key1: "value1", key2: "value2"});

        expect(fetch.mock.calls[0][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "GET");
        expect(fetch.mock.calls[1][0]).toBe("https://localhost/?key1=value1&key2=value2");
        expect(fetch.mock.calls[1][1]).toHaveProperty("method", "GET");
    });

    it("Delete", async () => {
        await api.Delete();
        await api.Delete({key1: "value1", key2: "value2"});

        expect(fetch.mock.calls[0][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "DELETE");
        expect(fetch.mock.calls[1][0]).toBe("https://localhost/?key1=value1&key2=value2");
        expect(fetch.mock.calls[1][1]).toHaveProperty("method", "DELETE");
    });

    it("Patch", async () => {
        await api.Patch();
        await api.Patch({bodyKey1: "bodyValue1", bodyKey2: 123});
        await api.Patch({bodyKey1: "bodyValue1", bodyKey2: 123}, {key1: "value1", key2: "value2"});

        expect(fetch.mock.calls[0][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "PATCH");
        expect(fetch.mock.calls[1][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[1][1]).toHaveProperty("body", "{\"bodyKey1\":\"bodyValue1\",\"bodyKey2\":123}");
        expect(fetch.mock.calls[1][1]).toHaveProperty("method", "PATCH");
        expect(fetch.mock.calls[2][0]).toBe("https://localhost/?key1=value1&key2=value2");
        expect(fetch.mock.calls[2][1]).toHaveProperty("body", "{\"bodyKey1\":\"bodyValue1\",\"bodyKey2\":123}");
        expect(fetch.mock.calls[2][1]).toHaveProperty("method", "PATCH");
    });

    it("Post", async () => {
        await api.Post();
        await api.Post({bodyKey1: "bodyValue1", bodyKey2: 123});
        await api.Post({bodyKey1: "bodyValue1", bodyKey2: 123}, {key1: "value1", key2: "value2"});

        expect(fetch.mock.calls[0][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "POST");
        expect(fetch.mock.calls[1][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[1][1]).toHaveProperty("body", "{\"bodyKey1\":\"bodyValue1\",\"bodyKey2\":123}");
        expect(fetch.mock.calls[1][1]).toHaveProperty("method", "POST");
        expect(fetch.mock.calls[2][0]).toBe("https://localhost/?key1=value1&key2=value2");
        expect(fetch.mock.calls[2][1]).toHaveProperty("body", "{\"bodyKey1\":\"bodyValue1\",\"bodyKey2\":123}");
        expect(fetch.mock.calls[2][1]).toHaveProperty("method", "POST");
    });

    it("Put", async () => {
        await api.Put();
        await api.Put({bodyKey1: "bodyValue1", bodyKey2: 123});
        await api.Put({bodyKey1: "bodyValue1", bodyKey2: 123}, {key1: "value1", key2: "value2"});

        expect(fetch.mock.calls[0][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[0][1]).toHaveProperty("method", "PUT");
        expect(fetch.mock.calls[1][0]).toBe("https://localhost/");
        expect(fetch.mock.calls[1][1]).toHaveProperty("body", "{\"bodyKey1\":\"bodyValue1\",\"bodyKey2\":123}");
        expect(fetch.mock.calls[1][1]).toHaveProperty("method", "PUT");
        expect(fetch.mock.calls[2][0]).toBe("https://localhost/?key1=value1&key2=value2");
        expect(fetch.mock.calls[2][1]).toHaveProperty("body", "{\"bodyKey1\":\"bodyValue1\",\"bodyKey2\":123}");
        expect(fetch.mock.calls[2][1]).toHaveProperty("method", "PUT");
    });
});