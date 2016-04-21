/*
 * Vector math functions
 *
 * Copyright (c) 2010 Jason Wilson, http://scurker.com
 *
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

var Vector = function(p) {
  p = extend({x: 0, y: 0}, p);
  this.x = p.x;
  this.y = p.y;
  return this;
};

Vector.prototype = {

  add: function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  },

  clone: function() {
    return new Vector({x: this.x, y: this.y});
  },

  distance: function(v) {
    var x = this.x - v.x,
        y = this.y - v.y;
    return Math.sqrt(x * x + y * y);
  },

  length: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },

  points: function(p) {
    if(p === undefined) return {x: this.x, y: this.y};
    p = extend(this.p, p);
    this.x = p.x;
    this.y = p.y;
    return this;
  },

  rotate: function(rad) {
    var cos = Math.cos(rad), sin = Math.sin(rad), x = this.x, y = this.y;
    this.x = x * cos - y * sin;
    this.y = x * sin + y * cos;
    return this;
  },

  subtract: function(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

};