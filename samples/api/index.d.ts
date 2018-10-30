import {ICustomersRoute} from "./routes/customer";
import {IOrdersRoute} from "./routes/order";
import {IAuthRoute} from "./routes/auth";

export interface Api {
    // Work with Customers
    customer: ICustomersRoute;
    // Work with Orders
    order: IOrdersRoute;
    // Work with Authentication
    auth: IAuthRoute;
}