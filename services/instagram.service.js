const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-filestore2');

//import config
const {
    username,
    password
} = require('../config/instagram.confg');
const {cacheLoc} = require('../config/storage.config');

const cookieStore = new FileCookieStore(`${cacheLoc}/cookies.json`);


class InstagramService {

    constructor() {
        this.client = new Instagram({
            username,
            password,
            cookieStore
        });
    }

    getUserId = async (username) => {
        try {
            const user = await this.client.getUserByUsername({username});
            if (user) {
                return user.id;
            }
            throw new Error(`User not found`);
        } catch (err) {
            console.error(err);
            throw 'e';
        }
    }
}

module.exports = new InstagramService();