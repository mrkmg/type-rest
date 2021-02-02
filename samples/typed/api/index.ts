import {typeRest} from "../../../src";
import {PostsRoute} from "./routes/posts.route";
import {AlbumsRoute} from "./routes/albums.route";
import {PhotosRoute} from "./routes/photos.route";
import {CommentsRoute} from "./routes/comments.route";
import {UsersRoute} from "./routes/users.route";

export interface IApi {
    posts: PostsRoute;
    comments: CommentsRoute;
    albums: AlbumsRoute;
    photos: PhotosRoute;
    users: UsersRoute;
}

export const api = typeRest<IApi>("https://jsonplaceholder.typicode.com");
