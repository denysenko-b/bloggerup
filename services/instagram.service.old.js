const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-filestore2')
const storageConfig = require('../config/storage.config');

const cookieStore = new FileCookieStore(`${storageConfig.cacheLoc}/cookies.json`)

//import config
const USERS = require('../config/instagram.confg');

const getUserData = (() => {
    let id = 2;

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

// let client = login(getUserData());

function login(userData) {
    const client = new Instagram({
        ...userData,
        cookieStore
    })

    try {
        client.login();
    } catch(e) {
        return login(getUserData());
    }

    return client;
}


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

const getUserDataForFollowersTask = async (username) => {
    try {
        // const {
        //     profile_pic_url,
        //     full_name
        // } = await client.getUserByUsername({
        //     username
        // });

        // return {
        //     profile_pic_url,
        //     full_name
        // }

        //test
        return {
            profile_pic_url: 'https://instagram.flwo3-1.fna.fbcdn.net/v/t51.2885-19/s150x150/91960598_170063914062649_474743531458527232_n.jpg?tp=1&_nc_ht=instagram.flwo3-1.fna.fbcdn.net&_nc_ohc=Qil57bGCAn0AX-Et3VL&edm=ABfd0MgBAAAA&ccb=7-4&oh=6c288943eea6d3265df52b3539fe8c9d&oe=60D3BB2B&_nc_sid=7bff83',
            full_name: 'pêchels'
        }
    } catch (e) {
        return changeInstaClient(checkUser)(username)
    }
}

const checkUser = async (username) => {
    try {
        const userData = await client.getUserByUsername({
            username
        });

        console.log(userData);

        // if (Object.keys(userData).length === 0);

        // if (!userData.graphql) return changeInstaClient(checkUser)(username);

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
        } = userData;

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

const getFollowers = async (userId) => {
    try {
        return await client.getFollowers({
            userId,
            first: 10
        });
    } catch (e) {
        console.log(e);
        return null;
    }
}

module.exports = {
    checkUser,
    getFollowers,
    getUserDataForFollowersTask
};