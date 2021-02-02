import {Merge, WithBody, WithNone, WithQuery} from "../../../../src";
import {User} from "../../entities/user";
import {CommentsStatic} from "./comments.route";
import {PostsStatic} from "./posts.route";
import {AlbumsStatic} from "./albums.route";
import {PhotosStatic} from "./photos.route";

export type UsersRoute = Merge<UsersStatic, UsersIndexed>;

export interface UsersStatic {
    Get: WithQuery<UsersListQuery, User[]> & WithNone<User[]>;
    Post: WithBody<UserCreateRequest, User>;
}

export interface UsersIndexed {
    [postId: number]: UserStatic;
}

export interface UserStatic {
    Get: WithNone<User>;
    Patch: WithBody<UserUpdateRequest, User>;
    Put: WithBody<User, User>;
    Delete: WithNone<void>;
    comments: CommentsStatic;
    posts: PostsStatic;
    albums: AlbumsStatic;
    photos: PhotosStatic;
}

export type UsersListQuery = Partial<User>;
export type UserCreateRequest = Omit<User, "id">;
export type UserUpdateRequest = Partial<Exclude<User, "id">>