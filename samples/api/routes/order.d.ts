import {IOrder} from "../../entities/order";
import {IListParams} from "../generics";
import {WithBody, WithNone, WithQuery, WithBodyAndQuery} from "../../../dist";

export interface IOrdersRoute {
    Get: WithQuery<IOrderGetParams, IOrderWithoutCustomer[]>;
    Post: WithBody<IOrderPostBody, IOrderWithoutCustomer> & WithBodyAndQuery<IOrderPostBody, IOrderGetOneParams, IOrder>;
    [customerId: number]: IOrderRoute;
}

export interface IOrderRoute {
    Patch: WithBody<IOrderPatchBody, IOrderWithoutCustomer>;
    Get: WithNone<IOrderWithoutCustomer> & WithQuery<IOrderGetOneParams, IOrder>;
    Delete: WithNone<void>;
}

export type IOrderWithoutCustomer = Pick<IOrder, Exclude<keyof IOrder, "customer">>;

export type IOrderGetParams = IListParams<IOrder>;
export type IOrderPostBody = Pick<IOrderWithoutCustomer, Exclude<keyof IOrderWithoutCustomer, "id">>;
export type IOrderPatchBody = Partial<IOrderWithoutCustomer>;
export interface IOrderGetOneParams {
    withCustomer: true
}