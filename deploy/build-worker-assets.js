const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

function copy(source, destination) {
  fs.cpSync(path.join(root, source), path.join(output, destination), {
    recursive: true,
    force: true,
  });
}

copy('Frontend', '.');
copy('CSS', 'css');
copy('Botanics/images', 'images');
copy('SOVA-demo/frontend/public/images', 'images');
copy('Aurelia-app/frontend/images', 'images');
copy('CherryPOPDev/Images', 'images');
copy('IMAGES', 'images');
copy('Aurelia-app/frontend', 'aurelia');
copy('Botanics', 'botanics');
copy('SOVA-demo/frontend/showcase', 'projects');

console.log('Built Cloudflare Worker static assets in dist/.');
