const {
    IgApiClient
} = require('instagram-private-api');

const ig = new IgApiClient();

const username = 'baklazhan43k';
const password = '}]9.`beAtKeN7$h';


// ig.state.generateDevice(username);

// ((async () => {

//     await ig.simulate.preLoginFlow();
//     const loggedInUser = await ig.account.login(username, password);

//     console.log(`We'll use <${username}> as Instagram Agent`);

//     process.nextTick(async () => await ig.simulate.postLoginFlow());
// }))()


const getUserByUsername = async (username) => {
    try {
        return await ig.user.usernameinfo(username);
    } catch (e) {
        if (e.name === 'IgNotFoundError') {
            console.log(`Not fount user with username: ${username}`)
            return null;
        }

        console.log(e);
    }
}

const getUserById = async (id) => {
    try {
        return await ig.user.info(id);
    } catch (e) {
        console.log(e.message);
    }
}

const getUserFollowers = async (id, size = 3) => {
    try {
        const followersFeed = ig.feed.accountFollowers(id);
        return await followersFeed.items();
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getUserById,
    getUserByUsername,
    getUserFollowers
}