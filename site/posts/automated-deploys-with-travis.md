---
title: "Automated Deploys with Travis CI"
date: 2015-03-09
---

If you read my previous post about [remote deployments with git](/remote-deployments-with-git), you should have a good idea on how you can deploy with a simple git push. This method works fine if you only work from one computer but starts to be a little more difficult if you want to use other devices (such as an tablet or phone) and potentially want to write posts or content directly on Github.

## Bring in Travis CI

If you aren't using a CI (continuous integration) tool as part of your workflow, you should be! I've started to become a big fan of [Travis CI](https://travis-ci.org) because it's easy to setup, integrates easily with GitHub, and runs on a [number of different languages](http://docs.travis-ci.com/user/getting-started/#Travis-CI-Overview). And best of all, it's free<sup>*</sup>!

<small>* for open source projects</small>

I use Travis to centralize my pushes so that I no longer have to have setup remote pushes from my local computer directly to my remote server to update content, but rather push directly to a Github branch and let Travis take care of the rest.

## Getting Started

* Remote server for hosting your site
* Create limited access git user (recommended)
* Create public/private SSH key pairs for authentication
* Add public key to authorized SSH keys
* Add private key to repository
* Setup Travis
* Setup travis.yml

## Generate SSH key pairs

Since I don't exactly feel comfortable giving Travis or Github my personal credentials to my own server, I'm using SSH authentication in order to grant access to push. In addition, I've created a [limited access git user](http://git-scm.com/book/en/v2/Git-on-the-Server-Setting-Up-the-Server) that only has access to my git and web directories -- nothing else.

I'm not going to go into great detail on how to create your SSH key pairs, since Github has [already done that for us](https://help.github.com/articles/generating-ssh-keys/). You will need to login as your git user on your remote server, and generate a key pair following the above steps.

Once you've followed those steps, you should have two files `~/.ssh/id_rsa`, your private key and `~/.ssh/id_rsa.pub`, your public key. In order for the SSH authentication to work properly you will need to copy your public key into an authorized keys file.

```bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

## Add Private Key to Repository

Now that you've created a SSH key pair, you will need to copy your private key so that Travis can use it to authenticate to your remote server. Since we don't want to be putting our [private key unencrypted](http://www.devfactor.net/2014/12/30/2375-amazon-mistake/) into Github, we'll be using Travis to encrypt the key before we push it out for everyone to see. You will need to install either the Travis ruby gem, or travis-encrypt from npm if you haven't already done so.

### Ruby
```ruby
gem install travis
```

### NPM
```
npm install travis-encrypt
```

I'm personally using the official Travis ruby gem, but the rest of the arguments should be about the same for both. You can read more about [Travis encryption](http://docs.travis-ci.com/user/encryption-keys/), but I'm going to give you the Cliff Notes™ version here.

Assuming you're already in your project directory, it's as easy as...

```bash
mv id_rsa deploy_key
touch .travis.yml && travis encrypt-file deploy_key --add
```

This initializes the `.travis.yml` file, encrypts your deploy key, and adds all the necessary information for Travis to be able to use that encrypted file.

You'll need to commit your changes to Github, but before you do so remember to remove your private key `deploy_key` and store it somewhere safe!

## Setup Travis

From here, you'll want to to go to [travis-ci.org](https://travis-ci.org/), authenticate with Github, and turn on Travis for the repository that you wish to start deploying.

From here, you'll need to make a few additions to your `.travis.yml` file, and I'll include an example, but you can of course always view the [latest version](https://github.com/scurker/scurker.com/blob/master/.travis.yml) on Github.

```yaml
language: node_js
node_js: '0.10'
install: echo "skip install"
branches:
  only: master
after_success:
- chmod 600 deploy-key
- mv deploy-key ~/.ssh/id_rsa
- git remote add deploy ssh://git@example.com/var/git/site.git
- git push deploy
before_install:
- echo -e "Host example.com\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
- openssl aes-256-cbc -K $encrypted_6a5cf90fd664_key -iv $encrypted_6a5cf90fd664_iv
  -in deploy-key.enc -out deploy-key -d
```

You'll need to change things accordingly to your needs, but here's a couple of tips:

```yaml
install: echo "skip install"
```

I'm essentially skipping this step because I'm only using Travis to deploy, but theoretically, you could use this to run tests before the deployment actually runs.

```yaml
after_success:
- chmod 600 deploy-key
- mv deploy-key ~/.ssh/id_rsa
- git remote add deploy ssh://git@example.com/var/git/site.git
- git push deploy
```

Here's where the bulk of the work actually happen. Your private key is copied to the appropriate directory, and the remote origin is created and pushed to.

```
before_install:
- echo -e "Host example.com\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
```

You will also need to change this to your domain as well, otherwise Travis may not be able to authenticate the domain and will sit there until the job times out.

With this, any time I push to Github Travis is able to deploy those changes and immediately push them out to this blog. You can always view [everything on Github](https://github.com/scurker/scurker.com).

