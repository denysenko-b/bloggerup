module.exports = {

    isInstagramUsername: (username) => username.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm)
}