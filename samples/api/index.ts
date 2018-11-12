import {ICustomersRoute} from "./routes/customer";
import {IOrdersRoute} from "./routes/order";
import {IAuthRoute} from "./routes/auth";
import {typeRest} from "type-rest";

export interface Api {
    // Work with Customers
    customer: ICustomersRoute;
    // Work with Orders
    order: IOrdersRoute;
    // Work with Authentication
    auth: IAuthRoute;
}

export const api = typeRest<Api>("https://my-super-cool-app/api");