
export interface IListParams<T> {
    filter?: Partial<T>;
    sort?: (keyof T)[];
    limit?: number;
}