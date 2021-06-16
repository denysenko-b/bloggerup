const ru = require('./ru');
const locales = {
    ru
}
const defaultLang = 'ru';

const getOptimalLanguage = lang => {
    if (lang in locales) return lang;

    for (const locale in locales) {
        const similarLanguages = locales[locale].similarLanguages;
        if (similarLanguages.includes(lang)) return locale;
    }


    return defaultLang;
}

module.exports = {
    ...locales,
    getOptimalLanguage
};