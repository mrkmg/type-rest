import {typeRest, TypeRestDefaults} from "../src";
import fetch from "jest-fetch-mock";

const api = typeRest("https://api1.test-domain.local/api/v1/");
describe("Special Endpoints", () => {
    beforeAll(() => {
        TypeRestDefaults.fetchImplementation = fetch;
    });

    afterAll(() => {
        TypeRestDefaults.fetchImplementation = null;
    });

    it("_uri", () => {
        expect(api._uri).toBe("https://api1.test-domain.local/api/v1/");
        expect(api.sub1._uri).toBe("https://api1.test-domain.local/api/v1/sub1/");
        expect(api.sub1.sub2._uri).toBe("https://api1.test-domain.local/api/v1/sub1/sub2/");
    });

    it("_path", () => {
        expect(api._path).toBe("https://api1.test-domain.local/api/v1/");
        expect(api.sub1._path).toBe("sub1");
        expect(api.sub1.sub2._path).toBe("sub2");
    });

    it("_fullPath", () => {
        expect(api._fullPath).toBe("/");
        expect(api.sub1._fullPath).toBe("/sub1/");
        expect(api.sub1.sub2._fullPath).toBe("/sub1/sub2/");
    });
});
