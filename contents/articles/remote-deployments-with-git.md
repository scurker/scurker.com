---
title: "Remote Deployments with Git"
date: 2015-01-25
---

I've been deploying using git for my static and node sites for several months and wanted to offer some tips on how you can do the same. This is very similar to [heroku's deployment model](https://devcenter.heroku.com/articles/git) but using your own server in place of theirs.

### Getting Started

* Remote server
* SSH access
* Git installed locally and remotely
* (optional) npm installed remotely
* (optional) grunt installed remotely

For the remote server, you'll need two different directories to store your files. One is where your site will be hosted, the other will be used for the git repository. I'm using `/var/www` and `/var/git` respectively, but you can choose differently based on your setup.

### Create remote repository

For the remote server, you'll need to start with a bare git repository. This is where you will push your content to from your local machine.

```bash
cd /var/git
mkdir site.git && cd site.git
git init --bare
```

### Remote dependencies

Whatever you're using to build locally, you'll also need to be sure those dependencies are installed on your remote server. I'm using [npm](https://www.npmjs.com/) and [grunt](http://gruntjs.com/) to build everything - but this could be ruby, jekyll or anything used to compile your site.

Since I'm using grunt, we'll need to be sure that grunt-cli is installed globally.

```bash
npm install -g grunt-cli
```

### Create post receive hook

We'll be using a [post receive hook](http://git-scm.com/docs/githooks#post-receive) to run tasks after commits are received, such as building the site. Since your git directory probably isn't where you're serving up your files, you can use `--work-tree` to set the working directory for your committed files.

#### post-receive hook

```bash
#!/bin/sh

# Use a build path as a temp staging directory before copying over
# to the "live" web directory
BUILD_PATH=$(cd "$(dirname "$0")/.."; pwd)/build
WEB_PATH=/var/www/example.com

# Checkout latest version of files and cleanup untracked files
git --work-tree=$BUILD_PATH checkout -f
git --work-tree=$BUILD_PATH clean -fd

cd $BUILD_PATH;
npm install --production

# Use grunt to run a build task, but this could be anything you
# want to use to generate your static site and/or run your node project
grunt build

# Clean web directory and copy static files to web directory
(cd $WEB_PATH;rm -rf *)
(cp -r $BUILD_PATH/build/. $WEB_PATH)
```

Be sure you make the post-receive hook executable.

```bash
chmod +x hooks/post-receive
```

### Set up Push to Deploy

Now that everything is configured remotely, you'll need to set up your local git to push to your remote server.

```bash
git remote add deploy ssh://user@example.com/var/git/site.git
```

Now, you can push files to your remote server with one simple command:

```bash
...
git add .
git commit -m "Updating files"
git push deploy
```

If everything worked successfully, you should be able to view your site and see updated changes.

#### Add SSH key

Don't like typing your username and password every time you deploy? You can use a public SSH key to authenticate every time you do your push to deploy. If you haven't already generated your SSH keys, you can [follow this guide through step 2](https://help.github.com/articles/generating-ssh-keys/).

From there, you can simply copy your public key to your server.

```bash
cat ~/.ssh/id_rsa.pub | ssh user@example.com "cat >> ~/.ssh/authorized_keys"
```

Everything you see above could also be implemented with [travis ci](https://travis-ci.org/) for an even easier deployment process -- but that's a topic for another time. If you have something to add, [let me know on twitter](https://twitter.com/scurker).
