#!/usr/bin/env node

// Get cmdline params
const program = require('commander');
program.storeOptionsAsProperties(false);
program.requiredOption('-u, --username <name>', 'Github username');
program.requiredOption('-p, --path <path>', `Path to the repo relative to ${__dirname} e.g. -p ../awesome-project`);
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
    console.log(err, stdout, stderr);
    return;
  }
  console.log('OK');

  const homepage = `https://${options.username}.github.io/${name}`;

  console.log('Modifying package.json');
  // Modify package.json with gtihub pages deets.
  const packageJsonLocation = `${options.path}/package.json`;
  const packageJson = require(packageJsonLocation);
  packageJson.homepage = homepage;
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
    fs.unlinkSync(`${options.path}/src/logo.svg`);
    fs.unlinkSync(`${options.path}/public/logo192.png`);
    fs.unlinkSync(`${options.path}/public/logo512.png`);
    fs.unlinkSync(`${options.path}/public/manifest.json`);
    fs.unlinkSync(`${options.path}/src/serviceWorker.js`);
    fs.writeFileSync(`${options.path}/src/App.css`, "");
    fs.writeFileSync(`${options.path}/src/index.css`, "");
    fs.createReadStream(`${__dirname}/templates/index.html`).pipe(fs.createWriteStream(`${options.path}/public/index.html`));
    fs.createReadStream(`${__dirname}/templates/App.js`).pipe(fs.createWriteStream(`${options.path}/src/App.js`));
    fs.createReadStream(`${__dirname}/templates/index.js`).pipe(fs.createWriteStream(`${options.path}/src/index.js`));
    console.log("OK");

    console.log("Updating README.md with project title and demo link");
    const data = fs.readFileSync(`${options.path}/README.md`);
    const fd = fs.openSync(`${options.path}/README.md`, 'w+');
    const capitalisedName = name.toUpperCase().substring(0, 1) + name.substring(1).toLowerCase();
    const insertIntoReadme = `# ${capitalisedName}\n\nCheck out the [project demo](${homepage}).\n\n## Create React App stuff\n\n`;
    fs.writeSync(fd, insertIntoReadme, 0, insertIntoReadme.length, 0)
    fs.writeSync(fd, data, 0, data.length, insertIntoReadme.length)
    fs.close(fd, (err) => {
      if (err) console.log(err);
    });
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