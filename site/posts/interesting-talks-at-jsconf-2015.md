---
title: "Interesting talks at JSConf 2015"
date: 2015-05-31
---

This is my second year of being able to attend JSConf and feel fortunate to be able to listen and interact with so many awesome people in the community. This is mostly a brain dump of some of the topics I found interesting at JSConf, but obviously isn't every talk or speaker since I couldn't attend every session. Hopefully, some others can benefit from some of the knowledge I gained - or find some interesting people to follow in the community.

## JS Accessibility and JS: side-by-side - [Felipe de Albuquerque](https://twitter.com/felipedeolinda)

This was an interesting talk on accessibility because the talk itself wasn't presented in English. Felipe gave a few examples of why accessibility is important:

* 650 million people have some some kind of disability
* Kids can control websites through voice before they can read, so having voice control would allow young kids to navigate
* The internet should be inclusive of everyone
* Based on research, [JAWS](http://www.freedomscientific.com/Products/Blindness/JAWS) is one of the most popular screen readers

One of the biggest issues we have in the community is the lack of developer knowledge with WAI-ARIA attributes. ARIA attributes are something that are ready to be implemented *today*, and as a community we should be concerned about making our applications accessible to everyone.

## Communicate All the Things - [Kyle Tyacke](https://twitter.com/geekgonenomad)

Building the web with WebRTC. If you've ever used Amazon Mayday, or Google Hangouts you've used WebRTC. WebRTC is similar to web sockets, but uses peer-to-peer connections instead of communicating with a server.

[Apollo](https://github.com/respoke/apollo) is a JavaScript library built on [respoke](https://www.respoke.io/) that helps to handle those peer-to-peer connections. From there you can create peer-to-peer chat or video connections directly in your application.

## Async Programing in ~~ES7~~ ES2016 - [Jafar Husain](http://twitter.com/Jhusain)

How do we make async easier? What if you could write async programs without any callbacks at all? What if waiting was just as easy as creating blocking functions?

With ES2016, you can use generators to write blocking or asynchronous code exactly the same:

```javascript
async function foo() {
  var bar = await foobar();
  return bar;
}
```

Currently ES2016 is in the draft stage, but it's expected to be part of the standard.

This was a great talk that helped explain some of the features ~~ES5~~ES2015 on generators and how they differ from iterators. One great point is that iterators are used for one-way functional communication, while generators are used for two-way functional communication. By calling `result.next("value")` on a generator, you can push values to a generator function.

It's hard to explain everything in short, but Jafar has created a repository that goes into further detail on [generators, observables, and async generators](https://github.com/jhusain/asyncgenerator).

## Knitting for JavaScript - [Mariko Kosaka](https://twitter.com/kosamari)

Apparently there's a "Github" for knitters, [Ravelry](https://www.ravelry.com).

Code for knitting.

```
R0 : k5
R1-3 : k2, m1, k until 2 sts remain, m1, k2
R4 : k2, m1, k1, m1, k until 3 sts remain,
     m1, k1, m1, k2

Repeat R1-4 for 10 times
```

That looks like something that could easily be created in javascript.

Mariko took two seemingly unrelated topics and merged them together to create something amazing and fascinating. This was a great talk that helped expose how JavaScript could be used for things that no one would really expect.

Kariko plans on putting up some of her code on Github at [electroknit](https://github.com/kosamari/electroknit) and [color-mixer](https://github.com/kosamari/color-mixer).

## 30 Minutes or Less: The Magic of Automated Accessibility Testing - [Marcy Sutton](https://twitter.com/marcysutton)

What are some the the accessibility basics you should be aware of?

* Alternative text
* Document structure & hierarchy
* HTML Semantics
* Keyboard interactivity
* Color contrast
* Focus management

Let the tooling do the heavy lifting for you! Tools can help you identify some of your accessibility issues.

In Chrome Canary, you can enable [accessibility developer tools](https://github.com/GoogleChrome/accessibility-developer-tools) that will allow you to run audits on your page to help find those issues.

* [A11Y (Ally)](https://www.npmjs.com/package/a11y) - run accessibility audits against a site.
* [Protractor + Accessibility Plugin](http://marcysutton.com/angular-protractor-accessibility-plugin/) - end to end testing accessibility plugin Angular JS
