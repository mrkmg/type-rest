import {WithBody, WithNone} from "../../../src";

export interface IAuthRoute
{
    // Check if Authenticated
    Get: WithNone<boolean>;
    // Login
    Post: WithBody<IAuthBody, IAuthResponse>;
    // Logout
    Delete: WithNone<void>;
}

interface IAuthBody {
    username: string;
    password: string;
}

interface IAuthResponse {
    valid: boolean;
    jwt?: string;
}