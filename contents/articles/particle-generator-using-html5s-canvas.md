---
title: "Particle Generator using HTML5's Canvas"
date: 2010-06-04
---

Particle effects are pretty awesome. Particles by themselves are fairly simple, but by generating multitudes of particles with set variables you can create a range of effects such as fire, smoke, or water. A particle generator or emitter allows you to adjust the variables giving you control over the types of effects you can generate.

<a href="/projects/particles"><img class="alignleft" src="/images/particles.png" alt="Particle Generator" title="Particle Generator"/></a>I've been working on another project that needed a particle generator, thus this demonstration was born.

There are several presets I've included, but you can easily generate new types of effects by playing around with the available variables on the presets.

The demo does not give you access to everything so in order to create more fine tuned options, here's all the currently available variables:

```javascript
{
  shape: 'circle',      // square or circle
  velocity: new Vector({y: -1}),  // movement vector; only y is used
  xVariance: 0,       // +/- start x position (random)
  yVariance: 0,       // +/- start y position (random)
  spawnSpeed: 25,     // # particles spawned per cycle
  generations: 100000,      // # of cycles to run for
  maxParticles: 500,      // max # of particles allowed on screen
  size: 20,       // size of particles
  sizeVariance: 5,      // +/- size of particles (random)
  life: 30,       // # of cycles a particle can live
  lifeVariance: 10,         // +/- lifetime of particle (random)
  direction: 0,       // initial start direction
  directionVariance: 15,          // +/- direction (random)
  color: '#fff',      // can be hex code or rgb
  opacity: 1,       // particle opacity
  onDraw: function(p) {
    // onDraw passes in the current particle and is called before each
    // particle is displayed on the screen. This function is used in
    // several of the presets to adjust the color or opacity given
    // the particle's current age and lifespan.
  }
}
```

If you are using Firefox and Firebug, you can create your own objects and update the particle generator by using <code>particles.update(myObject);</code> via the command line.

As usual, HTML5 and Canvas is not currently supported by IE7/IE8, so you'll need to use another browser in order for this to work. The demo has been tested in Firefox, Safari and Chrome, but I highly recommend using Chrome for the demo as it seems to run the most efficient.

<a href="/projects/particles">On to the demo!</a> Or alternatively, view the source <a href="/projects/particles/js/particle.js">here</a>.