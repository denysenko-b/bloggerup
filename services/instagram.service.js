const { IgApiClient } = require("instagram-private-api");
const fetch = require("node-fetch");

const InstServiceConfig = require("../config/instagraService.config");
const User = require("../models/user.model");
const AGENTS = require("../config/instagramAgents.confg");

const ig = new IgApiClient();
let avaliabe = false; //TODO: true

const login = async (username, password) => {
    ig.state.generateDevice(username);
    await ig.simulate.preLoginFlow();
    const loggedInUser = await ig.account.login(username, password);
    console.log(`We'll use <${username}> as Instagram Agent`);

    process.nextTick(async () => await ig.simulate.postLoginFlow());
    avaliabe = true;
};

function* userDataGenerator() {
    for (let i = 0; ; i++) {
        if (i === AGENTS.length) i = 0;
        yield AGENTS[i];
    }
}

const getUserData = userDataGenerator();

async function changeAgent() {
    try {
        await login(...getUserData.next().value);
    } catch (e) {
        setTimeout(changeAgent, 5 * 60 * 1000);
    }
}

if (avaliabe) changeAgent();

const request =
    (cb, errorHandler) =>
    async (ctx, ...args) => {
        if (!avaliabe) throw "service_is_unavaliabe";

        const {
            from: { id: userId },
            deltaInstTime,
        } = ctx;

        if (deltaInstTime < InstServiceConfig.minTimeDelay)
            throw "many_requests";

        try {
            await User.findOneAndUpdate(
                {
                    userId,
                },
                {
                    lastActivityInst: new Date(Date.now()),
                }
            );

            const data = await cb(...args);

            return data;
        } catch (e) {
            // if (e.name === 'IgLoginRequiredError') {
            //     avaliabe = false;
            //     setTimeout(changeAgent, 0);
            //     return request()();
            // }

            //TODO:dev (message [old]) --- for production change message to name
            if (
                e.name === "IgResponseError" ||
                e.name === "IgLoginRequiredError"
            ) {
                avaliabe = false;
                setTimeout(changeAgent, 0);
                return request()();
            }
            if (errorHandler) {
                const handledE = errorHandler(e);
                if (handledE !== undefined) return handledE;
            }

            console.log(e);
        }
    };


const getUserByUsernameL = request(
    async (username) => {
        return await ig.user.usernameinfo(username);
    },
    (e) => {
        if (e.name === "IgNotFoundError") {
            return null;
        }
    }
);

// const getUserByUsername = async (ctx, username) => {
//     const data = await fetch(`https://www.instagram.com/${username}/?__a=1`);

//     switch (data.status) {
//         case 400:
//             throw 'bad_request';

//         case 404:
//             throw 'not_found';

//         case 200:
//             try {
//                 return(await data.json()).graphql.user;
//             } catch (e) {
//                 if (e.message.includes('https://www.instagram.com/accounts/login/')) {
//                     return getUserByUsernameL(ctx, username);
//                 }

//                 console.log(e);
//             }

//         default:
//             throw 'unhandled_error';
//     }
// }

const getUserById = request((id) => ig.user.info(id));

const getUserFollowers = request((id) => ig.feed.accountFollowers(id).items());

const getMediaLikes = request(id => ig.media.likers(id))

const getMainMediaData = async (url) => {
    const data = await fetch(
        `https://api.instagram.com/oembed/?url=${url}`
    );
    switch (data.status) {
        case 400:
            throw 'bad_request';

        case 404:
            throw 'not_found';

        case 200:
            return await data.json();;

        default:
            throw 'unhandled_error';
    }
};

// (async () => {
//     console.log(await isMyMedia("https://www.instagram.com/p/CQdJK0CD_Nq"))

   
// })()

module.exports = {
    getUserById,
    getUserByUsername: getUserByUsernameL,
    getUserFollowers,
    getMainMediaData,
    getMediaLikes
};
