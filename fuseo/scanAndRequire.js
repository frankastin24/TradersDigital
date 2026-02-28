const fs = require('fs');
const path = require('path');

/**
 * Scans a directory for .js files and requires each of them.
 * @param {string} dir - The directory to scan.
 * @returns {object} An object with file names as keys and required modules as values.
 */
function scanAndRequire(dir) {
  const files = fs.readdirSync(dir);
  const requiredModules = {};

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (
      fs.statSync(fullPath).isFile() &&
      path.extname(file).toLowerCase() === '.js'
    ) {
      // Remove extension for key, require the module
      const key = path.basename(file, '.js');
      requiredModules[key] = require(fullPath);
    }
  });

  return requiredModules;
}

// Example usage:
// const modules = scanAndRequire(__dirname + '/your-directory');
// console.log(modules);

module.exports = scanAndRequire;