const mongoose = require('mongoose');

const dbConfig = require('./config/mongodb.config');

const connect = () => mongoose.connect(dbConfig.uri, dbConfig.options)
    .then(() => {
        console.log(`Successful connect to mongodb`)
    })
    .catch(e => {
        console.error(e);
    })


module.exports = {
    connect
} 