import {api} from "./api";

async function main() {
    const allUsers = await api.users.Get();
    console.log(allUsers);
    const singleUserByUsername = await api.users.Get({username: "Bret"});
    console.log(singleUserByUsername);
    const singleUserById = await api.users[1].Get();
    console.log(singleUserById);
    const createdUser = await api.users.Post({name: "test", username: "test", email: "test", phone: "1234", website: "test", address: null, company: null});
    console.log(createdUser);
    const patchedUser = await api.users[singleUserById.id].Patch({username: "new"});
    console.log(patchedUser);

    const allCommentsForUser = await api.users[1].comments.Get();
    console.log(allCommentsForUser);

    const singleAlbum = await api.albums[1].Get();
    const photosInAlbum = await api.albums[singleAlbum.id].photos.Get();
    console.log(singleAlbum, photosInAlbum);
    const modifiedPhoto = await api.photos[photosInAlbum[0].id].Patch({title: "test"});
    console.log(modifiedPhoto);
}

main().catch(e => console.error(e));