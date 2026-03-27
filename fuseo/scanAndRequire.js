import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

/**
 * Scans a directory for .js files and requires each of them.
 * @param {string} dir - The directory to scan.
 * @returns {object} An object with file names as keys and required modules as values.
 */
async function scanAndRequire(dir) {
  const files = fs.readdirSync(dir);
  const requiredModules = {};

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (
      fs.statSync(fullPath).isFile() &&
      path.extname(file).toLowerCase() === '.js'
    ) {
      // Remove extension for key, require the module
      const key = path.basename(file, '.js');
      const mod = await import(pathToFileURL(fullPath).href);
      requiredModules[key] = mod.default || mod;
    }
  }

  return requiredModules;
}

// Example usage:
// const modules = scanAndRequire(__dirname + '/your-directory');
// console.log(modules);

export default scanAndRequire;