const Instagram = require('instagram-web-api');

//import config
const {
    username,
    password
} = require('../config/instagram.confg');

class InstagramService {

    constructor() {
        this.client = new Instagram({
            username,
            password
        });
    }

    checkUser = async (username) => {
        try {
            const {id, is_private, full_name, edge_owner_to_timeline_media: {count: mediaCount}, edge_followed_by: {count: followers}} = await this.client.getUserByUsername({username});
            return {
                id,
                is_private,
                full_name,
                mediaCount,
                followers
            }
        } catch (e) {
            return null;
        }
    }


}

module.exports = new InstagramService();