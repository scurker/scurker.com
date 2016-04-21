  var particles;
  window.onload = function() {
    var canvas = document.getElementById('particle_canvas');
    particles = new ParticleCanvas(canvas, {x: 490});
    particles.start();
  };

  var effects = {

    smoke: {
      shape: 'circle',
      velocity: new Vector({y: -0.35}),
      xVariance: 10,
      yVariance: 15,
      spawnSpeed: 1,
      generations: 100000,
      maxParticles: 5000,
      size: 16,
      sizeVariance: 10,
      life: 350,
      lifeVariance: 50,
      direction: 0,
      directionVariance: 25,
      color: '#ccc',
      opacity: 1,
      onDraw: function(p) {
        p.opacity = 0.251 - (p.age / p.life) * 0.25;
      }
    },

    explosions: {
      shape: 'square',
      velocity: new Vector({y: -1}),
      xVariance: 5,
      yVariance: 5,
      spawnSpeed: 20,
      generations: 100000,
      maxParticles: 200,
      size: 2,
      sizeVariance: 0.5,
      life: 250,
      lifeVariance: 0,
      direction: 0,
      directionVariance: 180,
      color: '#fff',
      opacity: 1,
      onDraw: function() {}
    },

    fountain: {
      shape: 'circle',
      velocity: new Vector({x: 0, y: -5}),
      xVariance: 0,
      yVariance: 0,
      spawnSpeed: 5,
      generations: 100000,
      maxParticles: 500,
      size: 8,
      sizeVariance: 6,
      life: 100,
      lifeVariance: 0,
      direction: 0,
      directionVariance: 15,
      color: '#cef',
      opacity: 1,
      onDraw: function(p) {
        p.v.add(new Vector({y: 0.1}));
        p.opacity = 1 - (p.age / p.life * 0.9);
      }
    },

    fire: {
      shape: 'circle',
      velocity: new Vector({y: -3}),
      xVariance: 20,
      yVariance: 5,
      spawnSpeed: 25,
      generations: 100000,
      maxParticles: 500,
      size: 20,
      sizeVariance: 10,
      life: 30,
      lifeVariance: 10,
      direction: 0,
      directionVariance: 15,
      color: '#cef',
      opacity: 1,
      onDraw: function(p) {
        var y = -this.age * 3;
        p.size *= 0.98;
        p.color = 'rgb(255, ' + (y + 255) + ', 68)';
        p.opacity = 0.5 - (p.age / p.life * 0.4);
      }
    },

    raindrops: {
      shape: 'circle',
      velocity: new Vector({y: 0}),
      xVariance: 200,
      yVariance: 200,
      spawnSpeed: 1,
      generations: 100000,
      maxParticles: 100,
      size: 20,
      sizeVariance: 10,
      life: 50,
      lifeVariance: 10,
      direction: 0,
      directionVariance: 15,
      color: '#cef',
      opacity: 1,
      onDraw: function(p) {
        p.size *= 0.98;
        p.opacity = 0.5 - (p.age / p.life * 0.4);
      }
    }

  };

  $.fn.toJson = function() {
    var json = {};
    $.each(this.serializeArray(), function() {
      json[this.name] = this.value !== null ? this.value : null;
    });
    return json;
  };

  $.fn.inputSlider = function(options) {
    var inputs = $(this), slider = $('<div/>');

    // Update slider control on input change
    inputs.bind('keyup change', function() {
      $(this).closest('label').find('.ui-slider').slider('value', this.value);
    });

    var options = $.extend({
      slide: function(e, ui) {
        $(ui.handle).closest('label').find('input').val(ui.value).change();
      }
    }, options);

    slider.insertAfter(inputs)
    .slider(options);

    return this;
  };

  function loadPreset(val) {
    var obj;
    if((obj = effects[val])) {
      particles.update(obj);
      for(var i in obj) {
        var value = (obj[i] instanceof Vector) ? -obj[i].y : obj[i];
        $(':input[name=' + i + ']').val(value);
      }
      $('input').change();
    }
  }

  $(document).ready(function() {

    $('#controls :input').change(function() {
      particles.update($('#controls :input').toJson());
    });

    $('select').change(function() { loadPreset(this.value); });

    $('#x-variance').inputSlider({
      range: 'min',
      min: 0,
      max: 20,
      value: 20
    });

    $('#y-variance').inputSlider({
      range: 'min',
      min: 0,
      max: 20,
      value: 5
    });

    $('#direction').inputSlider({
      range: 'min',
      min: -180,
      max: 180,
      value: 0
    });

    $('#direction-variance').inputSlider({
      range: 'min',
      min: 0,
      max: 180,
      value: 15
    });

    $('#velocity').inputSlider({
      step: 0.01,
      range: 'min',
      min: 0,
      max: 10,
      value: 3
    });

    $('#size').inputSlider({
      range: 'min',
      min: 1,
      max: 50,
      value: 10
    });

    $('#size-variance').inputSlider({
      range: 'min',
      min: 0,
      max: 50,
      value: 5
    });

    $('#spawn-speed').inputSlider({
      range: 'min',
      min: 1,
      max: 100,
      value: 25
    });

    $('#max-particles').inputSlider({
      range: 'min',
      min: 1,
      max: 1000,
      value: 500
    });

    $('#life').inputSlider({
      range: 'min',
      min: 1,
      max: 200,
      value: 30
    });

    $('#life-variance').inputSlider({
      range: 'min',
      min: 0,
      max: 200,
      value: 10
    });

  });