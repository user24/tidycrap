#!/usr/bin/env node

// Get cmdline params
const program = require('commander');
program.storeOptionsAsProperties(false);
program.requiredOption('-u, --username <name>', 'Github username');
program.requiredOption('-p, --path <path>', 'Path to the repo');
program.option('-n, --name <name>', 'Name of this repo (default: derived from path)');
program.parse(process.argv);
const options = program.opts();

const name = options.name || require('path').basename(options.path);

console.log(`Running tidycrap for ${options.username}'s ${name} project at ${options.path}\n`);

console.log("Adding gh-pages with yarn");

// Add gh-pages package
const { exec } = require('child_process');
exec('yarn add gh-pages', {
  cwd: options.path
}, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.error(stderr);
    return;
  }

  console.log('OK');


  console.log('Modifying package.json');
  // Modify package.json with gtihub pages deets.
  const packageJsonLocation = `${options.path}/package.json`;
  const packageJson = require(packageJsonLocation);
  packageJson.homepage = `https://${options.username}.github.io/${name}`;
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.predeploy = 'yarn run build';
  packageJson.scripts.deploy = 'gh-pages -b master -d build';

  const fs = require('fs');
  fs.writeFile(packageJsonLocation, JSON.stringify(packageJson, undefined, 2), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('OK');

    console.log('Removing CRA stuff I don\'t use');
    fs.unlink(`${options.path}/src/logo.svg`, (err) => { err && console.error(err) });
    fs.unlink(`${options.path}/public/logo192.png`, (err) => { err && console.error(err) });
    fs.unlink(`${options.path}/public/logo512.png`, (err) => { err && console.error(err) });
    fs.unlink(`${options.path}/public/manifest.json`, (err) => { err && console.error(err) });
    fs.unlink(`${options.path}/src/serviceWorker.js`, (err) => { err && console.error(err) });
    fs.writeFile(`${options.path}/src/App.css`, "", (err) => { err && console.error(err) });
    fs.writeFile(`${options.path}/src/index.css`, "", (err) => { err && console.error(err) });
    fs.createReadStream('./templates/index.html').pipe(fs.createWriteStream(`${options.path}/public/index.html`));
    fs.createReadStream('./templates/App.js').pipe(fs.createWriteStream(`${options.path}/src/App.js`));
    fs.createReadStream('./templates/index.js').pipe(fs.createWriteStream(`${options.path}/src/index.js`));
    console.log("OK");

    console.log('Committing');
    exec('git add . && git commit -m "tidycrap."', {
      cwd: options.path
    }, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.error(stderr);
        return;
      }
      console.log('OK');
    });
  });
});