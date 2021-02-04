import {ITypeRestEndpoints} from "./untyped";
import {ITypeRestOptions} from "./options";
import {IHookDefinition} from "./hooks";

type KeyTypes<T> = Exclude<T, IIndexPrivates<T> & ITypeRestEndpoints>;
type Indexed<T> = {
    [P in keyof T]: T[P] & IIndexPrivates<T[P]>;
};

interface IIndexPrivates<T> {
    readonly _root: Index<T>;
    readonly _parent: Index<T>;
    readonly _options: ITypeRestOptions<T>;
    readonly _path: string;
    readonly _fullPath: string;
    readonly _uri: string;
    readonly _fullOptions: Readonly<ITypeRestOptions<T>>;
    readonly _addHook: (hook: IHookDefinition<T>) => void;
}

export type Index<T> = Indexed<KeyTypes<T>> & IIndexPrivates<T>;