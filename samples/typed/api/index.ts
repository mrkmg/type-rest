import {typeRest} from "../../../src";
import {IAuthRoute} from "./routes/auth";
import {ICustomersRoute} from "./routes/customer";
import {IOrdersRoute} from "./routes/order";
import {IPostHookEvent} from "../../../src";

export interface IApi {
    // Work with Customers
    customer: ICustomersRoute;
    // Work with Orders
    order: IOrdersRoute;
    // Work with Authentication
    auth: IAuthRoute;
}

export const api = typeRest<IApi>("https://my-super-cool-app/api", {
    hooks: [
        {
            type: "post",
            method: "POST",
            path: "/auth/",
            hook: (ev: IPostHookEvent<never, never, never, {jwt: string}>) => {
                if (ev.response)
                    api._options.params.headers.token = ev.response.jwt;
            },
        }
    ]
});
