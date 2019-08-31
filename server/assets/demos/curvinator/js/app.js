(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (window.io) window.socket = io.connect('http://localhost:3000');

window.init = {
  tool: require('./lib/config/tool.js')
}
},{"./lib/config/tool.js":2}],2:[function(require,module,exports){
var util = require('../util/util.js'),
    colors = require('../util/colors.js'),
    Tool = require('../controllers/tool.js');

module.exports = function () {
  var w = 1280,
      h = 720;

  var tools = [];
  var $toggle = $('<select></select>');



  var singleLissajous = new Tool({
    name: 'Single Lissajous',
    width: w,
    height: h,
    background: '#6161d2',
    drawGradient: false,
    gradientStop1: '#6161d2',
    gradientStop2: '#05CA9B',
    gradientStop3: '#F3A900'
  });

  singleLissajous.setup(function(e){
    var object = require('../scene2D/singleLissajous.js');
    e.animator.setObject(new object());
  })



  var compoundLissajous = new Tool({
    name: 'Compound Lissajous',
    width: w,
    height: h,
    background: '#fff',
    drawGradient: true,
    gradientStop1: '#6161d2',
    gradientStop2: '#05CA9B',
    gradientStop3: '#F3A900'
  });

  compoundLissajous.setup(function(e){
    var object = require('../scene2D/compoundLissajous.js');
    e.animator.setObject(new object());
  })



  var pulseCurve = new Tool({
    name: 'Pulse Curve',
    width: w,
    height: h,
    background: '#fff',
    drawGradient: true,
    gradientStop1: '#6161d2',
    gradientStop2: '#05CA9B',
    gradientStop3: '#F3A900'
  });

  pulseCurve.setup(function(e){
    var object = require('../scene2D/pulseCurve.js');
    e.animator.setObject(new object());
  })



  tools.push(compoundLissajous, singleLissajous, pulseCurve  )



  // setup dom

  tools.forEach(function(t, i){
    $toggle.append('<option>' + t.params.name +'</option>');
  });

  $('body').append($toggle);

  toggleStage($toggle.val());
  $toggle.on('change', function(){
    toggleStage($toggle.val());
  });

  function toggleStage (name) {
    tools.forEach(function(t){
      t.handlePause();
      t.$el.css({
        'display':'none'
      });
    });
    var tool = _.find(tools, function(t){ return t.params.name == name});
    tool.$el.css({
      'display':'block'
    });
    tool.sizeAnimatorPreview();
  }

}
},{"../controllers/tool.js":5,"../scene2D/compoundLissajous.js":8,"../scene2D/pulseCurve.js":9,"../scene2D/singleLissajous.js":10,"../util/colors.js":11,"../util/util.js":12}],3:[function(require,module,exports){
// Controls the THREE.js rendering context, animation loop, and manages objects in the scene

var Capture = require('./capture.js');

function Animator ($viewport, $controls, params, gui) {
  this.params = params;
  this.events = {};

  this.width = params.width;
  this.height = params.height;
  this.bgColor = params.background;
  this.drawGradient = params.drawGradient;
  this.gradientStop1 = params.gradientStop1;
  this.gradientStop2 = params.gradientStop2;
  this.gradientStop3 = params.gradientStop3;

  this.capture = null;
  this.isCapturing = false;
  this.requestId = null;
  this.isPlaying = false;

  this.$viewport = $viewport;
  this.$controls = $controls;

  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');

  this.canvas.width = this.width;
  this.canvas.height = this.height;

  this.stats = new Stats();
  this.gui = new dat.GUI({ autoPlace: false });


  this.fps = 30;
  this.now;
  this.then = Date.now();
  this.interval = 1000/this.fps;
  this.delta;


  this.object = null;
}

Animator.prototype = {

  setup: function () {
    var self = this;

    this.$viewport.append( this.canvas );
    if( this.$controls ) this.$controls.find('.wrapper .stats').append( this.stats.domElement );
    if( this.$controls ) this.$controls.find('.wrapper .dat-gui').append( this.gui.domElement );


    var widthController = this.gui.add(this, 'width', 1);
    widthController.onChange(function(v){
      self.width = v;
      self.canvas.width = self.width;
      self.render();
      self.trigger('resize', [self.width, self.height])
    })
    var heightController = this.gui.add(this, 'height', 1);
    heightController.onChange(function(v){
      self.height = v;
      self.canvas.height = self.height;
      self.render();
      self.trigger('resize', [self.width, self.height])
    })

    this.addGUIColor(this, 'bgColor');

    this.addGUIValue(this, 'drawGradient');
    this.addGUIColor(this, 'gradientStop1');
    this.addGUIColor(this, 'gradientStop2');
    this.addGUIColor(this, 'gradientStop3');

  },

  setObject: function (obj) {
    var self = this;

    for(var key in obj.modelParams) {
      if (key == 'animationAxis') {
        this.addGUIValue(obj.modelParams, key, ['x', 'y']);
      } else {
        this.addGUIValue(obj.modelParams, key);
      }
    }

    for(var key in obj.layout) {
      this.addGUIValue(obj.layout, key);
    }

    for(var key in obj.colors) {
      this.addGUIColor(obj.colors, key);
    }

    this.object = obj;
    // this.gui.remember(this);
    // this.gui.remember(this.object.layout);
    // this.gui.remember(this.object.modelParams);
  },

  addGUIValue: function(owner, property, min) {
    var self = this;
    var controller = this.gui.add(owner, property, min);
    controller.onChange(function(){
      if (!self.isPlaying) self.render();
    })
  },

  addGUIColor: function(owner, property) {
    var self = this;
    var controller = this.gui.addColor(owner, property);
    controller.onChange(function(){
      if (!self.isPlaying) self.render();
    })
  },

  play: function (options) {
    this.isPlaying = true;
    if (!this.requestId) {
      this.draw(options);
    }
  },

  pause: function () {
    this.isPlaying = false;
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = undefined;
    }
  },

  draw: function (options) {
    var self = this;
    this.now = Date.now();
    this.delta = this.now - this.then;
    if (options && options.force) {
      var doForce = true;
    }

    if (this.delta > this.interval || doForce) {
      this.then = this.now - (this.delta % this.interval);

      this.update();
      this.render();
    }

    this.requestId = requestAnimationFrame(this.draw.bind(this));
    this.stats.update();
  },

  update: function () {
    this.object.update();
  },

  render: function () {
    // Store the current transformation matrix
    this.ctx.save();

    // Use the identity matrix while clearing the canvas
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Restore the transform
    this.ctx.restore();

    this.ctx.globalCompositeOperation = 'source-over';

    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fill();

    this.ctx.save();
    
    this.object.plot(this.ctx, {fill: this.bgColor});
    this.ctx.restore();

    if (this.drawGradient) {
      this.ctx.globalCompositeOperation = "screen";

      var grd = this.ctx.createLinearGradient(0, 0, this.width, 0);
      grd.addColorStop(0.1, this.gradientStop1);
      grd.addColorStop(0.45, this.gradientStop2);
      grd.addColorStop(0.9, this.gradientStop3);

      this.ctx.fillStyle = grd;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    if (this.isCapturing) {
      this.capture.emit();
    }
  },

  beginCapture: function () {
    if (this.isCapturing) return;
    this.isCapturing = true;
    this.capture = new Capture(this.$viewport.find('canvas'));
  },

  endCapture: function () {
    this.isCapturing = false;
    this.capture.end();
  },

  trigger: function (name, args) {
    if(this.events[name]) this.events[name].apply(this, args);
  },

  on: function (name, fn) {
    this.events[name] = fn;
  },

  renderSVG: function (cb) {
    var svgCtx = new C2S( this.width, this.height );

    //draw bg
    svgCtx.beginPath();
    svgCtx.rect(0, 0, this.width, this.height);
    svgCtx.fillStyle = this.bgColor;
    svgCtx.fill();

    //draw shapes
    this.object.plot(svgCtx);

    cb(svgCtx);
  }
}

module.exports = Animator;
},{"./capture.js":4}],4:[function(require,module,exports){
// Captures animation frames and manages websocket events for the editor

function Capture ($el) {
	if (!window.socket) {
		window.socket = io.connect('http://localhost:3000');
	}
	
	this.id = (new Date()).valueOf().toString();
	this.tick = 0;
	this.canvas = $el[0];
	this.start();
}

Capture.prototype = {

	start: function () {
		window.socket.emit('begin-capture', {
      id: this.id
    });
	},

	emit: function () {
		this.tick++;
    window.socket.emit('render-frame', {
      captureId: this.id,
      frame: this.tick,
      file: this.canvas.toDataURL()
    });
	},

	end: function () {
		window.socket.emit('end-capture');
	}

}

module.exports = Capture;
},{}],5:[function(require,module,exports){
var Animator = require('./animatorCanvas.js');

function Tool (params) {
  this.params = params;
  this.recordingEnabled = (window.socket) ? true : false;
  this.name = params.name;
  this.$win = $(window);
  this.$bod = $('body');
  this.$el = $('<div class="editor-view"></div>');
  this.$viewport = $('<div class="view-port"></div>');
  this.$controls = $('<div class="controls"><div class="wrapper"></div></div>');
  this.$message = $('<div class="message"></div>');

  this.$el.append(this.$viewport, this.$controls);
  this.$bod.append(this.$el);

  this.animator = new Animator(this.$viewport, this.$controls, this.params);
}

Tool.prototype = {

  setup: function (cb) {
    cb(this);
    this.init();
  },

  init: function () {
    this.renderControls();
    this.animator.setup();
    this.animator.play({force: true});
    this.animator.pause();

    this.sizeAnimatorPreview();
    this.listen();
  },

  renderControls: function () {
    this.$controls.find('.wrapper').append('<div class="stats"></div>');

    var $buttons = $('<div class="buttons"></div>'),
        s = '';
    s+= '<span class="btn play">&#9658;</span>';
    s+= '<span class="btn pause active">&#10073;&#10073;</span>';
    s+= '<span class="btn record"></span>';
    $buttons.html(s)
    $buttons.append(this.$message);

    this.$controls.find('.wrapper').append($buttons);

    var svgAbility = (this.params.disableSVG) ? 'disabled' : '';
    this.$controls.find('.wrapper').append('<span class="btn btn-block png"><span class="ico">&#8623;</span> PNG</span>');
    this.$controls.find('.wrapper').append('<span class="btn btn-block svg ' + svgAbility + '"><span class="ico">&#8623;</span> SVG</span>');

    this.$controls.find('.wrapper').append('<div class="dat-gui"></div>');
  },

  sizeAnimatorPreview: function (w, h) {
    var elHeight = window.innerHeight * 1 + 'px'
    this.$el.css({
      'height': elHeight
    });
    this.$viewport.css({
      'height': elHeight,
      'width': this.$win.width() - this.$controls.width() - 20 + 'px'
    });
    this.$controls.css({
      'height': elHeight
    });

    var viewPortW = this.$viewport.width(),
        viewPortH = this.$viewport.height(),
        viewPortAspect = viewPortW / viewPortH,
        srcW = w || this.params.width,
        srcH = h || this.params.height, 
        srcAspect = srcW / srcH,
        paddingScale = 0.90,
        resizeWidth,
        resizeHeight,
        scale;

    if (viewPortAspect > srcAspect) { // viewport is shorter than src
      resizeWidth = (viewPortH * srcAspect) * paddingScale;
      resizeHeight = viewPortH * paddingScale;

      if (resizeHeight > srcH) {
        resizeWidth = srcW;
        resizeHeight = srcH;
      }

    } else if (viewPortAspect <= srcAspect) {
      resizeWidth = viewPortW * paddingScale; // viewport is taller than src
      resizeHeight = (viewPortW / srcAspect) * paddingScale;

      if (resizeWidth > srcW) {
        resizeWidth = srcW;
        resizeHeight = srcH;
      }
    }

    scale = resizeWidth / srcW;

    TweenLite.set(this.$el.find('canvas'), {
      scaleX: scale,
      scaleY: scale,
      position: 'absolute',
      top: (viewPortH - resizeHeight) / 2 + 'px',
      left: (viewPortW - resizeWidth) / 2 + 'px',
      transformOrigin: 'top left'
    })
  },

  listen: function () {
    var self = this;

    this.$win.on({
      // 'keydown': this.handleKeyDown.bind(this),
      // 'keyup': this.handleKeyup.bind(this),
      'resize': this.handleResize.bind(this)
    });

    this.animator.on('resize', function (w, h){
      self.sizeAnimatorPreview(w, h);
    })

    // this.$viewport.find('canvas').on({
    //   'mouseover': this.handleMouseOver.bind(this),
    //   'mouseout': this.handleMouseOut.bind(this)
    // });

    this.$controls.find('.play').on('click', this.handlePlay.bind(this));
    this.$controls.find('.pause').on('click', this.handlePause.bind(this));
    this.$controls.find('.record').on('click', this.handleRecord.bind(this));

    this.$controls.find('.png').on('click', this.handlePNG.bind(this));
    this.$controls.find('.svg').on('click', this.handleSVG.bind(this));
  },

  handlePNG: function (e) {
    e.preventDefault();
    var canvas = this.$viewport.find('canvas')[0],
        data = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"),
        link = document.createElement('a');

    link.download = 'F8_' + (new Date()).valueOf().toString() +'.png';
    link.href = data;
    link.click();
  },

  handleSVG: function (e) {
    e.preventDefault();
    this.animator.renderSVG(function (ctx) {
      var svg = ctx.getSerializedSvg(true),
          b64 = Base64.encode(svg),
          link = document.createElement('a');

      link.download = 'F8_' + (new Date()).valueOf().toString() +'.svg';
      link.href = 'data:image/svg+xml;base64,\n' + b64;
      link.click();
    });
  },

  handleResize: function () {
    this.sizeAnimatorPreview();
  },

  handleMouseOver: function () {
    if (this.isPlaying) return;
    this.animator.play();
  },

  handleMouseOut: function () {
    if (this.isPlaying) return;
    this.animator.pause();
  },

  handlePlay: function () {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.clearActiveControls();
    this.$controls.find('.play').addClass('active');
    this.animator.play();
  },

  handlePause: function () {
    if (this.isPaused) return;
    this.isPlaying = false;
    this.clearActiveControls();
    this.$controls.find('.pause').addClass('active');
    this.animator.pause();
    if (this.isRecording) {
      this.$controls.find('.record').removeClass('active');
      this.animator.endCapture();
      this.isRecording = false;
      this.$message.html('');
      this.$message.removeClass('red');
    }
  },

  handleRecord: function (e) {
    var $target = $(e.target);

    if (this.isRecording) {

      $target.removeClass('active');
      if (this.recordingEnabled) {
        this.animator.endCapture();
      } 

      var self = this;
      TweenLite.to(this.$message, 0.3, {
        alpha: 0,
        onComplete: function(){
          self.$message.removeClass('red');
          self.$message.html('');
        }
      });

      this.isRecording = false;

    } else if (this.isPlaying) {

      $target.addClass('active');
      if (this.recordingEnabled) {
        this.animator.beginCapture();
        this.$message.html('Recording...');

        this.$message.addClass('red');
        TweenLite.to(this.$message, 0.3, {
          alpha: 1
        });
        
      } else {
        this.$message.html('Recording is disabled.');

        this.$message.addClass('red');
        TweenLite.to(this.$message, 0.3, {
          alpha: 1
        });
      }
      this.isRecording = true;

    } else {

      this.clearActiveControls();
      this.$controls.find('.play').addClass('active');
      this.animator.play();

      $target.addClass('active');
      if (this.recordingEnabled) {
        this.animator.beginCapture();
        this.$message.html('Recording...');

        this.$message.addClass('red');
        TweenLite.to(this.$message, 0.3, {
          alpha: 1
        });

      } else {
        this.$message.html('Recording is disabled.');
        
        this.$message.addClass('red');
        TweenLite.to(this.$message, 0.3, {
          alpha: 1
        });
      } 
      this.isRecording = true;

    }
  },

  clearActiveControls: function () {
    this.$controls.find('.active').removeClass('active');
  }


};

module.exports = Tool;
},{"./animatorCanvas.js":3}],6:[function(require,module,exports){
var util = require('../util/util.js');

module.exports =  function plotEllipse(ctx, x, y, w, h, r, sw, sc) {

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(util.radians(r));
  ctx.beginPath();
  drawEllipseByCenter(ctx, 0, 0, w, h );
  ctx.strokeStyle = sc;
  ctx.lineWidth = sw;
  ctx.stroke();
  ctx.restore();

}

function drawEllipseByCenter (ctx, cx, cy, w, h) {
  drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
}

function drawEllipse(ctx, x, y, w, h) {
  var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
}
},{"../util/util.js":12}],7:[function(require,module,exports){
// Model for a Lissajous curve

var util = require('./../util/util.js');

function Lissajous (params) {
  this.setParams(params);
}

Lissajous.prototype.setParams = function (params) {
  this.aX = params.aX;
  this.bX = params.bX;
  this.aY = params.aY;
  this.bY = params.bY;
  this.aPhi = params.phiOffsetX || 0;
  this.bPhi = params.phiOffsetY || 0;
  this.speed = params.speed;
  this.pointCount = params.pointCount || 300;
  this.animationAxis = params.animationAxis;


  this.pi = Math.PI * 1;
  if (params.pi) {
    this.pi = Math.PI * params.pi;
  }
}

Lissajous.prototype.calc = function () {
  var c = [], angle, x, y, z = 0;
  var pCount = (this.pointCount < 1) ? 1 : this.pointCount;

  for (var i = 0; i < pCount; i++) {
    angle = util.map(i, 0, this.pointCount, 0, this.pi);
    x = Math.sin(angle * this.aX + util.radians(this.aPhi)) * Math.cos(angle * this.bX);
    y = Math.sin(angle * this.aY + util.radians(this.bPhi)) * Math.cos(angle * this.bY);


    c.push([y, x]);
  }

  return c;
}

module.exports = Lissajous;
},{"./../util/util.js":12}],8:[function(require,module,exports){
// Rotating set of Lissajous curve objects

var SingleCurve = require('./singleLissajous.js');


function CompoundCurve (params) {

  this.modelParams = {
    curveAmount: 30,
    aX: 1,
    bX: 9,
    aY: 1,
    bY: 1,
    phiOffsetX: 0,
    phiOffsetY: 0,
    pi: 1,
    animationAxis: 'x',
    animationSpeed: 0.5
  };

  this.layout = {
    spacing: 4,
    strokeWidth: 1.3,
    scaleX: 1530,
    scaleY: 80,
    xTranslate: 590,
    yTranslate: 310,
  };

  this.colors = {
    strokeColor: '#000'
  };

  this.curves = [];
  for (var i = 0; i < this.modelParams.curveAmount; i++) {
    this.curves.push(new SingleCurve());
  }

}

CompoundCurve.prototype = {

  update: function () {
    if (this.modelParams.animationAxis == 'y') {
      this.modelParams.phiOffsetY += this.modelParams.animationSpeed;
    } else {
      this.modelParams.phiOffsetX += this.modelParams.animationSpeed;
    }
  },

  checkCurveAmount: function () {
    var modelAmt = this.modelParams.curveAmount,
        actualAmt = this.curves.length;
    if (modelAmt < actualAmt) { //remove curves
      var diff = actualAmt - modelAmt;
      this.curves.splice(actualAmt - modelAmt, diff);
    }
    if (modelAmt > actualAmt) { //add curves
      var diff = modelAmt - actualAmt;
      for (var i = 0; i < diff; i++) {
        this.curves.push(new SingleCurve());
      }
    }
  },

  plot: function (ctx) {
    console.log()
    this.checkCurveAmount();

    var c = ctx || this.ctx;
    c.globalCompositeOperation = "multiply";

    for (var i = 0; i < this.curves.length; i++) {
      var curve = this.curves[i];
      curve.layout = null;
      curve.layout = this.layout;
      curve.colors = null;
      curve.colors = this.colors;

      var params = {};
      params.aX = this.modelParams.aX;
      params.bX = this.modelParams.bX;
      params.aY = this.modelParams.aY;
      params.bY = this.modelParams.bY;
      params.phiOffsetX = this.modelParams.phiOffsetX;
      params.phiOffsetY = this.modelParams.phiOffsetY;
      params.pi = this.modelParams.pi;
      params.animationAxis = this.modelParams.animationAxis;
      params.animationSpeed = this.modelParams.animationSpeed;

      if (params.animationAxis == 'y') {
        params.phiOffsetY += i * this.layout.spacing;
      } else {
        params.phiOffsetX += i * this.layout.spacing;
      }

      curve.setModelParams(params);

      curve.plot(c, {fill: '#fff'});
    }
  }

}

module.exports = CompoundCurve;
},{"./singleLissajous.js":10}],9:[function(require,module,exports){
// Single rotating Lissajous curve object

var plotEllipse = require('../geom/ellipse.js')
var util = require('../util/util.js');


function PulseCurve (params) {
  this.delta = 0;

  this.modelParams = {
    numCircles: 100,
    speed: 0.3,
    rotation: 0.12,
    ellipseLength: 0.4,
    // doFeather: true,
  };

  this.layout = {
    strokeWidth: 1,
    originX: 300,
    originY: 300,
    spacing: 10
  };

  this.colors = {
    strokeColor: '#000',
  };
}

PulseCurve.prototype = {

  update: function () {
    this.delta += this.modelParams.speed;
    var max = (this.modelParams.numCircles * this.layout.spacing);
    if (this.delta > max) this.delta = 0;
  },

  plot: function (ctx) {
    var ellipses = this.calc();

    for (var i = 0; i < ellipses.length; i++) {
      var e = ellipses[i];
      plotEllipse(ctx, this.layout.originX, this.layout.originY, e[0], e[1], e[2], this.layout.strokeWidth, this.colors.strokeColor);
    }

  },

  calc: function () {
    //ellipse ~= [width, height, rotation]
    var min = 0,
        max = (this.modelParams.numCircles * this.layout.spacing),
        ellipses = [];

    for (var i=0; i < this.modelParams.numCircles; i++) {
      var width = (i * this.layout.spacing) + this.delta;

      if (width > max) width = width - max;
      if (width < min) width = min - width;

      var height = width * this.modelParams.ellipseLength;
      var rotation = width * this.modelParams.rotation;

      ellipses.push([ width, height, rotation ]);
    }

    return ellipses;
  }

}

module.exports = PulseCurve;
},{"../geom/ellipse.js":6,"../util/util.js":12}],10:[function(require,module,exports){
// Single rotating Lissajous curve object

var Lissajous = require('../geom/lissajous.js');
var util = require('../util/util.js');


function Curve (params) {

  this.modelParams = {
    aX: 1,
    bX: 7,
    aY: 7,
    bY: 1,
    phiOffsetX: 0,
    phiOffsetY: 0,
    pi: 1,
    animationAxis: 'x',
    animationSpeed: 0.5
  };

  this.layout = {
    strokeWidth: 2,
    scaleX: 250,
    scaleY: 250,
    xTranslate: 590,
    yTranslate: 310,
  };

  this.colors = {
    strokeColor: '#fff'
  };

  this.model = new Lissajous(this.modelParams);
  this.ctx = null;
}

Curve.prototype = {

  update: function () {
    if (this.modelParams.animationAxis == 'y') {
      this.modelParams.phiOffsetY += this.modelParams.animationSpeed;
    } else {
      this.modelParams.phiOffsetX += this.modelParams.animationSpeed;
    }
  },

  plot: function (ctx, options) {
    var c = ctx || this.ctx;
    this.model.setParams(this.modelParams);
    var points = this.model.calc(),

    //plot curve to size of canvas
    scaleX = this.layout.scaleX,
    scaleY = this.layout.scaleY,
    xTransform = this.layout.xTranslate,
    yTransform = this.layout.yTranslate;

    c.beginPath();
    x1 = points[0][0] * scaleX + xTransform; 
    y1 = points[0][1] * scaleY + yTransform;
    c.moveTo(x1, y1);

    var p, pi, xc, yc;
    for (i = 1, il = points.length; i < il - 1; i ++) {
      p = points[i];
      pi = points[i + 1];
      x1 = p[0] * scaleX + xTransform;
      y1 = p[1] * scaleY + yTransform;
      xc = ((p[0] + pi[0]) / 2) * scaleX + xTransform;
      yc = ((p[1] + pi[1]) / 2) * scaleY + yTransform;
      c.quadraticCurveTo(x1, y1, xc, yc);
    }
    // curve through the last two points
    x1 = p[0] * scaleX + xTransform;
    y1 = p[1] * scaleY + yTransform;
    x2 = points[0][0] * scaleX + xTransform;
    y2 = points[0][1] * scaleY + yTransform;
    c.quadraticCurveTo(x1, y1, x2, y2);

    // c.closePath();

    if (options && options.fill) {
      c.fillStyle = options.fill;
      c.fill();
    } else {
      c.fillStyle = 'rgba(255, 255, 255, 0)';
      c.fill();
    }

    c.lineWidth = this.layout.strokeWidth;
    c.strokeStyle = this.colors.strokeColor;
    c.stroke();
  },

  setModelParams: function (params) {
    this.modelParams.aX = params.aX;
    this.modelParams.bX = params.bX;
    this.modelParams.aY = params.aY;
    this.modelParams.bY = params.bY;
    this.modelParams.phiOffsetX = params.phiOffsetX;
    this.modelParams.phiOffsetY = params.phiOffsetY;
    this.modelParams.pi = params.pi;
    this.modelParams.animationAxis = params.animationAxis;
    this.modelParams.animationSpeed = params.animationSpeed;
  }

}

module.exports = Curve;
},{"../geom/lissajous.js":7,"../util/util.js":12}],11:[function(require,module,exports){
module.exports = {
	'navy': 'rgb(6, 33, 61)',
	'blue': 'rgb(66, 177, 202)',
	'green': 'rgb(37, 154, 128)',
	'yellow': 'rgb(244, 207, 30)',
	'red': 'rgb(212, 31, 67)',

	'white': 'rgb(255, 255, 255)',
	'black': 'rgb(0, 0, 0)',

	'darkGreen': 'rgb(23, 138, 114)'
};
},{}],12:[function(require,module,exports){
var util = {

	map: function (value, istart, istop, ostart, ostop) {
	    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
	},
	
	radians: function (aAngle) {
	  return (aAngle / 180) * Math.PI;
	},
	
	queue: function(q, result) {
	  if (q.length) {
	    q.shift()(function() {
	      return util.queue(q, result);
	    });
	  } else {
	    return result();
	  }
	},

	toRGBA: function (rgb, a) {
		str = rgb.slice(3).replace('(', '').replace(')', '');
		str += ',' + a;
		str = 'rgba(' + str + ')';
		return str;
	}
	
}

module.exports = util;
},{}]},{},[1]);
