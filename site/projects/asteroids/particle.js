/*
 * Javascript/HTML5 Particle Generator v0.1
 * http://scurker.com/projects/particles
 *
 * Copyright (c) 2010 Jason Wilson, http://scurker.com
 *
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Extend an object and its properties
 * Idea mainly from jQuery's extend method
 */
function extend() {
  var target = arguments[0], length = arguments.length, i = 1, options;

  if(typeof target !== 'object' && toString.call(target) == "[object Function]")
    target = {};

  for(; i < length; i++) {
    if((options = arguments[i]) != null) {
      for(var name in options) {
        var src = target[name], copy = options[name];
        if(copy !== undefined)
          target[name] = copy;
      }
    }
  }

  return target;
}

var ParticleGenerator = function(options) {
  var options = extend({
    shape: 'square',
    velocity: new Vector({y: -1}),
    xVariance: 0,
    yVariance: 0,
    spawnSpeed: 1,
    generations: 100,
    maxParticles: 5,
    size: 1,
    sizeVariance: 1,
    life: 10,
    lifeVariance: 5,
    direction: 0,
    directionVariance: 0,
    color: '#fff',
    opacity: 1
  }, options);

  this.p = options.position;
  this.v = options.velocity;
  this.options = options;
  this.active = true;
  this.age = 0;
  this.particles = [];

  return this;
};

ParticleGenerator.prototype = {

  update: function() {

    // Check to see if we've reached the max # of generation cycles
    if(this.options.generations != -1) {
      if(this.particles.length == 0 && this.options.generations <= this.age) this.active = false;
      this.age++;
    }

    // Update any existing particles; check for dead particles
    for(var i in this.particles) {
      var particle = this.particles[i];
      if(particle.active === false) {
        this.particles.splice(i, 1);
      } else {
        particle.update();
      }
    }

    // Generate # (spawnSpeed) of particles for this update iteration
    // as long as we haven't reached the max # of particles
    for(var spawned = 0; spawned < this.options.spawnSpeed; spawned++) {
      if(this.particles.length >= this.options.maxParticles || this.options.generations <= this.age) {
        return;
      }
      this.particles.push(new Particle(this.options));
    }
  },

  draw: function(ctx) {
    for(var i in this.particles) {
      this.particles[i].draw(ctx);
    }
  },

};

var Particle = function(options) {

  // output a random variance number
  var rand = function(num) { return (Math.random() * num << 1) - num; };

  // Set the initial position variance
  var position = new Vector({x: rand(options.xVariance), y: rand(options.yVariance)});

  // Set the initial particle directional heading
  var direction = options.direction + rand(options.directionVariance);

  extend(this, options, {
    p: options.position.clone().add(position),
    v: options.velocity.clone().rotate(direction * Math.PI/180),
    age: 0,
    life: options.life + rand(options.lifeVariance),
    size: options.size + rand(options.sizeVariance),
    active: true
  });

  return this;
};

Particle.prototype = {

  update: function() {
    if(this.age >= this.life) this.active = false;
    this.p.add(this.v.clone());
    this.age++;
  },

  draw: function(ctx) {
    if(typeof this.onDraw === 'function') this.onDraw(this);
    ctx.save();
    ctx.fillStyle = this.color;
    try {
      ctx.globalAlpha = this.opacity;
    } catch(ex) {
      console.debug(ex);
    }
    ctx.translate(this.p.x, this.p.y);

    switch(this.shape) {
      case 'square':
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
      break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI/180, true);
        ctx.closePath();
        ctx.fill();
      break;
    }

    ctx.restore();
  }

};