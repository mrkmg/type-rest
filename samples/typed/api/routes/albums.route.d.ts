import {Merge, WithBody, WithNone, WithQuery} from "../../../../dist";
import {Album} from "../../entities/album";
import {PhotosStatic} from "./photos.route";

export type AlbumsRoute = Merge<AlbumsStatic, AlbumsIndexed>;

export interface AlbumsStatic {
    Get: WithQuery<AlbumsListQuery, Album[]> & WithNone<Album[]>;
    Post: WithBody<AlbumCreateRequest, Album>;
}

export interface AlbumsIndexed {
    [postId: number]: AlbumStatic;
}

export interface AlbumStatic {
    Get: WithNone<Album>;
    Patch: WithBody<AlbumUpdateRequest, Album>;
    Put: WithBody<Album, Album>;
    Delete: WithNone<void>;
    photos: PhotosStatic;
}

export type AlbumsListQuery = Partial<Album>;
export type AlbumCreateRequest = Pick<Album, "title">;
export type AlbumUpdateRequest = Partial<Pick<Album, "title">>