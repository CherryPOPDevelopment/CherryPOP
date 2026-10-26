const path = require('path');
const fs = require('fs');
const ejs = require('../../../SOVA-demo/node_modules/ejs');
const acorn = require('acorn');
const eslintScope = require('eslint-scope');

const viewsDir = path.resolve(__dirname, '../../../SOVA-demo/frontend/views');
const outFile = path.resolve(__dirname, '../generated/views.js');

// Workers forbid eval/new Function and ES modules are strict (no `with`), so EJS
// templates are compiled ahead of time and their free variables are read from locals.
const builtins = new Set(Object.getOwnPropertyNames(globalThis));

function listTemplates(dir, base = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return listTemplates(path.join(dir, entry.name), rel);
    return entry.name.endsWith('.ejs') ? [rel] : [];
  });
}

function compile(file) {
  const filename = path.join(viewsDir, file);
  const source = fs.readFileSync(filename, 'utf8');
  const fn = ejs.compile(source, {
    client: true,
    compileDebug: false,
    _with: false,
    filename,
  });
  const code = fn.toString();
  const ast = acorn.parse(`(${code})`, { ecmaVersion: 'latest', ranges: true });
  const scope = eslintScope.analyze(ast, { ecmaVersion: 2022 });
  const names = new Set(scope.globalScope.through.map((ref) => ref.identifier.name));
  const free = [...names].filter((name) => !builtins.has(name) && !name.startsWith('_ENCODE') && name !== 'encode_char' && name !== '_MATCH_HTML');
  const bodyStart = code.indexOf('{', code.indexOf(')')) + 1;
  const prologue = free.length ? `\nvar ${free.map((name) => `${name} = locals.${name}`).join(', ')};` : '';
  const params = 'locals, escapeFn, include, rethrow';
  return `function (${params}) {${prologue}${code.slice(bodyStart)}`;
}

const templates = listTemplates(viewsDir).sort();
const body = templates
  .map((file) => `  ${JSON.stringify(file.replace(/\.ejs$/, ''))}: ${compile(file)}`)
  .join(',\n');

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `module.exports = {\n${body}\n};\n`);
console.log(`Precompiled ${templates.length} SOVA templates.`);
