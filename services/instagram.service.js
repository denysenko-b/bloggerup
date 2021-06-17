const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-filestore2')
const storageConfig = require('../config/storage.config');

const cookieStore = new FileCookieStore(`${storageConfig.cacheLoc}/cookies.json`)

//import config
const USERS = require('../config/instagram.confg');

const getUserData = (() => {
    let id = 0;

    return () => {
        let userData = USERS[id++];

        if (id == USERS.length) throw new Error('Trusted accounts have expired')

        if (!userData) {
            userData = USERS[0];
            id = 1;
        };


        console.log(`We'll use <${userData[0]}> as Instagram Agent`);

        return {
            username: userData[0],
            password: userData[1]
        }
    }
})()


let client = new Instagram({
    ...getUserData(),
    cookieStore
})


const changeInstaClient = cb => async (...args) => {
    client = new Instagram({
        ...getUserData(),
        cookieStore
    })

    try {
        await client.login();
        const data = client.getProfile();
        console.log(data);
    } catch (e) {
        console.log(e);
    }

    return await cb(args);
}

const checkUser = async (username) => {
    try {
        const userData = await client.getUserByUsername({
            username
        });

        if (!userData.graphql) return changeInstaClient(checkUser)(username);

        const {
            id,
            is_private,
            full_name,
            edge_owner_to_timeline_media: {
                count: mediaCount
            },
            edge_followed_by: {
                count: followers
            }
        } = userData.graphql.user;
        return {
            id,
            is_private,
            full_name,
            mediaCount,
            followers
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

module.exports = {
    checkUser
};