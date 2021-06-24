const path = require('path');

const cacheLoc = path.join(__dirname, '../', 'cache');
const counterLoc = path.join(__dirname, '../', '.counter');

module.exports = {
    cacheLoc,
    counterLoc
}