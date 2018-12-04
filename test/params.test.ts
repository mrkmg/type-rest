import {buildQueryString} from "../src/build-query-string";

describe("Params", () => {
    it("obj-number", () => {
        const obj = {a: 1};
        expect(buildQueryString(obj)).toBe("a=1");
    });

    it("obj-string", () => {
        const obj = {a: "b"};
        expect(buildQueryString(obj)).toBe("a=b");
    });

    it("obj-function", () => {
        const obj = {a: () => 1};
        expect(buildQueryString(obj)).toBe("a=1");
    });

    it("obj-array", () => {
        const obj = {a: [1, 2, 3]};
        expect(buildQueryString(obj)).toBe("a[0]=1&a[1]=2&a[2]=3");
    });

    it("obj-multi-level", () => {
        const obj = {a: {b: "c"}};
        expect(buildQueryString(obj)).toBe("a[b]=c");
    });

    it("obj-complex", () => {
        const obj = {a: {b: "c" }, b: [{a: 1, b: () => "d"}]};
        expect(buildQueryString(obj)).toBe("a[b]=c&b[0][a]=1&b[0][b]=d");
    });

    it("string", () => {
        const obj = "abc";
        expect(buildQueryString(obj)).toBe("abc");
    });

    it("number", () => {
        const obj = 123;
        expect(buildQueryString(obj)).toBe("123");
    });

    it("array-string", () => {
        const obj = ["a", "b", "c"];
        expect(buildQueryString(obj)).toBe("0=a&1=b&2=c");
    });

    it("array-obj", () => {
        const obj = [{a: 1}, {b: 2}];
        expect(buildQueryString(obj)).toBe("0[a]=1&1[b]=2");
    });
});
