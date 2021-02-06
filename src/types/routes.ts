import {ITypeRestEndpoints} from "./untyped";
import {ITypeRestOptions} from "./options";
import {IHookDefinition} from "./hooks";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type NonIndexable<T> = Pick<T, keyof ITypeRestEndpoints>;
type Indexable<T> = Omit<T, keyof ITypeRestInternals<T> | keyof ITypeRestEndpoints>;
type Indexed<T> = {
    [P in keyof Indexable<T>]: Index<T[P]> & ITypeRestInternals<T[P]>;
};

interface ITypeRestInternals<T> {
    readonly _root: Index<T>;
    readonly _parent: Index<T>;
    readonly _options: ITypeRestOptions<T>;
    readonly _path: string;
    readonly _encodedPath: string;
    readonly _fullPath: string[];
    readonly _uri: string;
    readonly _resolvedOptions: Readonly<ITypeRestOptions<T>>;
    readonly _addHook: (hook: IHookDefinition<T>) => void;
}

export type Index<T> = Indexed<T> & NonIndexable<T> & ITypeRestInternals<T>;