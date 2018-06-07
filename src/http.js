const request = require('request');
const fs = require('fs');

const nameSplitter = require('./name-splitter.js')
const Config = require('./config');

const registry = Config.getConfig().registry;

const pullPackage = function (name, filePath) {
  try {
    const path = nameSplitter.split(name).path;
    console.log('Start pulling...')
    request
      .get(`${registry}/api/v1/${path}`)
      .on('response', function(res) {
        if (res.statusCode < 400) {
          res.pipe(fs.createWriteStream(filePath))
        } else {
          if (res.statusCode === 404) {
            console.error('Pull failed. Package not found');
          }
        }
      });
  } catch (error) {
    console.log(error);
  }
};

const pushPackage = function (name, filePath) {
  try {
    const path = nameSplitter.split(name).path;

    const formData = {
      package: fs.createReadStream(filePath)
    }

    console.log('Start pushing');
    request
      .post({
        url: `${registry}/api/v1/${path}`,
        formData
      })
      .on('end', function (err, res) {
        if (err) {
          return console.error('Push failed:', err);
        }
        console.log(`Push ${name} successful!`)
      });
  } catch (error) {
    console.log(error);
  }
};

const deletePackage = function (name) {
  try {
    const path = nameSplitter.split(name).path;
    console.log('Deleting...');
    request
      .delete(`${registry}/api/v1/${path}`)
      .on('end', function (err, res) {
        if (err) {
          return console.error('Delete failed:', err);
        }
        console.log(`Delete ${name} successful!`)
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  pullPackage,
  pushPackage,
  deletePackage
};
