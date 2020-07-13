const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');
const { EOL } = require('os');

/**
 * Function to traverse the json bundle tree.
 * @param jsonObj The json tree of modules.
 * @param allPackages A flat list (array) of all packages in bundle.
 */
function traverseJsonBundleData(jsonObj, allPackages) {
  if (jsonObj.children) {
    jsonObj.children.forEach((child) => {
      if (child.children) {
        traverseJsonBundleData(child, allPackages);
      } else {
        allPackages.push(child);
      }
    });
  }
}

/**
 * Utility function to format file sizes
 * @param bytes
 * @param decimals
 * @returns {string}
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Logs a report of the top n packages in bundle.
 * @param json The json bundle tree data.
 * @param topN The top n largest packages in bundle.
 */
const generate = function (json, topN) {
  console.log(`${EOL}Total bundle size: ${formatBytes(json.size)}${EOL}`);
  const allPackages = [];
  traverseJsonBundleData(json, allPackages);
  const sorted = _.dropRight(_.reverse(_.sortBy(allPackages, 'size')), allPackages.length - topN);
  sorted.forEach((item, n) => {
    const line = `${(100 * (item.size / json.size)).toFixed(2)}% - ${formatBytes(item.size)} - ${item.name} (${item.path})`;
    console.log( n < 3 ? chalk.red(line) : line, EOL);
  });
}

module.exports = {
  generate
};
