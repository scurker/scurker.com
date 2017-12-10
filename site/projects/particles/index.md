---
layout: empty
title: "HTML5 Particle Generator"
---

<link rel="stylesheet" href="particle.css"/>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
<script src="particle.js"></script>
<script src="particle-helper.js"></script>
<div id="particle_container">
  <div id="controls">
    <ul>
      <li>
        <div class="half">
          <label><input type="radio" name="shape" value="square"/> Square</label>
        </div>
        <div class="half">
          <label><input type="radio" name="shape" value="circle" checked="checked"/> Circle</label>
        </div>
      </li>
      <li>
        <label>Direction: <input id="direction" name="direction" value="0"/></label>
      </li>
      <li>
        <label>Direction Variance: <input id="direction-variance" name="directionVariance" value="15"/></label>
      </li>
      <li>
        <label>Velocity: <input id="velocity" name="velocity" value="3"/></label>
      </li>
      <li>
        <div class="half">
          <label>X Variance: <input id="x-variance" name="xVariance" size="2" value="20"/></label>
        </div>
        <div class="half">
          <label>Y Variance: <input id="y-variance" name="yVariance" size="2" value="5"/></label>
        </div>
      </li>
      <li>
        <div class="half">
          <label>Size: <input id="size" name="size" value="20" size="2"/></label>
        </div>
        <div class="half">
          <label>Size Variance: <input id="size-variance" name="sizeVariance" size="2" value="5"/></label>
        </div>
      </li>
      <li>
        <div class="half">
          <label>Life: <input id="life" name="life" size="2" value="30"/></label>
        </div>
        <div class="half">
          <label>Life Variance: <input id="life-variance" name="lifeVariance" size="2" value="10"/></label>
        </div>
      </li>
      <li>
        <label>Spawn Speed: <input id="spawn-speed" name="spawnSpeed" value="25"/></label>
      </li>
      <li>
        <label>Max Particles: <input id="max-particles" name="maxParticles" value="500"/></label>
      </li>
      <li>
        <label>Presets:
          <select>
            <option value="fire">Fire</option>
            <option value="smoke">Smoke</option>
            <option value="fountain">Fountain</option>
            <option value="explosions">Explosions</option>
            <option value="raindrops">Raindrops</option>
          </select>
        </label>
      </li>
    </ul>
  </div>
  <canvas id="particle_canvas" height="500" width="700">Your browser lacks canvas support.</canvas>
</div>