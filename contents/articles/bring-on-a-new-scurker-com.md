---
title: "Bring on a new scurker.com"
date: 2014-12-14
---

Welcome to the redesign and relaunch of scurker.com! It's been far too long in my professional career that I have neglected this site, and felt that a new fresh coat of paint was long overdue.

It's also been three years since I have contributed anything back to the community, and part of the goal for this relaunch is to better share what I know and have learned.

### So Long Wordpress!

Wordpress was a good start, but has finally outlived its usefulness and I've moved on to greener pastures. I wanted something much more lightweight and with more friendly editing. I had initially looked at [ghost](http://ghost.org) along with a few other blogging platforms, but eventually decided that I didn't want to be encumbered by unnecessary overhead of yet another blog platform.

### Hello Wintersmith

Bring on [wintersmith](http://wintersmith.io/), a nodejs static site generator. I don't hate myself, so I also am using [wintersmith handlebars](https://github.com/tnguyen14/wintersmith-handlebars) over the built in Jade template engine. For my sanity and easier editing I can write every post or page in markdown - which wintersmith will automatically convert.

### Dependencies

* [wintersmith](http://wintersmith.io/)
* [wintersmith handlebars](https://github.com/tnguyen14/wintersmith-handlebars)
* [grunt](http://gruntjs.com)
* [noto sans font](http://www.google.com/fonts/specimen/Noto+Sans)

There's some slightly modified plugins to wintersmith to allow for article to article pagination and a more sensible permalink structure.

### No more jQuery

I'm a big fan of jQuery, but I have been [slowly moving away from having jQuery](http://youmightnotneedjquery.com/) as a dependency unless absolutely necessary. So you won't see very much jQuery used here.

### Open Sourced

I've learned a lot through open source projects, and have spoken many times about the importance of open source. However, my own blog I kept private and didn't share what I knew. I figured it's time to start putting money where my mouth is and release the source for this site. You can check out everything on [github](http://github.com/scurker/scurker.com). If you come across any issues, be sure to [let me know](https://github.com/scurker/scurker.com/issues).