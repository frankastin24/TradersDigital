const path = require('path');
const fs = require('fs');
const env = {};

  // Read file content
  const absPath = path.resolve(global.__app_path+'/.env');
  
  if (!fs.existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }

  const content = fs.readFileSync(absPath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    // Ignore comments and empty lines
    if (!line || line.trim().startsWith('#')) continue;
    // Split key and value
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let [, key, value] = match;
      // Remove surrounding quotes from value
      value = value || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1).replace(/\\"/g, '"');
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1).replace(/\\'/g, "'");
      }
      env[key] = value;
    }
  }

global.__env = env;

updateEnvVariable = (key,value) => {
  let envContent = '';

  // Read the existing .env file
  if (fs.existsSync(global.__app_path +'/.env')) {
    envContent = fs.readFileSync(global.__app_path +'/.env', 'utf-8');
  }
  console.log('here');

  const lines = envContent.split('\n');

  let found = false;
  const updatedLines = lines.map(line => {
    if (line.startsWith(`${key}=`)) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });

  if (!found) {
    updatedLines.push(`${key}=${value}`);
  }

  global.__env[key] = value;

  fs.writeFileSync(global.__app_path +'/.env', updatedLines.join('\n'), 'utf-8');
  console.log(global.__app_path +'/.env' +`${key} updated to "${value}" in .env`);
}

module.exports = updateEnvVariable;