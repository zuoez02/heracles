const path = require('path');

const resolve = function(pth) {
    if (pth.startsWith('/')) {
        return pth;
    }
    return path.resolve(process.cwd(), pth);
}

module.exports = resolve;
