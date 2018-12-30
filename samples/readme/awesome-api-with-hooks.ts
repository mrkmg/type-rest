import {typeRest} from "type-rest";
import {loginHook, logoutHook} from "./hooks";
import {IAwesomeApiRoutes} from "./routes";

export const AwesomeApi = typeRest<IAwesomeApiRoutes>("https://awesome-app/api/v1/", {
    hooks: [loginHook, logoutHook],
});
