import {typeRest} from "../../dist";
import {IAuthRoute} from "./routes/auth";
import {ICustomersRoute} from "./routes/customer";
import {IOrdersRoute} from "./routes/order";

export interface IApi {
    // Work with Customers
    customer: ICustomersRoute;
    // Work with Orders
    order: IOrdersRoute;
    // Work with Authentication
    auth: IAuthRoute;
}

export const api = typeRest<IApi>("https://my-super-cool-app/api");
