#!/usr/bin/env node

const program = require('commander');

const config = require('./src/config');
const http = require('./src/http');
const nameSplitter = require('./src/name-splitter');
const pathResolve = require('./src/path-resolve');

program
  .version('0.1.0');

// get a file from server
program
  .command('pull <name>')
  .option('-o --output <n>', 'output tar file')
  .action(function (name, options) {
    const splittedName = nameSplitter.split(name);
    let outputFilepath;
    if (!options.output) {
      console.info(`[WARNING] No output filename config, use ${splittedName.name}-${splittedName.tag}`);
      outputFilepath = `${splittedName.name}-${splittedName.tag}`;
    } else {
      outputFilepath = options.output;
    }
    http.pullPackage(name, pathResolve(outputFilepath));
  });

// post a file to server
program
  .command('push <name>')
  .option('-i --input <n>', 'input tar file')
  .action(function (name, options) {
    if (!options.input) {
      return console.error(`[ERROR] No input param, use -i <filename>`);
    }
    const inputFilename = options.input;
    http.pushPackage(name, pathResolve(inputFilename));
  });

// delete file on server
program
  .command('delete <name>')
  .option('-y --yes', 'make sure to delete because it is dangerous')
  .action(function (name, options) {
    if (!options.yes) {
      return console.log(`Are you sure to delete ${name}? Use -y to be sure`)
    }
    return http.deletePackage(name);
  });

program
  .command('config <method> <key> [value]')
  .action(function (method, key, value) {
    if (method === 'set') {
      const conf = config.getConfig();
      if (!conf.hasOwnProperty(key)) {
        return console.error('Wrong key');
      }
      if (key === 'registry') {
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          value = 'http://' + value;
        }
      }
      conf[key] = value;
      return config.setConfig(conf);
    }
    if (method === 'get') {
      const conf = config.getConfig();
      if (!conf.hasOwnProperty(key)) {
        return console.error('Wrong key');
      }
      return console.log(conf[key]);
    }
    return console.error('Unknown method, use set or get');
  });

program.parse(process.argv);
