import {Encoders} from "../src";


describe("Encoding", () => {
    describe("Query Params", () => {
        it("obj-number", async () => {
            const obj = {a: 1};
            await expect(Encoders.queryString(obj)).resolves.toBe("a=1");
        });

        it("obj-string", async () => {
            const obj = {a: "b"};
            await expect(Encoders.queryString(obj)).resolves.toBe("a=b");
        });

        it("obj-function", async () => {
            const obj = {a: () => 1};
            await expect(Encoders.queryString(obj)).resolves.toBe("a=1");
        });

        it("obj-array", async () => {
            const obj = {a: [1, 2, 3]};
            await expect(Encoders.queryString(obj)).resolves.toBe("a[0]=1&a[1]=2&a[2]=3");
        });

        it("obj-multi-level", async () => {
            const obj = {a: {b: "c"}};
            await expect(Encoders.queryString(obj)).resolves.toBe("a[b]=c");
        });

        it("obj-complex", async () => {
            const obj = {a: {b: "c" }, b: [{a: 1, b: () => "d"}]};
            await expect(Encoders.queryString(obj)).resolves.toBe("a[b]=c&b[0][a]=1&b[0][b]=d");
        });

        it("string", async () => {
            const obj = "abc";
            await expect(Encoders.queryString(obj)).resolves.toBe("abc");
        });

        it("number", async () => {
            const obj = 123;
            await expect(Encoders.queryString(obj)).resolves.toBe("123");
        });

        it("array-string", async () => {
            const obj = ["a", "b", "c"];
            await expect(Encoders.queryString(obj)).resolves.toBe("0=a&1=b&2=c");
        });

        it("array-obj", async () => {
            const obj = [{a: 1}, {b: 2}];
            await expect(Encoders.queryString(obj)).resolves.toBe("0[a]=1&1[b]=2");
        });
    });

    describe("CSV", () => {
        it("empty", async () => {
            const obj = [[]];
            await expect(Encoders.csv(obj)).resolves.toBe("");
        });

        it ("complex", async () => {
            const obj = [
                ["a", 1, null, 2, "b"],
                [],
                ["abc", "a,bc", "a\"", "a\nbc", "a,b\nc"]
            ];
            await expect(Encoders.csv(obj)).resolves.toBe("a,1,,2,b\n" +
                "\n" +
                "abc,\"a,bc\",\"a\"\"\",\"a\nbc\",\"a,b\nc\"");
        });
    });
});
