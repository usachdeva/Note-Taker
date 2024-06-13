const fs = require("fs");
const util = require("util");

const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

module.exports = { readFromFile, writeToFile };
