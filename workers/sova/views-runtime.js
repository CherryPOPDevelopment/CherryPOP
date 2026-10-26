const path = require('path');
const templates = require('./generated/views');

const ENCODE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&#34;', "'": '&#39;' };
const escapeXml = (value) => (value == null ? '' : String(value).replace(/[&<>'"]/g, (c) => ENCODE[c]));

function rethrow(err) {
  throw err;
}

function resolveName(from, target) {
  const clean = target.replace(/\.ejs$/, '');
  const dir = path.posix.dirname(from);
  return path.posix.normalize(clean.startsWith('.') ? path.posix.join(dir, clean) : clean);
}

function renderTemplate(name, data) {
  const template = templates[name];
  if (!template) throw new Error(`Failed to look up view "${name}"`);
  const include = (target, extra) => renderTemplate(resolveName(name, target), { ...data, ...extra });
  return template(data, escapeXml, include, rethrow);
}

// Express view class that renders precompiled templates (no runtime eval).
class PrecompiledView {
  constructor(name) {
    this.name = name.replace(/\.ejs$/, '');
    this.path = this.name;
  }

  render(options, callback) {
    let html;
    try {
      html = renderTemplate(this.name, options);
    } catch (error) {
      return callback(error);
    }
    return callback(null, html);
  }
}

module.exports = { PrecompiledView, renderTemplate };
