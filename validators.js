module.exports = {

    isInstagramUsername: (username) => username.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm),
    isUrl: (url) => url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/gm)
}