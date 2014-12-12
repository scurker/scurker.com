var asteroids;

window.addEventListener('load', function() {
  var canvas = document.getElementById('asteroids');
  asteroids = new Asteroids(canvas);
  asteroids.start();
}, false);

var Game = function() {
  window.addEventListener('keydown', this.onKeyDown, false);
  window.addEventListener('keyup', this.onKeyUp, false);
};

(function() {

  // Used for class inheritance
  Game.extend = function(base, _super, options) {

    var prototype = new _super;
    prototype._super = _super;

    for(var name in options) {
      prototype[name] = options[name];
    }

    base.prototype = prototype;
    base.constructor = base;

    return base;
  };

  Game.isFunction = function(fn) {
    return toString.call(fn) == "[object Function]";
  };

  Game.keys = {
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  };

  Game.input = [];
  Game.debug = false;

  Game.prototype = {

    actors: [],
    input: {},
    frameRate: 60,
    frameCount: 0,

    start: function() {
      var game = this;
      this.interval = setInterval(function() { game.tick(); }, 1000/this.frameRate);
    },

    pause: function() {
      if(this.interval) {
        clearInterval(this.interval);
      } else {
        this.start();
      }
    },

    update: function() {
      for(var i in this.actors) {
        var actor = this.actors[i];
        actor.update();

        if(actor.active === false) {
          this.actors.splice(i, 1);
          continue;
        }

        if(actor.p.x > this.width) {
          actor.p.x = 0;
        } else if(actor.p.y > this.height) {
          actor.p.y = 0;
        } else if(actor.p.y < 0) {
          actor.p.y = this.height;
        } else if(actor.p.x < 0) {
          actor.p.x = this.width;
        }
      }
    },

    draw: function() {
      if(this._draw) this._draw(this.ctx);
      for(var i in this.actors) {
        this.actors[i].draw(this.ctx);
      }
    },

    fps: function() {
      var now = new Date().getTime();
      if(!this.frames || this.frames == 50) {
        var millis = now - this.lastFps;
        var fps = Math.floor(50 / millis * 1000);
        fps = isNaN(fps) ? 0 : fps;
        var el = document.getElementById('fps');
        el.innerHTML = 'FPS: ' + fps;
        this.frames = 0;
        this.lastFps = 0;
      }
      if(this.frames == 0) {
        this.lastFps = now;
      }
      this.frames++;
    },

    tick: function() {
      this.fps();
      this.update();
      this.draw();
      this.detectPlayerBulletCollision();
      this.detectPlayerAsteroidCollision();

      this.frameCount++;
    },

    onKeyDown: function(e) {
      for(var i in Game.keys) {
        if(Game.keys[i] == e.keyCode) {
          Game.input[i] = true;
        }
      }
    },

    onKeyUp: function(e) {
      for(var i in Game.keys) {
        if(Game.keys[i] == e.keyCode) {
          Game.input[i] = false;
        }
      }
      if(e.shiftKey && e.which == 68)
        Game.debug = !Game.debug;
    }

  };

  /**
   * Actor Class
   *
   * Actors have an x, y position on the screen and a vector that determines
   * the actor's direction and speed per frame.
   *
   * @param p - position vector w/ coordinates, i.e. {x: 0, y: 0}
   * @param v - directional vector w/ coordinates, i.e. {x: 0, y: 0}
   */
  Game.Actor = function(p, v) {

    // Set actor position vector
    this.p = extend(new Vector({x: 0, y: 0}), p);

    // Set actor velocity vector
    this.v = extend(new Vector({x: 0, y: 0}), v);

    return this;
  };

  Game.Actor.prototype = {

    // abstract methods
    draw: function() {},
    update: function() {},

    // actor position vector
    p: function(p) {
      return p === undefined ? this.p : extend(this.p, p);
    },

    // actor velocity vector
    v: function(v) {
      return v === undefined ? this.v : extend(this.v, v);
    }

  };

})();

function Asteroids(canvas) {
  if(!canvas) return;

  this.ctx = canvas.getContext('2d');
  this.height = canvas.height;
  this.width = canvas.width;

  // Set the player
  this.player = new Asteroids.Player(new Vector({x: this.width/2, y: this.height/2}), new Vector(), 0);
  this.actors.push(this.player);

  // Sets the asteroid count
  for(var i = 0; i < 4; i++) {
    var asteroid = new Asteroids.Asteroid(new Vector({x: Math.random() * this.width, y: Math.random() * this.height}), 1);
    this.actors.push(asteroid);
    this.enemies.push(asteroid);
  }

  return this;
};

(function() {

  Game.extend(Asteroids, Game, {

    player: null,
    playerBullets: [],
    enemies: [],
    enemyBullets: [],

    _draw: function(ctx) {
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.stroke();
      ctx.save();
    },

    asteroid_ids: [
      { // asteroid definition 0
        boundry: 28,
        coordinates: [
          [-24, -27], [-28, -3], [-12, 6], [-18, 22],
          [-11, 27], [12, 21], [29, 12], [27, -12],
          [9, -22], [-15, -27]
        ]
      },
      { // asteroid definition 1
        boundry: 28,
        coordinates: [
          [-18, -20], [-28, 4], [-11, 14], [-9, 30],
          [25, 22], [30, 9], [21, -15], [9, -24]
        ]
      },
      { // asteroid definition 2
        boundry: 27,
        coordinates: [
          [-6, -27], [-6, -13], [-16, -9], [-21, 12],
          [-5, 27], [15, 29], [28, 9], [9, 3],
          [25, -8], [12, -27]
        ]
      },
      { // asteroid definition 3
        boundry: 27,
        coordinates: [
          [-12, -18], [-24, 6], [-15, 16], [-17, 30],
          [9, 26], [6, 12], [27, 7], [24, 0],
          [27, -19], [6, -23], [-4, -21]
        ]
      },
      { // asteroid definition 4
        boundry: 28,
        coordinates: [
          [-9, -27], [-24, -12], [-8, 1], [-18, 15],
          [-15, 30], [6, 27], [12, 17], [26, 5],
          [25, -4], [30, -15], [25, -21]
        ]
      }
    ],

    detectPlayerAsteroidCollision: function() {
      var player = this.player;
      for(var i in this.enemies) {
        var enemy = this.enemies[i];
        if(player.p.distance(enemy.p) < (player.radius + enemy.radius)) {
            if(player.dead) {
              Game.player = null;
              for(var i in this.actors) {
                if(this.actors[i] instanceof Asteroids.Player) {
                  this.actors.splice(i, 1);
                }
              }
              break;
            }

            // Create explosion!
            var options = {
              shape: 'square',
              position: player.p.clone(),
              velocity: new Vector({y: -1}),
              xVariance: 3,
              yVariance: 3,
              spawnSpeed: 3,
              generations: 20, // was 25
              maxParticles: 15,
              size: 4,
              sizeVariance: 1,
              life: 50,
              lifeVariance: 10,
              direction: 0,
              directionVariance: 180,
              color: '#fff',
              opacity: 1
            };
            var particles = new ParticleGenerator(options);
            this.actors.push(particles);

            player.dead = true;
        }
      }
    },

    detectPlayerBulletCollision: function() {
      for(var i in this.playerBullets) {
        var bullet = this.playerBullets[i];
        if(bullet.active == false) {
          this.playerBullets.splice(i, 1);
          continue;
        }

        for(var i in this.enemies) {
          var enemy = this.enemies[i];
          if(enemy.active == false) {
            this.enemies.splice(i, 1);
            continue;
          }
          if(bullet.p.distance(enemy.p) < enemy.radius) {

            enemy.active = false;
            bullet.active = false;

            // Create explosion!
            var options = {
              shape: 'square',
              position: enemy.p.clone(),
              velocity: new Vector({y: -3}),
              xVariance: 0,
              yVariance: 0,
              spawnSpeed: 2,
              generations: 250, // was 25
              maxParticles: 10,
              size: 2,
              sizeVariance: 0,
              life: 40,
              lifeVariance: 10,
              direction: 0,
              directionVariance: 180,
              color: '#fff',
              opacity: 1
            };
            var particles = new ParticleGenerator(options);
            this.actors.push(particles);

            // Spawn astroidlets
            if(enemy.scale >= 0.37) {
              for(var i = 0; i < 2; i++) {
                var asteroidlet = new Asteroids.Asteroid(enemy.p.clone(), enemy.scale * 0.6);
                this.actors.push(asteroidlet);
                this.enemies.push(asteroidlet);
              }
            }
          }
        }
      }
    },

  });

  /**
   * The Player
   *
   * @param p - position coordinates, i.e. {x: 0, y: 0}
   * @param v - directional vector
   * @param h - current heading
   */
  Asteroids.Player = function(p, v, h) {
    this._super.apply(this, arguments);
    this.heading = typeof h === 'number' ? h : 0;
    this.radius = 8; // used for collision
    return this;
  };

  // Set some options
  Game.extend(Asteroids.Player, Game.Actor, {

    MAX_VELOCITY: 15,    // max speed per frame
    HEIGHT: 26,          // ship height
    WIDTH: 18,           // ship width
    BULLET_RECHARGE: 15, // frames between bullets
    HYPER_RECHARGE: 15,  // frames between hyperspace

    fired: 0,     // last frame on bullet was fired
    hyper: 0,     // last frame hyperspace was activated
    dead: false,  // player has died, oh noes!

    draw: function(ctx) {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#fff';
      ctx.translate(this.p.x, this.p.y);
      ctx.rotate(this.heading * Math.PI/180);
      ctx.beginPath();
      ctx.moveTo(-this.WIDTH/2, this.HEIGHT/2);
      ctx.lineTo(0, -this.HEIGHT/2);
      ctx.lineTo(this.WIDTH/2, this.HEIGHT/2);
      ctx.lineTo(this.WIDTH/3, this.HEIGHT/2.75);
      ctx.lineTo(-this.WIDTH/3, this.HEIGHT/2.75);
      ctx.lineTo(-this.WIDTH/2, this.HEIGHT/2);
      ctx.stroke();
      ctx.restore();

      if(Game.debug === true) {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.strokeStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.restore();
      }

      if(this.particleGenerator) {
        this.particleGenerator.draw(ctx);
      }
    },

    update: function() {
      this.p = this.p.add(this.v);

      if(Game.input.LEFT) {
        this.heading -= 4;
      }
      if(Game.input.RIGHT) {
        this.heading += 4;
      }
      if(Game.input.UP) {
        this.thrust();
      }
      if(Game.input.DOWN) {
        this.hyperspace();
      }
      if(Game.input.SPACE) {
        this.fire();
      }
    },

    hyperspace: function() {

      if(asteroids.frameCount - this.hyper >= this.HYPER_RECHARGE) {
        this.hyper = asteroids.frameCount;
        var x = Math.random() * asteroids.width;
        var y = Math.random() * asteroids.height;
        this.p = new Vector({x: x, y: y});
        this.v = new Vector(); // set thrust to 0
      }

      return this;
    },

    fire: function() {
      if(asteroids.frameCount - this.fired >= this.BULLET_RECHARGE) {
        this.fired = asteroids.frameCount;

        // approximate the front point of the ship
        var point = this.p.clone().add(new Vector({y: -14.5}).rotate(this.heading * Math.PI/180));

        var bullet = new Asteroids.Bullet(point, new Vector({y: -7.5}).rotate(this.heading * Math.PI/180), this.heading);
        asteroids.actors.push(bullet);
        asteroids.playerBullets.push(bullet);
      }
      return this;
    },

    thrust: function() {
      var thrust = new Vector({x: 0, y: -0.1}).rotate(this.heading * Math.PI/180);
      if(this.v.clone().add(thrust).length() <= this.MAX_VELOCITY) {
        this.v.add(thrust);
      }

      if(!this.particleGenerator) {
        var particleOptions = {
          //position: new Vector({x: this.width/2, y: this.height/2 + 9}),
          position: new Vector({x: 250, y: 250}),
          velocity: new Vector({x: 0, y: 1}),
          xVariance: 3,
          yVariance: 0,
          spawnSpeed: 2,
          generations: 10000000,
          maxParticles: 50,
          size: 2,
          life: 10,
          lifeVariance: 5,
          direction: 0,
          directionVariance: 10,
          color: '#fff'
        }
        this.particleGenerator = new ParticleGenerator(particleOptions);
      }

      return this;
    }

  });

  /**
   * An asteroid
   *
   * @param p - position coordinates, i.e. {x: 0, y: 0}
   * @param s - asteroid scale - from 0 to 1
   */
  Asteroids.Asteroid = function(p, s) {
    // validate scale
    s = (s > 1 || s < 0) ? 1 : s;

    // Insert a random velocity based on scale
    arguments = [].splice.call(arguments, 0);
    arguments.splice(1, 0, new Vector({y: -0.25 - Math.random() * 1 / s}).rotate(Math.random() * 360 * Math.PI/180));

    this._super.apply(this, arguments);
    this.id = Math.ceil(Math.random() * 5) - 1;
    this.scale = s;
    this.radius *= this.scale;
    this.rotate = (Math.random() - 0.5) * 3;

    return this;
  };

  Game.extend(Asteroids.Asteroid, Game.Actor, {

    id: 0,
    spin: 0,
    radius: 30,

    draw: function(ctx) {
      this.spin += this.rotate;
      ctx.save();

      // Get the associated asteroid mapping
      var map = asteroids.asteroid_ids[this.id].coordinates;

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#fff';
      ctx.translate(this.p.x, this.p.y);
      ctx.rotate(this.spin * Math.PI/180);
      ctx.beginPath();
      ctx.moveTo(map[0][0] * this.scale, map[0][1] * this.scale);
      var i = 1;
      for(; i < map.length; i++) {
        ctx.lineTo(map[i][0] * this.scale, map[i][1] * this.scale);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      if(Game.debug === true) {
        ctx.save();
        ctx.translate(this.p.x, this.p.y);
        ctx.strokeStyle = '#f00';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * this.scale, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.restore();
      }

    },

    update: function() {
      this.p.add(this.v);
    }
  });

  /**
   * Player bullet
   */
  Asteroids.Bullet = function(p, v, h) {
    this._super.apply(this, arguments);
    this.heading = h;
    return this;
  };
  Game.extend(Asteroids.Bullet, Game.Actor, {

    life: 40,
    active: true,
    size: 2,

    draw: function(ctx) {
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.translate(this.p.x, this.p.y);
      ctx.rotate(this.heading * Math.PI/180);
      ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
      ctx.restore();
    },

    update: function() {
      this.p = this.p.add(this.v);
      if(this.life == 0) this.active = false;
      this.life--;
    }

  })

})();