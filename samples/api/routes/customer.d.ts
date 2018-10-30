import {WithBody, WithNone, WithQuery} from "../../../src/";
import {ICustomer} from "../../entities/customer";
import {IListParams} from "../generics";
import {IOrdersRoute} from "./order";

export interface ICustomersRoute {
    Get: WithQuery<ICustomerGetParams, ICustomer[]>;
    Post: WithBody<ICustomerPostBody, ICustomer>;
    [customerId: number]: ICustomerRoute;
}

export interface ICustomerRoute {
    orders: IOrdersRoute;
    Patch: WithBody<ICustomerPatchBody, ICustomer>;
    Get: WithNone<ICustomer>;
    Delete: WithNone<void>;
}

export type ICustomerGetParams = IListParams<ICustomer>;
export type ICustomerPostBody =  Pick<ICustomer, Exclude<keyof ICustomer, "id">>;
export type ICustomerPatchBody = Partial<ICustomer>;