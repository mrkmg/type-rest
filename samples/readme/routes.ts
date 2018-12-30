import {IAuthenticationRoute} from "./authentication-route";
import {ITodosRoute} from "./todos-route";

export interface IAwesomeApiRoutes {
    authentication: IAuthenticationRoute;
    todos: ITodosRoute;
}
