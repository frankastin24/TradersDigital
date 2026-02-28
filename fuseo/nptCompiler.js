/**
 * NPT Compiler
 * -------------
 * Server-side template compiler for NPT language, supporting Vue-like syntax (v-if, v-else, v-else-if, v-for, {{}}).
 * Executes server-side JS in <% %> blocks, supports async context functions, and outputs an HTML string with hydration data.
 * Designed for Node.js.
 */

const vm = require('vm');
const { JSDOM } = require('jsdom');

/**
 * Main NPT compile function
 * @param {string} template - NPT template string
 * @param {object} context - Variables and functions for template evaluation
 * @returns {Promise<string>} - Rendered HTML string with hydration script
 */
async function compileNPT(template, context) {
  // 1. Run server-side JS blocks
  template = await runServerJSBlocks(template, context);

  // 2. Parse HTML into DOM
  const dom = new JSDOM(template);
  const document = dom.window.document;

  // 3. Hydration context (variables only, no functions)
  const hydrationContext = {};
  for (const key in context) {
    if (typeof context[key] !== 'function') hydrationContext[key] = context[key];
  }

  // 4. Process all nodes recursively for directives and bindings
  await processNode(document.body, context);

  // 5. Inject hydration script for Vue
  const hydrationScript = document.createElement('script');
  hydrationScript.textContent = `window.__NPT_CONTEXT__ = ${JSON.stringify(hydrationContext)};`;
  document.body.appendChild(hydrationScript);

  // 6. Return HTML string
  return document.body.innerHTML;
}

// ---------------- Helper Functions -----------------

// Execute all <% %> blocks in template
async function runServerJSBlocks(template, context) {
  return await replaceAsync(template, /<%([\s\S]+?)%>/g, async (match, jsCode) => {
    try {
      // Use a real async context for await support
      const keys = Object.keys(context);
      const values = Object.values(context);
      // Wrap code in async IIFE
      const code = `(async () => { ${jsCode} })()`;
      const func = new Function(...keys, `return ${code};`);
      const result = await func(...values);
      return result == null ? '' : String(result);
    } catch (e) {
      return '';
    }
  });
}

// Process a DOM node for NPT directives and bindings
async function processNode(node, context) {
  if (node.nodeType === 3) {
    // Text node - process {{}} bindings
    node.textContent = await processMustache(node.textContent, context);
    return;
  }
  if (node.nodeType !== 1) return; // Only element nodes

  // ----- v-if / v-else-if / v-else -----
  if (node.hasAttribute('v-if')) {
    const condition = node.getAttribute('v-if');
    const show = await evalExpression(condition, context);
    if (!show) {
      // Remove node and handle possible v-else-if/v-else
      const next = findNextSiblingElement(node);
      node.remove();
      if (next && next.hasAttribute('v-else-if')) {
        const elseIfCond = next.getAttribute('v-else-if');
        const elseIfShow = await evalExpression(elseIfCond, context);
        if (!elseIfShow) {
          const elseNode = findNextSiblingElement(next);
          if (elseNode && elseNode.hasAttribute('v-else')) {
            await processNode(elseNode, context);
          } else {
            elseNode && elseNode.remove();
          }
          next.remove();
        } else {
          await processNode(next, context);
        }
      } else if (next && next.hasAttribute('v-else')) {
        await processNode(next, context);
      }
      return;
    }
    node.removeAttribute('v-if');
  }
  if (node.hasAttribute('v-else-if') || node.hasAttribute('v-else')) {
    // These should only be handled if previous v-if failed, so skip here
    node.remove();
    return;
  }

  // ----- v-for -----
  if (node.hasAttribute('v-for')) {
    const vfor = node.getAttribute('v-for').trim();
    // Parse "item in items"
    const match = /^([\w$]+)\s+in\s+([^\s]+)$/.exec(vfor);
    if (!match) {
      node.remove();
      return;
    }
    const [, itemName, arrName] = match;
    const arr = await evalExpression(arrName, context);
    if (!Array.isArray(arr)) {
      node.remove();
      return;
    }
    // Clone and insert nodes
    const parent = node.parentNode;
    for (const item of arr) {
      const clone = node.cloneNode(true);
      clone.removeAttribute('v-for');
      // New context with item variable
      const newCtx = Object.assign({}, context, { [itemName]: item });
      await processNode(clone, newCtx);
      parent.insertBefore(clone, node);
    }
    node.remove();
    return;
  }

  // ----- Children -----
  for (let child = node.firstChild; child;) {
    // Save reference to next sibling before possible removal
    const next = child.nextSibling;
    await processNode(child, context);
    child = next;
  }
}

// Replace {{}} mustache bindings in a string
async function processMustache(text, context) {
  return await replaceAsync(text, /\{\{([\s\S]+?)\}\}/g, async (match, expr) => {
    try {
      const keys = Object.keys(context);
      const values = Object.values(context);
      const func = new Function(...keys, `return (${expr});`);
      let result = func(...values);
      if (typeof result === "function") result = await result();
      if (result && typeof result.then === "function") result = await result;
      return result == null ? '' : String(result);
    } catch (e) {
      return '';
    }
  });
}

// Evaluate an expression in the context, supporting await
async function evalExpression(expr, context) {
  try {
    const keys = Object.keys(context);
    const values = Object.values(context);
    const func = new Function(...keys, `return (${expr});`);
    let result = func(...values);
    if (typeof result === "function") result = await result();
    if (result && typeof result.then === "function") result = await result;
    return result;
  } catch (e) {
    return false;
  }
}

// Find next sibling that is an element node
function findNextSiblingElement(node) {
  let next = node.nextSibling;
  while (next && next.nodeType !== 1) next = next.nextSibling;
  return next;
}

// Async string replace utility
async function replaceAsync(str, regex, asyncFn) {
  const matches = [];
  str.replace(regex, (match, ...args) => {
    matches.push(asyncFn(match, ...args));
    return match;
  });
  const results = await Promise.all(matches);
  let i = 0;
  return str.replace(regex, () => results[i++]);
}

module.exports = { compileNPT };