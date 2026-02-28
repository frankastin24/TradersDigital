const fs = require('fs');
const path = require('path');

// HTML escaping function
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Simple cache for compiled templates
const TEMPLATE_CACHE = {};

// Compile a template string into an async function
function compileEJS(template, opts = {}) {
  const delimiter = opts.delimiter || '%';
  const includeRegex = new RegExp(
    `<${delimiter}\\s*include\\((['"\`])(.+?)\\1\\)\\s*${delimiter}>`,
    'g'
  );
  let src = "let __output='';\n";
  src += "const print = (...args) => { __output += args.join(''); };\n";
  src += "with(data){\n__output+='";
  let cursor = 0;
  const regex = new RegExp(
    `<${delimiter}([=-]?)([\\s\\S]*?)${delimiter}>`,
    'g'
  );
  let match;

  // Support includes (sync in compile step, async at render time)
  template = template.replace(includeRegex, (m, q, filename) => {
    // Place a magic comment for the renderer to replace later
    return `\u0000INCLUDE:${filename}\u0000`;
  });

  while ((match = regex.exec(template)) !== null) {
    // Add the text before this tag
    src += template
      .slice(cursor, match.index)
      .replace(/[\r\n\\']/g, char => {
        if (char === "\n") return "\\n";
        if (char === "\r") return "\\r";
        if (char === "\\") return "\\\\";
        if (char === "'") return "\\'";
      });

    const [full, flag, code] = match;
    if (flag === "=") {
      // Escaped output
      src += "' + escapeHTML(await (async()=>(" + code.trim() + "))()) + '";
    } else if (flag === "-") {
      // Unescaped output
      src += "' + (await (async()=>(" + code.trim() + "))()) + '";
    } else {
      // Plain code (JS logic)
      src += "';\n" + code.trim() + "\n__output+='";
    }
    cursor = match.index + full.length;
  }
  // Add remaining text
  src += template.slice(cursor).replace(/[\r\n\\']/g, char => {
    if (char === "\n") return "\\n";
    if (char === "\r") return "\\r";
    if (char === "\\") return "\\\\";
    if (char === "'") return "\\'";
  });

  src += "';\n}\nreturn __output;";


  // eslint-disable-next-line no-new-func
  return new Function(
    'data',
    'escapeHTML',
    'includeAsync',
    `
    with (data) {
      return (async function() {
        ${src}
      })();
    }
    `
  );
}

// Internal: Expand includes in the template source
async function expandIncludes(template, filename, opts) {
  const basedir = opts.views || path.dirname(filename || '.');
  const matches = [...template.matchAll(/\u0000INCLUDE:([^\u0000]+)\u0000/g)];
  for (const m of matches) {
    const includeFile = path.resolve(basedir, m[1]);
    let includeSource;
    if (TEMPLATE_CACHE[includeFile])
      includeSource = TEMPLATE_CACHE[includeFile].src;
    else
      includeSource = await fs.promises.readFile(includeFile, 'utf8');
    const expanded = await expandIncludes(includeSource, includeFile, opts);
    template = template.replace(m[0], expanded);
  }
  return template;
}

// Render a template string with async support
async function renderAsync(template, data = {}, opts = {}) {
  template = await expandIncludes(template, opts.filename, opts);
  const fn = compileEJS(template, opts);

  // Allow templates to call: <%= await includeAsync('foo.ejs', { ... }) %>
  async function includeAsync(file, ctx = {}) {
    const filename = path.resolve(opts.views || path.dirname(opts.filename || '.'), file);
    let src;
    if (TEMPLATE_CACHE[filename])
      src = TEMPLATE_CACHE[filename].src;
    else
      src = await fs.promises.readFile(filename, 'utf8');
    return renderAsync(src, { ...data, ...ctx }, { ...opts, filename });
  }

  return await fn(data, escapeHTML, includeAsync);
}

// Render a file (async)
async function renderFileAsync(filename, data = {}, opts = {}) {
  opts = { ...opts, filename };
  let src;
  if (TEMPLATE_CACHE[filename]) {
    src = TEMPLATE_CACHE[filename].src;
  } else {
    src = await fs.promises.readFile(filename, 'utf8');
    TEMPLATE_CACHE[filename] = { src };
  }
  return renderAsync(src, data, opts);
}

// Synchronous render (no async/await in template)
function renderSync(template, data = {}, opts = {}) {
  // Remove await/async from template for sync mode
  template = template.replace(/await\s*\((async\s*=>)?/g, '');
  const fn = compileEJS(template, opts);
  return fn(data, escapeHTML, ()=>"");
}

module.exports = {
  renderAsync,
  renderFileAsync,
  renderSync,
  compileEJS,
  escapeHTML,
};