const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '..', 'config.json');

const getConfig = function () {
    const buffer = fs.readFileSync(configPath);
    const json = new Buffer(buffer).toString();
    return JSON.parse(json);
}

const setConfig = function (config) {
    const json = JSON.stringify(config);
    return fs.writeFileSync(configPath, json);
}

module.exports = {
    getConfig,
    setConfig
}
