const { saveUser } = require("./controller/registraion");

let users = [];

const addUser =({ id, user, room }) => {
    
    // user = user.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // if (!user || !room) {
    //     return { error: 'name and room required' }
    // }

    if (users.length) {
        const data = users.find(e => e.user === user && e.room === room)

        if (data) {
            return { error: 'user already exist' }
        }
    }

    const response = { id, user, room }

    console.log("sks",response.user,response.id);

    const a =saveUser(response.user,response.id)

    console.log("sksl",response.user,response.id);

    users.push(response)

    console.log(users)

    return { response };
}

const getUser = (id) => {
    return users.find(e => e.id == id);
}

// const getId = (user) => {
//     return users.find(e => e.user == user);
// }

const getRoomUsers = (room) => {
    return users.filter(e => e.room === room)
}

const removeUser = (id) => {
    const findIdx = users.findIndex(e => e.id == id);

    if (findIdx >= 0) {
        return users.splice(findIdx, 1)[0]
    }
}
module.exports = {
    addUser,
    getUser,
    removeUser,
    getRoomUsers,
    // getId
}