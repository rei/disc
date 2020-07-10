const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const ONLINE_WEB = path.join(process.env.REI_CODE_HOME, 'online', 'online-web');

if (_.isEmpty(process.env.REI_CODE_HOME)) {
  console.warn('REI_CODE_HOME was empty. Setting this will display paths relative to /online-web');
}

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
 * Logs a report of the top n packages in bundle.
 * @param json The json bundle tree data.
 * @param topN The top n largest packages in bundle.
 */
const generate = function (json, topN) {
  console.log(`Total bundle size: ${json.size.toLocaleString()}`);
  const allPackages = [];
  traverseJsonBundleData(json, allPackages);
  const sorted = _.dropRight(_.reverse(_.sortBy(allPackages, 'size')), allPackages.length - topN);
  sorted.forEach((item) => {
    console.log(`${(100 * (item.size / json.size)).toFixed(2)}%`, item.size.toLocaleString(), item.name, `(${path.relative(ONLINE_WEB, item.path)})`);
  });
}

module.exports = {
  generate
};
