const {
    getOptimalLanguage
} = require('../locales');


module.exports = (ctx, next) => {
    const userLang = ctx.from.language_code;
    ctx.from.lang = getOptimalLanguage(userLang);
    next();
}