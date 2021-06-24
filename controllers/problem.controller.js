const fs = require('fs');
const {counterLoc} = require('../config/storage.config');

const getId = () => {
    const num = fs.readFileSync(counterLoc, 'utf8');

    fs.writeFile(counterLoc, +num+1+'', (err) => {
        if (err) console.log(err);
    });
    return num;
}

module.exports = {
    getId
};