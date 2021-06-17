module.exports = {

    isInstagramUsername: (username) => username.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm),
    isNumber: (string) => string.match(/^[0-9]+$/gm)
}