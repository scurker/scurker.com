---
title: "Javascript Clock using HTML5 and Canvas"
date: 2010-04-20
---

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="/projects/jclock/jclock.js"></script>
<script type="text/javascript">
  $(window).ready(function() {
    new jClock('/projects/jclock/clock.png', $('canvas').get(0));
  });
</script>

<style type="text/css">
  #jclock {
    padding-top: 15px;
    padding-right: 15px;
    float: left;
  }
</style>

I've been finding myself becoming more interested in what HTML5 can do. As I see it HTML5 stands to be a potential replacement for flash, in addition to the features and interactivity that are made available by various javascript frameworks out there.

A good starting point would be to start off with something simple, i.e. a clock. Here's a sample project I threw together to help make myself more familiar with HTML5's canvas.

<div id="jclock">
  <canvas height="125" width="125"><img src="/projects/jclock/clock.png" alt="HTML5 isn't supported!" title="HTML5 isn't supported!"/></canvas>
</div>

The clock you see on the left is written completely in javascript and takes advantage of <a href="http://dev.w3.org/html5/spec/Overview.html#the-canvas-element">HTML5 and the canvas element</a> -- no flash necessary.

If you see a blank clock face with no hands, that means that your browser does not support HTML5. You will need to be using the latest version of <a href="http://www.google.com/chrome">Chrome</a>, <a href="http://getfirefox.com">Firefox</a>, <a href="http://opera.com">Opera</a> or <a href="http://apple.com/safari">Safari</a> in order for the clock to work. IE does not currently natively support the canvas element.

There are <a href="https://developer.mozilla.org/en/Canvas_tutorial">several</a> <a href="http://developer.apple.com/mac/library/documentation/AppleApplications/Conceptual/SafariJSProgTopics/Tasks/Canvas.html">good</a> <a href="http://dev.opera.com/articles/view/html-5-canvas-the-basics/">canvas</a> <a href="http://carsonified.com/blog/dev/html-5-dev/how-to-draw-with-html-5-canvas/">tutorials</a> out there so please check those if you want a more in-depth introduction to HTML5's canvas element.

In order to use this clock, you'll need to setup your canvas element:

```html
<canvas id="jclock" height="125" width="125">
  Content or message to display if the browser does not support Canvas/HTML5.
</canvas>
```

Initializing the clock:

```javascript
$(window).load(function() {
  new jClock('my-clock-face-image.png', $('#jclock').get(0));
});
```

You can also pass in additional options to change items such as the hand colors, or image size. Here's the defaults as defined in the plugin:

```javascript
// override default options:
// i.e. new jClock('image.png', $('#canvas').get(0), {shadow: false});

jClock.defaults = {
  height: 125,       // default height
  width: 125,        // default width
  secondHand: true,  // show the second hand
  shadow: true,      // display shadows across all hands
  second: {          // second hand style options
    color: '#f00',
    width: 2,
    start: -10,
    end: 35,
    alpha: 1
  },
  minute: {          // minute hand style options
    color: '#fff',
    width: 3,
    start: -7,
    end: 30,
    alpha: 1
  },
  hour: {            // hour hand style options
    color: '#fff',
    width: 4,
    start: -7,
    end: 20,
    alpha: 1
  }
};
```

Feel free to download the source code and play around with it, or ask any questions you may have in the comments below.

[Download jclock.js (2.4k)](/projects/jclock/jclock.js)