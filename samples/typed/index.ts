/* eslint-disable @typescript-eslint/no-unused-vars */
import {api} from "./api";

async function main() {
    const allUsers = await api.users.Get();
    const singleUserByUsername = await api.users.Get({username: "Bret"});
    const singleUserById = await api.users[1].Get();
    const createdUser = await api.users.Post({name: "test", username: "test", email: "test", phone: "1234", website: "test", address: null, company: null});
    const patchedUser = await api.users[singleUserById.id].Patch({username: "new"});
    const allCommentsForUser = await api.users[1].comments.Get();
    const singleAlbum = await api.albums[1].Get();
    const photosInAlbum = await api.albums[singleAlbum.id].photos.Get();
    const modifiedPhoto = await api.photos[photosInAlbum[0].id].Patch({title: "test"});
}

main().catch(e => console.error(e));