# tidycrap
Takes a freshly made create-react-app project, strips out some stuff, and adds in github-pages support

i.e. tidies CRA, and adds Pages. Hence tidyCRAp.

To see if this is for you, I suggest you run it on a freshly create-react-app'd directory and then run git diff and yarn start to check it's all working.

# What it does

* Adds the gh-pages package
* Modifies package.json with gh-pages homepage and deploy scripts
* Deletes CRA logo files
* Deletes manifest.json and references to it in index.html
* Deletes serviceWorker.js and references to it in index.js
* Blanks CSS files
* Replaces App functional component with a PureComponent based one
* Creates a commit with the message "tidycrap"

# Setup

```
chmod +x tidycrap.js
```

# Usage

```
$ ./tidycrap.js -h
```