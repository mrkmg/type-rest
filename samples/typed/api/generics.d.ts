export interface IListParams<T> {
    filter?: Partial<T>;
    sort?: Array<keyof T>;
    limit?: number;
}
