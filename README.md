# Tidycrap

A node-cli script which takes a freshly made [create-react-app](https://github.com/facebook/create-react-app) project, strips out some cruft like logos and CSS, and adds in [github-pages](https://pages.github.com/) support, along with the abilty to deploy to github pages by simply running `yarn deploy`.

I found that I was always doing the same 'tidying' after running CRA, so this is my way of automating that work.

It is extremely not recommended to run it on non-empty projects, although you'll be able to revert the damage.

Maybe a future version will try to detect if it's running in a repo with real work in it.

To see if this is for you, I suggest you run it on a freshly create-react-app'd directory and then run git diff and yarn start.

## What it does, exactly

* Adds the gh-pages package
* Modifies package.json with gh-pages homepage and deploy scripts
* Modifies README.md with the project name and a link to the homepage
* Deletes CRA logo files
* Deletes manifest.json and references to it in index.html
* Deletes serviceWorker.js and references to it in index.js
* Blanks CSS files
* Replaces App functional component with a PureComponent based one
* Creates a commit with the message "tidycrap"

## Setup

```
chmod +x tidycrap.js
```

## Usage

```
Usage: ./tidycrap.js [options]

Options:
  -u, --username <name>  Github username
  -p, --path <path>      Path to the repo relative to tidycrap e.g. -p ../awesome-project
  -n, --name <name>      Name of this repo (default: derived from path)
  -h, --help             output usage information
```

## Thanks

* Thanks to this guide for teaching me how to add github-pages to react apps https://reactgo.com/deploy-react-app-github-pages/
