declare module "merge-options" {
    function mergeOptions<T>(def: T, o: T): T;
    export = mergeOptions;
}
