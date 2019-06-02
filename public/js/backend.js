(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/backend"],{

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/pace/pace.js":
/*!***********************************!*\
  !*** ./node_modules/pace/pace.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function() {
  var AjaxMonitor, Bar, DocumentMonitor, ElementMonitor, ElementTracker, EventLagMonitor, Evented, Events, NoTargetError, Pace, RequestIntercept, SOURCE_KEYS, Scaler, SocketRequestTracker, XHRRequestTracker, animation, avgAmplitude, bar, cancelAnimation, cancelAnimationFrame, defaultOptions, extend, extendNative, getFromDOM, getIntercept, handlePushState, ignoreStack, init, now, options, requestAnimationFrame, result, runAnimation, scalers, shouldIgnoreURL, shouldTrack, source, sources, uniScaler, _WebSocket, _XDomainRequest, _XMLHttpRequest, _i, _intercept, _len, _pushState, _ref, _ref1, _replaceState,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  defaultOptions = {
    catchupTime: 100,
    initialRate: .03,
    minTime: 250,
    ghostTime: 100,
    maxProgressPerFrame: 20,
    easeFactor: 1.25,
    startOnPageLoad: true,
    restartOnPushState: true,
    restartOnRequestAfter: 500,
    target: 'body',
    elements: {
      checkInterval: 100,
      selectors: ['body']
    },
    eventLag: {
      minSamples: 10,
      sampleCount: 3,
      lagThreshold: 3
    },
    ajax: {
      trackMethods: ['GET'],
      trackWebSockets: true,
      ignoreURLs: []
    }
  };

  now = function() {
    var _ref;
    return (_ref = typeof performance !== "undefined" && performance !== null ? typeof performance.now === "function" ? performance.now() : void 0 : void 0) != null ? _ref : +(new Date);
  };

  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  if (requestAnimationFrame == null) {
    requestAnimationFrame = function(fn) {
      return setTimeout(fn, 50);
    };
    cancelAnimationFrame = function(id) {
      return clearTimeout(id);
    };
  }

  runAnimation = function(fn) {
    var last, tick;
    last = now();
    tick = function() {
      var diff;
      diff = now() - last;
      if (diff >= 33) {
        last = now();
        return fn(diff, function() {
          return requestAnimationFrame(tick);
        });
      } else {
        return setTimeout(tick, 33 - diff);
      }
    };
    return tick();
  };

  result = function() {
    var args, key, obj;
    obj = arguments[0], key = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (typeof obj[key] === 'function') {
      return obj[key].apply(obj, args);
    } else {
      return obj[key];
    }
  };

  extend = function() {
    var key, out, source, sources, val, _i, _len;
    out = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      if (source) {
        for (key in source) {
          if (!__hasProp.call(source, key)) continue;
          val = source[key];
          if ((out[key] != null) && typeof out[key] === 'object' && (val != null) && typeof val === 'object') {
            extend(out[key], val);
          } else {
            out[key] = val;
          }
        }
      }
    }
    return out;
  };

  avgAmplitude = function(arr) {
    var count, sum, v, _i, _len;
    sum = count = 0;
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      v = arr[_i];
      sum += Math.abs(v);
      count++;
    }
    return sum / count;
  };

  getFromDOM = function(key, json) {
    var data, e, el;
    if (key == null) {
      key = 'options';
    }
    if (json == null) {
      json = true;
    }
    el = document.querySelector("[data-pace-" + key + "]");
    if (!el) {
      return;
    }
    data = el.getAttribute("data-pace-" + key);
    if (!json) {
      return data;
    }
    try {
      return JSON.parse(data);
    } catch (_error) {
      e = _error;
      return typeof console !== "undefined" && console !== null ? console.error("Error parsing inline pace options", e) : void 0;
    }
  };

  Evented = (function() {
    function Evented() {}

    Evented.prototype.on = function(event, handler, ctx, once) {
      var _base;
      if (once == null) {
        once = false;
      }
      if (this.bindings == null) {
        this.bindings = {};
      }
      if ((_base = this.bindings)[event] == null) {
        _base[event] = [];
      }
      return this.bindings[event].push({
        handler: handler,
        ctx: ctx,
        once: once
      });
    };

    Evented.prototype.once = function(event, handler, ctx) {
      return this.on(event, handler, ctx, true);
    };

    Evented.prototype.off = function(event, handler) {
      var i, _ref, _results;
      if (((_ref = this.bindings) != null ? _ref[event] : void 0) == null) {
        return;
      }
      if (handler == null) {
        return delete this.bindings[event];
      } else {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          if (this.bindings[event][i].handler === handler) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    Evented.prototype.trigger = function() {
      var args, ctx, event, handler, i, once, _ref, _ref1, _results;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if ((_ref = this.bindings) != null ? _ref[event] : void 0) {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          _ref1 = this.bindings[event][i], handler = _ref1.handler, ctx = _ref1.ctx, once = _ref1.once;
          handler.apply(ctx != null ? ctx : this, args);
          if (once) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    return Evented;

  })();

  Pace = window.Pace || {};

  window.Pace = Pace;

  extend(Pace, Evented.prototype);

  options = Pace.options = extend({}, defaultOptions, window.paceOptions, getFromDOM());

  _ref = ['ajax', 'document', 'eventLag', 'elements'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    source = _ref[_i];
    if (options[source] === true) {
      options[source] = defaultOptions[source];
    }
  }

  NoTargetError = (function(_super) {
    __extends(NoTargetError, _super);

    function NoTargetError() {
      _ref1 = NoTargetError.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    return NoTargetError;

  })(Error);

  Bar = (function() {
    function Bar() {
      this.progress = 0;
    }

    Bar.prototype.getElement = function() {
      var targetElement;
      if (this.el == null) {
        targetElement = document.querySelector(options.target);
        if (!targetElement) {
          throw new NoTargetError;
        }
        this.el = document.createElement('div');
        this.el.className = "pace pace-active";
        document.body.className = document.body.className.replace(/pace-done/g, '');
        document.body.className += ' pace-running';
        this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>';
        if (targetElement.firstChild != null) {
          targetElement.insertBefore(this.el, targetElement.firstChild);
        } else {
          targetElement.appendChild(this.el);
        }
      }
      return this.el;
    };

    Bar.prototype.finish = function() {
      var el;
      el = this.getElement();
      el.className = el.className.replace('pace-active', '');
      el.className += ' pace-inactive';
      document.body.className = document.body.className.replace('pace-running', '');
      return document.body.className += ' pace-done';
    };

    Bar.prototype.update = function(prog) {
      this.progress = prog;
      return this.render();
    };

    Bar.prototype.destroy = function() {
      try {
        this.getElement().parentNode.removeChild(this.getElement());
      } catch (_error) {
        NoTargetError = _error;
      }
      return this.el = void 0;
    };

    Bar.prototype.render = function() {
      var el, key, progressStr, transform, _j, _len1, _ref2;
      if (document.querySelector(options.target) == null) {
        return false;
      }
      el = this.getElement();
      transform = "translate3d(" + this.progress + "%, 0, 0)";
      _ref2 = ['webkitTransform', 'msTransform', 'transform'];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        key = _ref2[_j];
        el.children[0].style[key] = transform;
      }
      if (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) {
        el.children[0].setAttribute('data-progress-text', "" + (this.progress | 0) + "%");
        if (this.progress >= 100) {
          progressStr = '99';
        } else {
          progressStr = this.progress < 10 ? "0" : "";
          progressStr += this.progress | 0;
        }
        el.children[0].setAttribute('data-progress', "" + progressStr);
      }
      return this.lastRenderedProgress = this.progress;
    };

    Bar.prototype.done = function() {
      return this.progress >= 100;
    };

    return Bar;

  })();

  Events = (function() {
    function Events() {
      this.bindings = {};
    }

    Events.prototype.trigger = function(name, val) {
      var binding, _j, _len1, _ref2, _results;
      if (this.bindings[name] != null) {
        _ref2 = this.bindings[name];
        _results = [];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          binding = _ref2[_j];
          _results.push(binding.call(this, val));
        }
        return _results;
      }
    };

    Events.prototype.on = function(name, fn) {
      var _base;
      if ((_base = this.bindings)[name] == null) {
        _base[name] = [];
      }
      return this.bindings[name].push(fn);
    };

    return Events;

  })();

  _XMLHttpRequest = window.XMLHttpRequest;

  _XDomainRequest = window.XDomainRequest;

  _WebSocket = window.WebSocket;

  extendNative = function(to, from) {
    var e, key, _results;
    _results = [];
    for (key in from.prototype) {
      try {
        if ((to[key] == null) && typeof from[key] !== 'function') {
          if (typeof Object.defineProperty === 'function') {
            _results.push(Object.defineProperty(to, key, {
              get: function() {
                return from.prototype[key];
              },
              configurable: true,
              enumerable: true
            }));
          } else {
            _results.push(to[key] = from.prototype[key]);
          }
        } else {
          _results.push(void 0);
        }
      } catch (_error) {
        e = _error;
      }
    }
    return _results;
  };

  ignoreStack = [];

  Pace.ignore = function() {
    var args, fn, ret;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    ignoreStack.unshift('ignore');
    ret = fn.apply(null, args);
    ignoreStack.shift();
    return ret;
  };

  Pace.track = function() {
    var args, fn, ret;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    ignoreStack.unshift('track');
    ret = fn.apply(null, args);
    ignoreStack.shift();
    return ret;
  };

  shouldTrack = function(method) {
    var _ref2;
    if (method == null) {
      method = 'GET';
    }
    if (ignoreStack[0] === 'track') {
      return 'force';
    }
    if (!ignoreStack.length && options.ajax) {
      if (method === 'socket' && options.ajax.trackWebSockets) {
        return true;
      } else if (_ref2 = method.toUpperCase(), __indexOf.call(options.ajax.trackMethods, _ref2) >= 0) {
        return true;
      }
    }
    return false;
  };

  RequestIntercept = (function(_super) {
    __extends(RequestIntercept, _super);

    function RequestIntercept() {
      var monitorXHR,
        _this = this;
      RequestIntercept.__super__.constructor.apply(this, arguments);
      monitorXHR = function(req) {
        var _open;
        _open = req.open;
        return req.open = function(type, url, async) {
          if (shouldTrack(type)) {
            _this.trigger('request', {
              type: type,
              url: url,
              request: req
            });
          }
          return _open.apply(req, arguments);
        };
      };
      window.XMLHttpRequest = function(flags) {
        var req;
        req = new _XMLHttpRequest(flags);
        monitorXHR(req);
        return req;
      };
      try {
        extendNative(window.XMLHttpRequest, _XMLHttpRequest);
      } catch (_error) {}
      if (_XDomainRequest != null) {
        window.XDomainRequest = function() {
          var req;
          req = new _XDomainRequest;
          monitorXHR(req);
          return req;
        };
        try {
          extendNative(window.XDomainRequest, _XDomainRequest);
        } catch (_error) {}
      }
      if ((_WebSocket != null) && options.ajax.trackWebSockets) {
        window.WebSocket = function(url, protocols) {
          var req;
          if (protocols != null) {
            req = new _WebSocket(url, protocols);
          } else {
            req = new _WebSocket(url);
          }
          if (shouldTrack('socket')) {
            _this.trigger('request', {
              type: 'socket',
              url: url,
              protocols: protocols,
              request: req
            });
          }
          return req;
        };
        try {
          extendNative(window.WebSocket, _WebSocket);
        } catch (_error) {}
      }
    }

    return RequestIntercept;

  })(Events);

  _intercept = null;

  getIntercept = function() {
    if (_intercept == null) {
      _intercept = new RequestIntercept;
    }
    return _intercept;
  };

  shouldIgnoreURL = function(url) {
    var pattern, _j, _len1, _ref2;
    _ref2 = options.ajax.ignoreURLs;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      pattern = _ref2[_j];
      if (typeof pattern === 'string') {
        if (url.indexOf(pattern) !== -1) {
          return true;
        }
      } else {
        if (pattern.test(url)) {
          return true;
        }
      }
    }
    return false;
  };

  getIntercept().on('request', function(_arg) {
    var after, args, request, type, url;
    type = _arg.type, request = _arg.request, url = _arg.url;
    if (shouldIgnoreURL(url)) {
      return;
    }
    if (!Pace.running && (options.restartOnRequestAfter !== false || shouldTrack(type) === 'force')) {
      args = arguments;
      after = options.restartOnRequestAfter || 0;
      if (typeof after === 'boolean') {
        after = 0;
      }
      return setTimeout(function() {
        var stillActive, _j, _len1, _ref2, _ref3, _results;
        if (type === 'socket') {
          stillActive = request.readyState < 2;
        } else {
          stillActive = (0 < (_ref2 = request.readyState) && _ref2 < 4);
        }
        if (stillActive) {
          Pace.restart();
          _ref3 = Pace.sources;
          _results = [];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            source = _ref3[_j];
            if (source instanceof AjaxMonitor) {
              source.watch.apply(source, args);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      }, after);
    }
  });

  AjaxMonitor = (function() {
    function AjaxMonitor() {
      var _this = this;
      this.elements = [];
      getIntercept().on('request', function() {
        return _this.watch.apply(_this, arguments);
      });
    }

    AjaxMonitor.prototype.watch = function(_arg) {
      var request, tracker, type, url;
      type = _arg.type, request = _arg.request, url = _arg.url;
      if (shouldIgnoreURL(url)) {
        return;
      }
      if (type === 'socket') {
        tracker = new SocketRequestTracker(request);
      } else {
        tracker = new XHRRequestTracker(request);
      }
      return this.elements.push(tracker);
    };

    return AjaxMonitor;

  })();

  XHRRequestTracker = (function() {
    function XHRRequestTracker(request) {
      var event, size, _j, _len1, _onreadystatechange, _ref2,
        _this = this;
      this.progress = 0;
      if (window.ProgressEvent != null) {
        size = null;
        request.addEventListener('progress', function(evt) {
          if (evt.lengthComputable) {
            return _this.progress = 100 * evt.loaded / evt.total;
          } else {
            return _this.progress = _this.progress + (100 - _this.progress) / 2;
          }
        }, false);
        _ref2 = ['load', 'abort', 'timeout', 'error'];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          event = _ref2[_j];
          request.addEventListener(event, function() {
            return _this.progress = 100;
          }, false);
        }
      } else {
        _onreadystatechange = request.onreadystatechange;
        request.onreadystatechange = function() {
          var _ref3;
          if ((_ref3 = request.readyState) === 0 || _ref3 === 4) {
            _this.progress = 100;
          } else if (request.readyState === 3) {
            _this.progress = 50;
          }
          return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
        };
      }
    }

    return XHRRequestTracker;

  })();

  SocketRequestTracker = (function() {
    function SocketRequestTracker(request) {
      var event, _j, _len1, _ref2,
        _this = this;
      this.progress = 0;
      _ref2 = ['error', 'open'];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        event = _ref2[_j];
        request.addEventListener(event, function() {
          return _this.progress = 100;
        }, false);
      }
    }

    return SocketRequestTracker;

  })();

  ElementMonitor = (function() {
    function ElementMonitor(options) {
      var selector, _j, _len1, _ref2;
      if (options == null) {
        options = {};
      }
      this.elements = [];
      if (options.selectors == null) {
        options.selectors = [];
      }
      _ref2 = options.selectors;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        selector = _ref2[_j];
        this.elements.push(new ElementTracker(selector));
      }
    }

    return ElementMonitor;

  })();

  ElementTracker = (function() {
    function ElementTracker(selector) {
      this.selector = selector;
      this.progress = 0;
      this.check();
    }

    ElementTracker.prototype.check = function() {
      var _this = this;
      if (document.querySelector(this.selector)) {
        return this.done();
      } else {
        return setTimeout((function() {
          return _this.check();
        }), options.elements.checkInterval);
      }
    };

    ElementTracker.prototype.done = function() {
      return this.progress = 100;
    };

    return ElementTracker;

  })();

  DocumentMonitor = (function() {
    DocumentMonitor.prototype.states = {
      loading: 0,
      interactive: 50,
      complete: 100
    };

    function DocumentMonitor() {
      var _onreadystatechange, _ref2,
        _this = this;
      this.progress = (_ref2 = this.states[document.readyState]) != null ? _ref2 : 100;
      _onreadystatechange = document.onreadystatechange;
      document.onreadystatechange = function() {
        if (_this.states[document.readyState] != null) {
          _this.progress = _this.states[document.readyState];
        }
        return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
      };
    }

    return DocumentMonitor;

  })();

  EventLagMonitor = (function() {
    function EventLagMonitor() {
      var avg, interval, last, points, samples,
        _this = this;
      this.progress = 0;
      avg = 0;
      samples = [];
      points = 0;
      last = now();
      interval = setInterval(function() {
        var diff;
        diff = now() - last - 50;
        last = now();
        samples.push(diff);
        if (samples.length > options.eventLag.sampleCount) {
          samples.shift();
        }
        avg = avgAmplitude(samples);
        if (++points >= options.eventLag.minSamples && avg < options.eventLag.lagThreshold) {
          _this.progress = 100;
          return clearInterval(interval);
        } else {
          return _this.progress = 100 * (3 / (avg + 3));
        }
      }, 50);
    }

    return EventLagMonitor;

  })();

  Scaler = (function() {
    function Scaler(source) {
      this.source = source;
      this.last = this.sinceLastUpdate = 0;
      this.rate = options.initialRate;
      this.catchup = 0;
      this.progress = this.lastProgress = 0;
      if (this.source != null) {
        this.progress = result(this.source, 'progress');
      }
    }

    Scaler.prototype.tick = function(frameTime, val) {
      var scaling;
      if (val == null) {
        val = result(this.source, 'progress');
      }
      if (val >= 100) {
        this.done = true;
      }
      if (val === this.last) {
        this.sinceLastUpdate += frameTime;
      } else {
        if (this.sinceLastUpdate) {
          this.rate = (val - this.last) / this.sinceLastUpdate;
        }
        this.catchup = (val - this.progress) / options.catchupTime;
        this.sinceLastUpdate = 0;
        this.last = val;
      }
      if (val > this.progress) {
        this.progress += this.catchup * frameTime;
      }
      scaling = 1 - Math.pow(this.progress / 100, options.easeFactor);
      this.progress += scaling * this.rate * frameTime;
      this.progress = Math.min(this.lastProgress + options.maxProgressPerFrame, this.progress);
      this.progress = Math.max(0, this.progress);
      this.progress = Math.min(100, this.progress);
      this.lastProgress = this.progress;
      return this.progress;
    };

    return Scaler;

  })();

  sources = null;

  scalers = null;

  bar = null;

  uniScaler = null;

  animation = null;

  cancelAnimation = null;

  Pace.running = false;

  handlePushState = function() {
    if (options.restartOnPushState) {
      return Pace.restart();
    }
  };

  if (window.history.pushState != null) {
    _pushState = window.history.pushState;
    window.history.pushState = function() {
      handlePushState();
      return _pushState.apply(window.history, arguments);
    };
  }

  if (window.history.replaceState != null) {
    _replaceState = window.history.replaceState;
    window.history.replaceState = function() {
      handlePushState();
      return _replaceState.apply(window.history, arguments);
    };
  }

  SOURCE_KEYS = {
    ajax: AjaxMonitor,
    elements: ElementMonitor,
    document: DocumentMonitor,
    eventLag: EventLagMonitor
  };

  (init = function() {
    var type, _j, _k, _len1, _len2, _ref2, _ref3, _ref4;
    Pace.sources = sources = [];
    _ref2 = ['ajax', 'elements', 'document', 'eventLag'];
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      type = _ref2[_j];
      if (options[type] !== false) {
        sources.push(new SOURCE_KEYS[type](options[type]));
      }
    }
    _ref4 = (_ref3 = options.extraSources) != null ? _ref3 : [];
    for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
      source = _ref4[_k];
      sources.push(new source(options));
    }
    Pace.bar = bar = new Bar;
    scalers = [];
    return uniScaler = new Scaler;
  })();

  Pace.stop = function() {
    Pace.trigger('stop');
    Pace.running = false;
    bar.destroy();
    cancelAnimation = true;
    if (animation != null) {
      if (typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(animation);
      }
      animation = null;
    }
    return init();
  };

  Pace.restart = function() {
    Pace.trigger('restart');
    Pace.stop();
    return Pace.start();
  };

  Pace.go = function() {
    var start;
    Pace.running = true;
    bar.render();
    start = now();
    cancelAnimation = false;
    return animation = runAnimation(function(frameTime, enqueueNextFrame) {
      var avg, count, done, element, elements, i, j, remaining, scaler, scalerList, sum, _j, _k, _len1, _len2, _ref2;
      remaining = 100 - bar.progress;
      count = sum = 0;
      done = true;
      for (i = _j = 0, _len1 = sources.length; _j < _len1; i = ++_j) {
        source = sources[i];
        scalerList = scalers[i] != null ? scalers[i] : scalers[i] = [];
        elements = (_ref2 = source.elements) != null ? _ref2 : [source];
        for (j = _k = 0, _len2 = elements.length; _k < _len2; j = ++_k) {
          element = elements[j];
          scaler = scalerList[j] != null ? scalerList[j] : scalerList[j] = new Scaler(element);
          done &= scaler.done;
          if (scaler.done) {
            continue;
          }
          count++;
          sum += scaler.tick(frameTime);
        }
      }
      avg = sum / count;
      bar.update(uniScaler.tick(frameTime, avg));
      if (bar.done() || done || cancelAnimation) {
        bar.update(100);
        Pace.trigger('done');
        return setTimeout(function() {
          bar.finish();
          Pace.running = false;
          return Pace.trigger('hide');
        }, Math.max(options.ghostTime, Math.max(options.minTime - (now() - start), 0)));
      } else {
        return enqueueNextFrame();
      }
    });
  };

  Pace.start = function(_options) {
    extend(options, _options);
    Pace.running = true;
    try {
      bar.render();
    } catch (_error) {
      NoTargetError = _error;
    }
    if (!document.querySelector('.pace')) {
      return setTimeout(Pace.start, 50);
    } else {
      Pace.trigger('start');
      return Pace.go();
    }
  };

  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! pace */ "./node_modules/pace/pace.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return Pace;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}).call(this);


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./resources/js/backend/after.js":
/*!***************************************!*\
  !*** ./resources/js/backend/after.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Loaded after CoreUI app.js

/*================================================================================
  Item Name: Materialize - Material Design Admin Template
  Version: 5.0
  Author: PIXINVENT
  Author URL: https://themeforest.net/user/pixinvent/portfolio
================================================================================*/

/***/ }),

/***/ "./resources/js/backend/app.js":
/*!*************************************!*\
  !*** ./resources/js/backend/app.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

//import '@coreui/coreui'

/***/ }),

/***/ "./resources/js/backend/before.js":
/*!****************************************!*\
  !*** ./resources/js/backend/before.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../bootstrap */ "./resources/js/bootstrap.js");
/* harmony import */ var pace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pace */ "./node_modules/pace/pace.js");
/* harmony import */ var pace__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(pace__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _plugins__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../plugins */ "./resources/js/plugins.js");
/* harmony import */ var _plugins__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_plugins__WEBPACK_IMPORTED_MODULE_2__);
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
// Loaded before CoreUI app.js




/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var popper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! popper.js */ "./node_modules/popper.js/dist/esm/popper.js");
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.js");
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(bootstrap__WEBPACK_IMPORTED_MODULE_5__);
/**
 * This bootstrap file is used for both frontend and backend
 */




 // Required for BS4


/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

window.$ = window.jQuery = jquery__WEBPACK_IMPORTED_MODULE_3___default.a;
window.Swal = sweetalert2__WEBPACK_IMPORTED_MODULE_2___default.a;
window._ = lodash__WEBPACK_IMPORTED_MODULE_0___default.a; // Lodash

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = axios__WEBPACK_IMPORTED_MODULE_1___default.a;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

var token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}
/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */
// import Echo from 'laravel-echo'
// window.Pusher = require('pusher-js');
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     encrypted: true
// });

/***/ }),

/***/ "./resources/js/plugins.js":
/*!*********************************!*\
  !*** ./resources/js/plugins.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Allows you to add data-method="METHOD to links to automatically inject a form
 * with the method on click
 *
 * Example: <a href="{{route('customers.destroy', $customer->id)}}"
 * data-method="delete" name="delete_item">Delete</a>
 *
 * Injects a form with that's fired on click of the link with a DELETE request.
 * Good because you don't have to dirty your HTML with delete forms everywhere.
 */
function addDeleteForms() {
  $('[data-method]').append(function () {
    if (!$(this).find('form').length > 0) {
      return "\n<form action='" + $(this).attr('href') + "' method='POST' name='delete_item' style='display:none'>\n" + "<input type='hidden' name='_method' value='" + $(this).attr('data-method') + "'>\n" + "<input type='hidden' name='_token' value='" + $('meta[name="csrf-token"]').attr('content') + "'>\n" + '</form>\n';
    } else {
      return '';
    }
  }).attr('href', '#').attr('style', 'cursor:pointer;').attr('onclick', '$(this).find("form").submit();');
}
/**
 * Place any jQuery/helper plugins in here.
 */


$(function () {
  /**
   * Add the data-method="delete" forms to all delete links
   */
  addDeleteForms();
  /**
   * Disable all submit buttons once clicked
   */

  $('form').submit(function () {
    $(this).find('input[type="submit"]').attr('disabled', true);
    $(this).find('button[type="submit"]').attr('disabled', true);
    return true;
  });
  /**
   * Generic confirm form delete using Sweet Alert
   */

  $('body').on('submit', 'form[name=delete_item]', function (e) {
    e.preventDefault();
    var form = this;
    var link = $('a[data-method="delete"]');
    var cancel = link.attr('data-trans-button-cancel') ? link.attr('data-trans-button-cancel') : 'Cancel';
    var confirm = link.attr('data-trans-button-confirm') ? link.attr('data-trans-button-confirm') : 'Yes, delete';
    var title = link.attr('data-trans-title') ? link.attr('data-trans-title') : 'Are you sure you want to delete this item?';
    Swal.fire({
      title: title,
      showCancelButton: true,
      confirmButtonText: confirm,
      cancelButtonText: cancel,
      type: 'warning'
    }).then(function (result) {
      result.value && form.submit();
    });
  }).on('click', 'a[name=confirm_item]', function (e) {
    /**
     * Generic 'are you sure' confirm box
     */
    e.preventDefault();
    var link = $(this);
    var title = link.attr('data-trans-title') ? link.attr('data-trans-title') : 'Are you sure you want to do this?';
    var cancel = link.attr('data-trans-button-cancel') ? link.attr('data-trans-button-cancel') : 'Cancel';
    var confirm = link.attr('data-trans-button-confirm') ? link.attr('data-trans-button-confirm') : 'Continue';
    Swal.fire({
      title: title,
      showCancelButton: true,
      confirmButtonText: confirm,
      cancelButtonText: cancel,
      type: 'info'
    }).then(function (result) {
      result.value && window.location.assign(link.attr('href'));
    });
  }); // $('[data-toggle="tooltip"]').tooltip();

  /*================================================================================
  Item Name: Materialize - Material Design Admin Template
  Version: 5.0
  Author: PIXINVENT
  Author URL: https://themeforest.net/user/pixinvent/portfolio
  ================================================================================*/

  $(window).on("resize", function () {
    resizetable();
  });

  function resizetable() {
    if ($(window).width() < 976) {
      if ($('.vertical-layout.vertical-gradient-menu .sidenav-dark .brand-logo').length > 0) {
        $('.vertical-layout.vertical-gradient-menu .sidenav-dark .brand-logo img').attr('src', '../../../app-assets/images/logo/materialize-logo-color.png');
      }

      if ($('.vertical-layout.vertical-dark-menu .sidenav-dark .brand-logo').length > 0) {
        $('.vertical-layout.vertical-dark-menu .sidenav-dark .brand-logo img').attr('src', '../../../app-assets/images/logo/materialize-logo-color.png');
      }

      if ($('.vertical-layout.vertical-modern-menu .sidenav-light .brand-logo').length > 0) {
        $('.vertical-layout.vertical-modern-menu .sidenav-light .brand-logo img').attr('src', '../../../app-assets/images/logo/materialize-logo.png');
      }
    } else {
      if ($('.vertical-layout.vertical-gradient-menu .sidenav-dark .brand-logo').length > 0) {
        $('.vertical-layout.vertical-gradient-menu .sidenav-dark .brand-logo img').attr('src', '../../../app-assets/images/logo/materialize-logo.png');
      }

      if ($('.vertical-layout.vertical-dark-menu .sidenav-dark .brand-logo').length > 0) {
        $('.vertical-layout.vertical-dark-menu .sidenav-dark .brand-logo img').attr('src', '../../../app-assets/images/logo/materialize-logo.png');
      }

      if ($('.vertical-layout.vertical-modern-menu .sidenav-light .brand-logo').length > 0) {
        $('.vertical-layout.vertical-modern-menu .sidenav-light .brand-logo img').attr('src', '../../../app-assets/images/logo/materialize-logo-color.png');
      }
    }
  }

  resizetable(); // Add message to chat

  function slide_out_chat() {
    var message = $(".search").val();

    if (message != "") {
      var html = '<li class="collection-item display-flex avatar justify-content-end pl-5 pb-0" data-target="slide-out-chat"><div class="user-content speech-bubble-right">' + '<p class="medium-small">' + message + "</p>" + "</div></li>";
      $("#right-sidebar-nav #slide-out-chat .chat-body .collection").append(html);
      $(".search").val("");
      var charScroll = $("#right-sidebar-nav #slide-out-chat .chat-body .collection");

      if (charScroll.length > 0) {
        charScroll[0].scrollTop = charScroll[0].scrollHeight;
      }
    }
  }
});
$(function () {
  "use strict"; // Init collapsible

  $(".collapsible").collapsible({
    accordion: true,
    onOpenStart: function onOpenStart() {
      // Removed open class first and add open at collapsible active
      $(".collapsible > li.open").removeClass("open");
      setTimeout(function () {
        $("#slide-out > li.active > a").parent().addClass("open");
      }, 10);
    }
  }); // Add open class on init

  $("#slide-out > li.active > a").parent().addClass("open"); // Open active menu for multi level

  if ($("li.active .collapsible-sub .collapsible").find("a.active").length > 0) {
    $("li.active .collapsible-sub .collapsible").find("a.active").closest("div.collapsible-body").show();
    $("li.active .collapsible-sub .collapsible").find("a.active").closest("div.collapsible-body").closest("li").addClass("active");
  } // Auto Scroll menu to the active item


  var position;

  if ($(".sidenav-main li a.active").parent("li.active").parent("ul.collapsible-sub").length > 0) {
    position = $(".sidenav-main li a.active").parent("li.active").parent("ul.collapsible-sub").position();
  } else {
    position = $(".sidenav-main li a.active").parent("li.active").position();
  }

  setTimeout(function () {
    if (position !== undefined) {
      $(".sidenav-main ul").stop().animate({
        scrollTop: position.top - 300
      }, 300);
    }
  }, 300); // Collapsible navigation menu

  $(".nav-collapsible .navbar-toggler").click(function () {
    // Toggle navigation expan and collapse on radio click
    if ($(".sidenav-main").hasClass("nav-expanded") && !$(".sidenav-main").hasClass("nav-lock")) {
      $(".sidenav-main").toggleClass("nav-expanded");
      $("#main").toggleClass("main-full");
    } else {
      $("#main").toggleClass("main-full");
    } // Set navigation lock / unlock with radio icon


    if ($(this).children().text() == "radio_button_unchecked") {
      $(this).children().text("radio_button_checked");
      $(".sidenav-main").addClass("nav-lock");
      $(".navbar .nav-collapsible").addClass("sideNav-lock");
    } else {
      $(this).children().text("radio_button_unchecked");
      $(".sidenav-main").removeClass("nav-lock");
      $(".navbar .nav-collapsible").removeClass("sideNav-lock");
    }
  });
  $(".toggle-fullscreen").click(function () {
    toggleFullScreen();
    console.log('fullscreen');
  }); // Expand navigation on mouseenter event

  $(".sidenav-main.nav-collapsible, .navbar .brand-sidebar").mouseenter(function () {
    if (!$(".sidenav-main.nav-collapsible").hasClass("nav-lock")) {
      $(".sidenav-main.nav-collapsible, .navbar .nav-collapsible").addClass("nav-expanded").removeClass("nav-collapsed");
      $("#slide-out > li.close > a").parent().addClass("open").removeClass("close");
      setTimeout(function () {
        // Open only if collapsible have the children
        if ($(".collapsible .open").children().length > 1) {
          $(".collapsible").collapsible("open", $(".collapsible .open").index());
        }
      }, 100);
    }
  }); // Collapse navigation on mouseleave event

  $(".sidenav-main.nav-collapsible, .navbar .brand-sidebar").mouseleave(function () {
    if (!$(".sidenav-main.nav-collapsible").hasClass("nav-lock")) {
      var openLength = $(".collapsible .open").children().length;
      $(".sidenav-main.nav-collapsible, .navbar .nav-collapsible").addClass("nav-collapsed").removeClass("nav-expanded");
      $("#slide-out > li.open > a").parent().addClass("close").removeClass("open");
      setTimeout(function () {
        // Open only if collapsible have the children
        if (openLength > 1) {
          $(".collapsible").collapsible("close", $(".collapsible .close").index());
        }
      }, 100);
    }
  }); // Search class for focus

  $(".header-search-input").focus(function () {
    $(this).parent("div").addClass("header-search-wrapper-focus");
  }).blur(function () {
    $(this).parent("div").removeClass("header-search-wrapper-focus");
  }); //Search box form small screen

  $(".search-button").click(function (e) {
    if ($(".search-sm").is(":hidden")) {
      $(".search-sm").show();
      $(".search-box-sm").focus();
    } else {
      $(".search-sm").hide();
      $(".search-box-sm").val("");
    }
  });
  $(".search-sm-close").click(function (e) {
    $(".search-sm").hide();
    $(".search-box-sm").val("");
  }); //Breadcrumbs with image

  if ($("#breadcrumbs-wrapper").attr("data-image")) {
    var imageUrl = $("#breadcrumbs-wrapper").attr("data-image");
    $("#breadcrumbs-wrapper").addClass("breadcrumbs-bg-image");
    $("#breadcrumbs-wrapper").css("background-image", "url(" + imageUrl + ")");
  } // Check first if any of the task is checked


  $("#task-card input:checkbox").each(function () {
    checkbox_check(this);
  }); // Task check box

  $("#task-card input:checkbox").change(function () {
    checkbox_check(this);
  }); // Check Uncheck function

  function checkbox_check(el) {
    if (!$(el).is(":checked")) {
      $(el).next().css("text-decoration", "none"); // or addClass
    } else {
      $(el).next().css("text-decoration", "line-through"); //or addClass
    }
  } //Init tabs


  $(".tabs").tabs(); // Swipeable Tabs Demo Init

  if ($("#tabs-swipe-demo").length) {
    $("#tabs-swipe-demo").tabs({
      swipeable: true
    });
  } // Plugin initialization


  $("select").formSelect(); // Set checkbox on forms.html to indeterminate

  var indeterminateCheckbox = document.getElementById("indeterminate-checkbox");
  if (indeterminateCheckbox !== null) indeterminateCheckbox.indeterminate = true; // Materialize Slider

  $(".slider").slider({
    full_width: true
  }); // Commom, Translation & Horizontal Dropdown

  $(".dropdown-trigger").dropdown(); // Commom, Translation

  $(".dropdown-button").dropdown({
    inDuration: 300,
    outDuration: 225,
    constrainWidth: false,
    hover: true,
    gutter: 0,
    coverTrigger: true,
    alignment: "left" // stopPropagation: false

  }); // Notification, Profile, Translation, Settings Dropdown & Horizontal Dropdown

  $(".notification-button, .profile-button, .translation-button, .dropdown-settings, .dropdown-menu").dropdown({
    inDuration: 300,
    outDuration: 225,
    constrainWidth: false,
    hover: false,
    gutter: 0,
    coverTrigger: false,
    alignment: "right" // stopPropagation: false

  }); // Fab

  $(".fixed-action-btn").floatingActionButton();
  $(".fixed-action-btn.horizontal").floatingActionButton({
    direction: "left"
  });
  $(".fixed-action-btn.click-to-toggle").floatingActionButton({
    direction: "left",
    hoverEnabled: false
  });
  $(".fixed-action-btn.toolbar").floatingActionButton({
    toolbarEnabled: true
  }); // Materialize Tabs

  $(".tab-demo").show().tabs();
  $(".tab-demo-active").show().tabs(); // Materialize scrollSpy

  $(".scrollspy").scrollSpy(); // Materialize tooltip

  $(".tooltipped").tooltip({
    delay: 50
  }); //Main Left Sidebar Menu // sidebar-collapse

  $(".sidenav").sidenav({
    edge: "left" // Choose the horizontal origin

  }); //Main Right Sidebar

  $(".slide-out-right-sidenav").sidenav({
    edge: "right"
  }); //Main Right Sidebar Chat

  $(".slide-out-right-sidenav-chat").sidenav({
    edge: "right"
  }); // Perfect Scrollbar

  $("select").not(".disabled").select();
  var leftnav = $(".page-topbar").height();
  var leftnavHeight = window.innerHeight - leftnav;
  var righttnav = $("#slide-out-right").height();

  if ($("#slide-out.leftside-navigation").length > 0) {
    if (!$("#slide-out.leftside-navigation").hasClass("native-scroll")) {
      var ps_leftside_nav = new PerfectScrollbar(".leftside-navigation", {
        wheelSpeed: 2,
        wheelPropagation: false,
        minScrollbarLength: 20
      });
    }
  }

  if ($(".slide-out-right-body").length > 0) {
    var ps_slideout_right = new PerfectScrollbar(".slide-out-right-body, .chat-body .collection", {
      suppressScrollX: true
    });
  }

  if ($(".chat-body .collection").length > 0) {
    var ps_slideout_chat = new PerfectScrollbar(".chat-body .collection", {
      suppressScrollX: true
    });
  } // Char scroll till bottom of the char content area


  var chatScrollAuto = $("#right-sidebar-nav #slide-out-chat .chat-body .collection");

  if (chatScrollAuto.length > 0) {
    chatScrollAuto[0].scrollTop = chatScrollAuto[0].scrollHeight;
  } // Fullscreen


  function toggleFullScreen() {
    if (document.fullScreenElement && document.fullScreenElement !== null || !document.mozFullScreen && !document.webkitIsFullScreen) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (document.documentElement.msRequestFullscreen) {
        if (document.msFullscreenElement) {
          document.msExitFullscreen();
        } else {
          document.documentElement.msRequestFullscreen();
        }
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  } // Detect touch screen and enable scrollbar if necessary


  function is_touch_device() {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }

  if (is_touch_device()) {
    $("#nav-mobile").css({
      overflow: "auto"
    });
  }

  resizetable();
});

/***/ }),

/***/ 1:
/*!************************************************************************************************************!*\
  !*** multi ./resources/js/backend/before.js ./resources/js/backend/app.js ./resources/js/backend/after.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! A:\Boilerplatematerial\resources\js\backend\before.js */"./resources/js/backend/before.js");
__webpack_require__(/*! A:\Boilerplatematerial\resources\js\backend\app.js */"./resources/js/backend/app.js");
module.exports = __webpack_require__(/*! A:\Boilerplatematerial\resources\js\backend\after.js */"./resources/js/backend/after.js");


/***/ })

},[[1,"/js/manifest","/js/vendor"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wYWNlL3BhY2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL2pzL2JhY2tlbmQvYWZ0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL2pzL2JhY2tlbmQvYXBwLmpzIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9qcy9iYWNrZW5kL2JlZm9yZS5qcyIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvanMvYm9vdHN0cmFwLmpzIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9qcy9wbHVnaW5zLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIiQiLCJqUXVlcnkiLCJTd2FsIiwiXyIsImF4aW9zIiwiZGVmYXVsdHMiLCJoZWFkZXJzIiwiY29tbW9uIiwidG9rZW4iLCJkb2N1bWVudCIsImhlYWQiLCJxdWVyeVNlbGVjdG9yIiwiY29udGVudCIsImNvbnNvbGUiLCJlcnJvciIsImFkZERlbGV0ZUZvcm1zIiwiYXBwZW5kIiwiZmluZCIsImxlbmd0aCIsImF0dHIiLCJzdWJtaXQiLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm0iLCJsaW5rIiwiY2FuY2VsIiwiY29uZmlybSIsInRpdGxlIiwiZmlyZSIsInNob3dDYW5jZWxCdXR0b24iLCJjb25maXJtQnV0dG9uVGV4dCIsImNhbmNlbEJ1dHRvblRleHQiLCJ0eXBlIiwidGhlbiIsInJlc3VsdCIsInZhbHVlIiwibG9jYXRpb24iLCJhc3NpZ24iLCJyZXNpemV0YWJsZSIsIndpZHRoIiwic2xpZGVfb3V0X2NoYXQiLCJtZXNzYWdlIiwidmFsIiwiaHRtbCIsImNoYXJTY3JvbGwiLCJzY3JvbGxUb3AiLCJzY3JvbGxIZWlnaHQiLCJjb2xsYXBzaWJsZSIsImFjY29yZGlvbiIsIm9uT3BlblN0YXJ0IiwicmVtb3ZlQ2xhc3MiLCJzZXRUaW1lb3V0IiwicGFyZW50IiwiYWRkQ2xhc3MiLCJjbG9zZXN0Iiwic2hvdyIsInBvc2l0aW9uIiwidW5kZWZpbmVkIiwic3RvcCIsImFuaW1hdGUiLCJ0b3AiLCJjbGljayIsImhhc0NsYXNzIiwidG9nZ2xlQ2xhc3MiLCJjaGlsZHJlbiIsInRleHQiLCJ0b2dnbGVGdWxsU2NyZWVuIiwibG9nIiwibW91c2VlbnRlciIsImluZGV4IiwibW91c2VsZWF2ZSIsIm9wZW5MZW5ndGgiLCJmb2N1cyIsImJsdXIiLCJpcyIsImhpZGUiLCJpbWFnZVVybCIsImNzcyIsImVhY2giLCJjaGVja2JveF9jaGVjayIsImNoYW5nZSIsImVsIiwibmV4dCIsInRhYnMiLCJzd2lwZWFibGUiLCJmb3JtU2VsZWN0IiwiaW5kZXRlcm1pbmF0ZUNoZWNrYm94IiwiZ2V0RWxlbWVudEJ5SWQiLCJpbmRldGVybWluYXRlIiwic2xpZGVyIiwiZnVsbF93aWR0aCIsImRyb3Bkb3duIiwiaW5EdXJhdGlvbiIsIm91dER1cmF0aW9uIiwiY29uc3RyYWluV2lkdGgiLCJob3ZlciIsImd1dHRlciIsImNvdmVyVHJpZ2dlciIsImFsaWdubWVudCIsImZsb2F0aW5nQWN0aW9uQnV0dG9uIiwiZGlyZWN0aW9uIiwiaG92ZXJFbmFibGVkIiwidG9vbGJhckVuYWJsZWQiLCJzY3JvbGxTcHkiLCJ0b29sdGlwIiwiZGVsYXkiLCJzaWRlbmF2IiwiZWRnZSIsIm5vdCIsInNlbGVjdCIsImxlZnRuYXYiLCJoZWlnaHQiLCJsZWZ0bmF2SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJyaWdodHRuYXYiLCJwc19sZWZ0c2lkZV9uYXYiLCJQZXJmZWN0U2Nyb2xsYmFyIiwid2hlZWxTcGVlZCIsIndoZWVsUHJvcGFnYXRpb24iLCJtaW5TY3JvbGxiYXJMZW5ndGgiLCJwc19zbGlkZW91dF9yaWdodCIsInN1cHByZXNzU2Nyb2xsWCIsInBzX3NsaWRlb3V0X2NoYXQiLCJjaGF0U2Nyb2xsQXV0byIsImZ1bGxTY3JlZW5FbGVtZW50IiwibW96RnVsbFNjcmVlbiIsIndlYmtpdElzRnVsbFNjcmVlbiIsImRvY3VtZW50RWxlbWVudCIsInJlcXVlc3RGdWxsU2NyZWVuIiwibW96UmVxdWVzdEZ1bGxTY3JlZW4iLCJ3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiIsIkVsZW1lbnQiLCJBTExPV19LRVlCT0FSRF9JTlBVVCIsIm1zUmVxdWVzdEZ1bGxzY3JlZW4iLCJtc0Z1bGxzY3JlZW5FbGVtZW50IiwibXNFeGl0RnVsbHNjcmVlbiIsImNhbmNlbEZ1bGxTY3JlZW4iLCJtb3pDYW5jZWxGdWxsU2NyZWVuIiwid2Via2l0Q2FuY2VsRnVsbFNjcmVlbiIsImlzX3RvdWNoX2RldmljZSIsImNyZWF0ZUV2ZW50Iiwib3ZlcmZsb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQix5Q0FBeUMsMEJBQTBCLDJEQUEyRCxFQUFFLGtCQUFrQiwwQkFBMEIsRUFBRSxtQ0FBbUMsOEJBQThCLG9DQUFvQyxjQUFjLEVBQUU7QUFDblMsOENBQThDLGlDQUFpQyxPQUFPLE9BQU8sNkNBQTZDLEVBQUUsV0FBVzs7QUFFdko7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsV0FBVztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsV0FBVztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVIOztBQUVBOztBQUVBOztBQUVBLG9DQUFvQzs7QUFFcEM7QUFDQSxrQ0FBa0MsV0FBVztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxZQUFZO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsWUFBWTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EsYUFBYTtBQUNiLFdBQVc7QUFDWDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLFlBQVk7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsWUFBWTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSwwQ0FBMEMsWUFBWTtBQUN0RDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsWUFBWTtBQUNwRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsWUFBWTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBOztBQUVBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxZQUFZO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxZQUFZO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFlBQVk7QUFDMUQ7QUFDQTtBQUNBO0FBQ0EsaURBQWlELFlBQVk7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNLElBQTBD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QVQsQ0FBeUJHLHVCQUF6QixDQUFpREMsT0FBTyxDQUFDQyxvQkFBekQ7QUFDSCxPQUZNLE1BRUQsSUFBSTVILFFBQVEsQ0FBQ3VILGVBQVQsQ0FBeUJNLG1CQUE3QixFQUFrRDtBQUNwRCxZQUFJN0gsUUFBUSxDQUFDOEgsbUJBQWIsRUFBa0M7QUFDOUI5SCxrQkFBUSxDQUFDK0gsZ0JBQVQ7QUFDSCxTQUZELE1BRU87QUFDSC9ILGtCQUFRLENBQUN1SCxlQUFULENBQXlCTSxtQkFBekI7QUFDSDtBQUNKO0FBQ0osS0FqQkQsTUFpQk87QUFDSCxVQUFJN0gsUUFBUSxDQUFDZ0ksZ0JBQWIsRUFBK0I7QUFDM0JoSSxnQkFBUSxDQUFDZ0ksZ0JBQVQ7QUFDSCxPQUZELE1BRU8sSUFBSWhJLFFBQVEsQ0FBQ2lJLG1CQUFiLEVBQWtDO0FBQ3JDakksZ0JBQVEsQ0FBQ2lJLG1CQUFUO0FBQ0gsT0FGTSxNQUVBLElBQUlqSSxRQUFRLENBQUNrSSxzQkFBYixFQUFxQztBQUN4Q2xJLGdCQUFRLENBQUNrSSxzQkFBVDtBQUNIO0FBQ0o7QUFDSixHQXhWUSxDQTRWVDs7O0FBQ0EsV0FBU0MsZUFBVCxHQUEyQjtBQUN2QixRQUFJO0FBQ0FuSSxjQUFRLENBQUNvSSxXQUFULENBQXFCLFlBQXJCO0FBQ0EsYUFBTyxJQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU92SCxDQUFQLEVBQVU7QUFDUixhQUFPLEtBQVA7QUFDSDtBQUNKOztBQUNELE1BQUlzSCxlQUFlLEVBQW5CLEVBQXVCO0FBQ25CNUksS0FBQyxDQUFDLGFBQUQsQ0FBRCxDQUFpQjhFLEdBQWpCLENBQXFCO0FBQ2pCZ0UsY0FBUSxFQUFFO0FBRE8sS0FBckI7QUFHSDs7QUFFRHZHLGFBQVc7QUFHZCxDQTlXQSxDQUFELEMiLCJmaWxlIjoiL2pzL2JhY2tlbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiIsIihmdW5jdGlvbigpIHtcclxuICB2YXIgQWpheE1vbml0b3IsIEJhciwgRG9jdW1lbnRNb25pdG9yLCBFbGVtZW50TW9uaXRvciwgRWxlbWVudFRyYWNrZXIsIEV2ZW50TGFnTW9uaXRvciwgRXZlbnRlZCwgRXZlbnRzLCBOb1RhcmdldEVycm9yLCBQYWNlLCBSZXF1ZXN0SW50ZXJjZXB0LCBTT1VSQ0VfS0VZUywgU2NhbGVyLCBTb2NrZXRSZXF1ZXN0VHJhY2tlciwgWEhSUmVxdWVzdFRyYWNrZXIsIGFuaW1hdGlvbiwgYXZnQW1wbGl0dWRlLCBiYXIsIGNhbmNlbEFuaW1hdGlvbiwgY2FuY2VsQW5pbWF0aW9uRnJhbWUsIGRlZmF1bHRPcHRpb25zLCBleHRlbmQsIGV4dGVuZE5hdGl2ZSwgZ2V0RnJvbURPTSwgZ2V0SW50ZXJjZXB0LCBoYW5kbGVQdXNoU3RhdGUsIGlnbm9yZVN0YWNrLCBpbml0LCBub3csIG9wdGlvbnMsIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgcmVzdWx0LCBydW5BbmltYXRpb24sIHNjYWxlcnMsIHNob3VsZElnbm9yZVVSTCwgc2hvdWxkVHJhY2ssIHNvdXJjZSwgc291cmNlcywgdW5pU2NhbGVyLCBfV2ViU29ja2V0LCBfWERvbWFpblJlcXVlc3QsIF9YTUxIdHRwUmVxdWVzdCwgX2ksIF9pbnRlcmNlcHQsIF9sZW4sIF9wdXNoU3RhdGUsIF9yZWYsIF9yZWYxLCBfcmVwbGFjZVN0YXRlLFxyXG4gICAgX19zbGljZSA9IFtdLnNsaWNlLFxyXG4gICAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXHJcbiAgICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcclxuICAgIF9faW5kZXhPZiA9IFtdLmluZGV4T2YgfHwgZnVuY3Rpb24oaXRlbSkgeyBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7IGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkgcmV0dXJuIGk7IH0gcmV0dXJuIC0xOyB9O1xyXG5cclxuICBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgIGNhdGNodXBUaW1lOiAxMDAsXHJcbiAgICBpbml0aWFsUmF0ZTogLjAzLFxyXG4gICAgbWluVGltZTogMjUwLFxyXG4gICAgZ2hvc3RUaW1lOiAxMDAsXHJcbiAgICBtYXhQcm9ncmVzc1BlckZyYW1lOiAyMCxcclxuICAgIGVhc2VGYWN0b3I6IDEuMjUsXHJcbiAgICBzdGFydE9uUGFnZUxvYWQ6IHRydWUsXHJcbiAgICByZXN0YXJ0T25QdXNoU3RhdGU6IHRydWUsXHJcbiAgICByZXN0YXJ0T25SZXF1ZXN0QWZ0ZXI6IDUwMCxcclxuICAgIHRhcmdldDogJ2JvZHknLFxyXG4gICAgZWxlbWVudHM6IHtcclxuICAgICAgY2hlY2tJbnRlcnZhbDogMTAwLFxyXG4gICAgICBzZWxlY3RvcnM6IFsnYm9keSddXHJcbiAgICB9LFxyXG4gICAgZXZlbnRMYWc6IHtcclxuICAgICAgbWluU2FtcGxlczogMTAsXHJcbiAgICAgIHNhbXBsZUNvdW50OiAzLFxyXG4gICAgICBsYWdUaHJlc2hvbGQ6IDNcclxuICAgIH0sXHJcbiAgICBhamF4OiB7XHJcbiAgICAgIHRyYWNrTWV0aG9kczogWydHRVQnXSxcclxuICAgICAgdHJhY2tXZWJTb2NrZXRzOiB0cnVlLFxyXG4gICAgICBpZ25vcmVVUkxzOiBbXVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG5vdyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIF9yZWY7XHJcbiAgICByZXR1cm4gKF9yZWYgPSB0eXBlb2YgcGVyZm9ybWFuY2UgIT09IFwidW5kZWZpbmVkXCIgJiYgcGVyZm9ybWFuY2UgIT09IG51bGwgPyB0eXBlb2YgcGVyZm9ybWFuY2Uubm93ID09PSBcImZ1bmN0aW9uXCIgPyBwZXJmb3JtYW5jZS5ub3coKSA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCA/IF9yZWYgOiArKG5ldyBEYXRlKTtcclxuICB9O1xyXG5cclxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XHJcblxyXG4gIGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZTtcclxuXHJcbiAgaWYgKHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PSBudWxsKSB7XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihmbikge1xyXG4gICAgICByZXR1cm4gc2V0VGltZW91dChmbiwgNTApO1xyXG4gICAgfTtcclxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oaWQpIHtcclxuICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChpZCk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcnVuQW5pbWF0aW9uID0gZnVuY3Rpb24oZm4pIHtcclxuICAgIHZhciBsYXN0LCB0aWNrO1xyXG4gICAgbGFzdCA9IG5vdygpO1xyXG4gICAgdGljayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGlmZjtcclxuICAgICAgZGlmZiA9IG5vdygpIC0gbGFzdDtcclxuICAgICAgaWYgKGRpZmYgPj0gMzMpIHtcclxuICAgICAgICBsYXN0ID0gbm93KCk7XHJcbiAgICAgICAgcmV0dXJuIGZuKGRpZmYsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc2V0VGltZW91dCh0aWNrLCAzMyAtIGRpZmYpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHRpY2soKTtcclxuICB9O1xyXG5cclxuICByZXN1bHQgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBhcmdzLCBrZXksIG9iajtcclxuICAgIG9iaiA9IGFyZ3VtZW50c1swXSwga2V5ID0gYXJndW1lbnRzWzFdLCBhcmdzID0gMyA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiBbXTtcclxuICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgcmV0dXJuIG9ialtrZXldLmFwcGx5KG9iaiwgYXJncyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gb2JqW2tleV07XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZXh0ZW5kID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIga2V5LCBvdXQsIHNvdXJjZSwgc291cmNlcywgdmFsLCBfaSwgX2xlbjtcclxuICAgIG91dCA9IGFyZ3VtZW50c1swXSwgc291cmNlcyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XHJcbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IHNvdXJjZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcclxuICAgICAgc291cmNlID0gc291cmNlc1tfaV07XHJcbiAgICAgIGlmIChzb3VyY2UpIHtcclxuICAgICAgICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgICAgIGlmICghX19oYXNQcm9wLmNhbGwoc291cmNlLCBrZXkpKSBjb250aW51ZTtcclxuICAgICAgICAgIHZhbCA9IHNvdXJjZVtrZXldO1xyXG4gICAgICAgICAgaWYgKChvdXRba2V5XSAhPSBudWxsKSAmJiB0eXBlb2Ygb3V0W2tleV0gPT09ICdvYmplY3QnICYmICh2YWwgIT0gbnVsbCkgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZXh0ZW5kKG91dFtrZXldLCB2YWwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3V0W2tleV0gPSB2YWw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG4gIH07XHJcblxyXG4gIGF2Z0FtcGxpdHVkZSA9IGZ1bmN0aW9uKGFycikge1xyXG4gICAgdmFyIGNvdW50LCBzdW0sIHYsIF9pLCBfbGVuO1xyXG4gICAgc3VtID0gY291bnQgPSAwO1xyXG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBhcnIubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcclxuICAgICAgdiA9IGFycltfaV07XHJcbiAgICAgIHN1bSArPSBNYXRoLmFicyh2KTtcclxuICAgICAgY291bnQrKztcclxuICAgIH1cclxuICAgIHJldHVybiBzdW0gLyBjb3VudDtcclxuICB9O1xyXG5cclxuICBnZXRGcm9tRE9NID0gZnVuY3Rpb24oa2V5LCBqc29uKSB7XHJcbiAgICB2YXIgZGF0YSwgZSwgZWw7XHJcbiAgICBpZiAoa2V5ID09IG51bGwpIHtcclxuICAgICAga2V5ID0gJ29wdGlvbnMnO1xyXG4gICAgfVxyXG4gICAgaWYgKGpzb24gPT0gbnVsbCkge1xyXG4gICAgICBqc29uID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltkYXRhLXBhY2UtXCIgKyBrZXkgKyBcIl1cIik7XHJcbiAgICBpZiAoIWVsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGRhdGEgPSBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhY2UtXCIgKyBrZXkpO1xyXG4gICAgaWYgKCFqc29uKSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XHJcbiAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgZSA9IF9lcnJvcjtcclxuICAgICAgcmV0dXJuIHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnNvbGUgIT09IG51bGwgPyBjb25zb2xlLmVycm9yKFwiRXJyb3IgcGFyc2luZyBpbmxpbmUgcGFjZSBvcHRpb25zXCIsIGUpIDogdm9pZCAwO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIEV2ZW50ZWQgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBmdW5jdGlvbiBFdmVudGVkKCkge31cclxuXHJcbiAgICBFdmVudGVkLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGV2ZW50LCBoYW5kbGVyLCBjdHgsIG9uY2UpIHtcclxuICAgICAgdmFyIF9iYXNlO1xyXG4gICAgICBpZiAob25jZSA9PSBudWxsKSB7XHJcbiAgICAgICAgb25jZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmJpbmRpbmdzID09IG51bGwpIHtcclxuICAgICAgICB0aGlzLmJpbmRpbmdzID0ge307XHJcbiAgICAgIH1cclxuICAgICAgaWYgKChfYmFzZSA9IHRoaXMuYmluZGluZ3MpW2V2ZW50XSA9PSBudWxsKSB7XHJcbiAgICAgICAgX2Jhc2VbZXZlbnRdID0gW107XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3NbZXZlbnRdLnB1c2goe1xyXG4gICAgICAgIGhhbmRsZXI6IGhhbmRsZXIsXHJcbiAgICAgICAgY3R4OiBjdHgsXHJcbiAgICAgICAgb25jZTogb25jZVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgRXZlbnRlZC5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBoYW5kbGVyLCBjdHgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub24oZXZlbnQsIGhhbmRsZXIsIGN0eCwgdHJ1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKGV2ZW50LCBoYW5kbGVyKSB7XHJcbiAgICAgIHZhciBpLCBfcmVmLCBfcmVzdWx0cztcclxuICAgICAgaWYgKCgoX3JlZiA9IHRoaXMuYmluZGluZ3MpICE9IG51bGwgPyBfcmVmW2V2ZW50XSA6IHZvaWQgMCkgPT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaGFuZGxlciA9PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLmJpbmRpbmdzW2V2ZW50XTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpID0gMDtcclxuICAgICAgICBfcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5iaW5kaW5nc1tldmVudF0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5iaW5kaW5nc1tldmVudF1baV0uaGFuZGxlciA9PT0gaGFuZGxlcikge1xyXG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuYmluZGluZ3NbZXZlbnRdLnNwbGljZShpLCAxKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGkrKyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBFdmVudGVkLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBhcmdzLCBjdHgsIGV2ZW50LCBoYW5kbGVyLCBpLCBvbmNlLCBfcmVmLCBfcmVmMSwgX3Jlc3VsdHM7XHJcbiAgICAgIGV2ZW50ID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcclxuICAgICAgaWYgKChfcmVmID0gdGhpcy5iaW5kaW5ncykgIT0gbnVsbCA/IF9yZWZbZXZlbnRdIDogdm9pZCAwKSB7XHJcbiAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcclxuICAgICAgICB3aGlsZSAoaSA8IHRoaXMuYmluZGluZ3NbZXZlbnRdLmxlbmd0aCkge1xyXG4gICAgICAgICAgX3JlZjEgPSB0aGlzLmJpbmRpbmdzW2V2ZW50XVtpXSwgaGFuZGxlciA9IF9yZWYxLmhhbmRsZXIsIGN0eCA9IF9yZWYxLmN0eCwgb25jZSA9IF9yZWYxLm9uY2U7XHJcbiAgICAgICAgICBoYW5kbGVyLmFwcGx5KGN0eCAhPSBudWxsID8gY3R4IDogdGhpcywgYXJncyk7XHJcbiAgICAgICAgICBpZiAob25jZSkge1xyXG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuYmluZGluZ3NbZXZlbnRdLnNwbGljZShpLCAxKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGkrKyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gRXZlbnRlZDtcclxuXHJcbiAgfSkoKTtcclxuXHJcbiAgUGFjZSA9IHdpbmRvdy5QYWNlIHx8IHt9O1xyXG5cclxuICB3aW5kb3cuUGFjZSA9IFBhY2U7XHJcblxyXG4gIGV4dGVuZChQYWNlLCBFdmVudGVkLnByb3RvdHlwZSk7XHJcblxyXG4gIG9wdGlvbnMgPSBQYWNlLm9wdGlvbnMgPSBleHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCB3aW5kb3cucGFjZU9wdGlvbnMsIGdldEZyb21ET00oKSk7XHJcblxyXG4gIF9yZWYgPSBbJ2FqYXgnLCAnZG9jdW1lbnQnLCAnZXZlbnRMYWcnLCAnZWxlbWVudHMnXTtcclxuICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcclxuICAgIHNvdXJjZSA9IF9yZWZbX2ldO1xyXG4gICAgaWYgKG9wdGlvbnNbc291cmNlXSA9PT0gdHJ1ZSkge1xyXG4gICAgICBvcHRpb25zW3NvdXJjZV0gPSBkZWZhdWx0T3B0aW9uc1tzb3VyY2VdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgTm9UYXJnZXRFcnJvciA9IChmdW5jdGlvbihfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhOb1RhcmdldEVycm9yLCBfc3VwZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIE5vVGFyZ2V0RXJyb3IoKSB7XHJcbiAgICAgIF9yZWYxID0gTm9UYXJnZXRFcnJvci5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgcmV0dXJuIF9yZWYxO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBOb1RhcmdldEVycm9yO1xyXG5cclxuICB9KShFcnJvcik7XHJcblxyXG4gIEJhciA9IChmdW5jdGlvbigpIHtcclxuICAgIGZ1bmN0aW9uIEJhcigpIHtcclxuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgQmFyLnByb3RvdHlwZS5nZXRFbGVtZW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciB0YXJnZXRFbGVtZW50O1xyXG4gICAgICBpZiAodGhpcy5lbCA9PSBudWxsKSB7XHJcbiAgICAgICAgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy50YXJnZXQpO1xyXG4gICAgICAgIGlmICghdGFyZ2V0RWxlbWVudCkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IE5vVGFyZ2V0RXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLmVsLmNsYXNzTmFtZSA9IFwicGFjZSBwYWNlLWFjdGl2ZVwiO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSgvcGFjZS1kb25lL2csICcnKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArPSAnIHBhY2UtcnVubmluZyc7XHJcbiAgICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cInBhY2UtcHJvZ3Jlc3NcIj5cXG4gIDxkaXYgY2xhc3M9XCJwYWNlLXByb2dyZXNzLWlubmVyXCI+PC9kaXY+XFxuPC9kaXY+XFxuPGRpdiBjbGFzcz1cInBhY2UtYWN0aXZpdHlcIj48L2Rpdj4nO1xyXG4gICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmZpcnN0Q2hpbGQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgdGFyZ2V0RWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5lbCwgdGFyZ2V0RWxlbWVudC5maXJzdENoaWxkKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGFyZ2V0RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXMuZWw7XHJcbiAgICB9O1xyXG5cclxuICAgIEJhci5wcm90b3R5cGUuZmluaXNoID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBlbDtcclxuICAgICAgZWwgPSB0aGlzLmdldEVsZW1lbnQoKTtcclxuICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoJ3BhY2UtYWN0aXZlJywgJycpO1xyXG4gICAgICBlbC5jbGFzc05hbWUgKz0gJyBwYWNlLWluYWN0aXZlJztcclxuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKCdwYWNlLXJ1bm5pbmcnLCAnJyk7XHJcbiAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArPSAnIHBhY2UtZG9uZSc7XHJcbiAgICB9O1xyXG5cclxuICAgIEJhci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ocHJvZykge1xyXG4gICAgICB0aGlzLnByb2dyZXNzID0gcHJvZztcclxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIEJhci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudCgpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5nZXRFbGVtZW50KCkpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICBOb1RhcmdldEVycm9yID0gX2Vycm9yO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzLmVsID0gdm9pZCAwO1xyXG4gICAgfTtcclxuXHJcbiAgICBCYXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZWwsIGtleSwgcHJvZ3Jlc3NTdHIsIHRyYW5zZm9ybSwgX2osIF9sZW4xLCBfcmVmMjtcclxuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy50YXJnZXQpID09IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgZWwgPSB0aGlzLmdldEVsZW1lbnQoKTtcclxuICAgICAgdHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUzZChcIiArIHRoaXMucHJvZ3Jlc3MgKyBcIiUsIDAsIDApXCI7XHJcbiAgICAgIF9yZWYyID0gWyd3ZWJraXRUcmFuc2Zvcm0nLCAnbXNUcmFuc2Zvcm0nLCAndHJhbnNmb3JtJ107XHJcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xyXG4gICAgICAgIGtleSA9IF9yZWYyW19qXTtcclxuICAgICAgICBlbC5jaGlsZHJlblswXS5zdHlsZVtrZXldID0gdHJhbnNmb3JtO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghdGhpcy5sYXN0UmVuZGVyZWRQcm9ncmVzcyB8fCB0aGlzLmxhc3RSZW5kZXJlZFByb2dyZXNzIHwgMCAhPT0gdGhpcy5wcm9ncmVzcyB8IDApIHtcclxuICAgICAgICBlbC5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZ3Jlc3MtdGV4dCcsIFwiXCIgKyAodGhpcy5wcm9ncmVzcyB8IDApICsgXCIlXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLnByb2dyZXNzID49IDEwMCkge1xyXG4gICAgICAgICAgcHJvZ3Jlc3NTdHIgPSAnOTknO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9ncmVzc1N0ciA9IHRoaXMucHJvZ3Jlc3MgPCAxMCA/IFwiMFwiIDogXCJcIjtcclxuICAgICAgICAgIHByb2dyZXNzU3RyICs9IHRoaXMucHJvZ3Jlc3MgfCAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbC5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZ3Jlc3MnLCBcIlwiICsgcHJvZ3Jlc3NTdHIpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzLmxhc3RSZW5kZXJlZFByb2dyZXNzID0gdGhpcy5wcm9ncmVzcztcclxuICAgIH07XHJcblxyXG4gICAgQmFyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzID49IDEwMDtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIEJhcjtcclxuXHJcbiAgfSkoKTtcclxuXHJcbiAgRXZlbnRzID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgZnVuY3Rpb24gRXZlbnRzKCkge1xyXG4gICAgICB0aGlzLmJpbmRpbmdzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgRXZlbnRzLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24obmFtZSwgdmFsKSB7XHJcbiAgICAgIHZhciBiaW5kaW5nLCBfaiwgX2xlbjEsIF9yZWYyLCBfcmVzdWx0cztcclxuICAgICAgaWYgKHRoaXMuYmluZGluZ3NbbmFtZV0gIT0gbnVsbCkge1xyXG4gICAgICAgIF9yZWYyID0gdGhpcy5iaW5kaW5nc1tuYW1lXTtcclxuICAgICAgICBfcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xyXG4gICAgICAgICAgYmluZGluZyA9IF9yZWYyW19qXTtcclxuICAgICAgICAgIF9yZXN1bHRzLnB1c2goYmluZGluZy5jYWxsKHRoaXMsIHZhbCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgRXZlbnRzLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKG5hbWUsIGZuKSB7XHJcbiAgICAgIHZhciBfYmFzZTtcclxuICAgICAgaWYgKChfYmFzZSA9IHRoaXMuYmluZGluZ3MpW25hbWVdID09IG51bGwpIHtcclxuICAgICAgICBfYmFzZVtuYW1lXSA9IFtdO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzW25hbWVdLnB1c2goZm4pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gRXZlbnRzO1xyXG5cclxuICB9KSgpO1xyXG5cclxuICBfWE1MSHR0cFJlcXVlc3QgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3Q7XHJcblxyXG4gIF9YRG9tYWluUmVxdWVzdCA9IHdpbmRvdy5YRG9tYWluUmVxdWVzdDtcclxuXHJcbiAgX1dlYlNvY2tldCA9IHdpbmRvdy5XZWJTb2NrZXQ7XHJcblxyXG4gIGV4dGVuZE5hdGl2ZSA9IGZ1bmN0aW9uKHRvLCBmcm9tKSB7XHJcbiAgICB2YXIgZSwga2V5LCBfcmVzdWx0cztcclxuICAgIF9yZXN1bHRzID0gW107XHJcbiAgICBmb3IgKGtleSBpbiBmcm9tLnByb3RvdHlwZSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGlmICgodG9ba2V5XSA9PSBudWxsKSAmJiB0eXBlb2YgZnJvbVtrZXldICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0bywga2V5LCB7XHJcbiAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmcm9tLnByb3RvdHlwZVtrZXldO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0b1trZXldID0gZnJvbS5wcm90b3R5cGVba2V5XSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgIGUgPSBfZXJyb3I7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBfcmVzdWx0cztcclxuICB9O1xyXG5cclxuICBpZ25vcmVTdGFjayA9IFtdO1xyXG5cclxuICBQYWNlLmlnbm9yZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGFyZ3MsIGZuLCByZXQ7XHJcbiAgICBmbiA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XHJcbiAgICBpZ25vcmVTdGFjay51bnNoaWZ0KCdpZ25vcmUnKTtcclxuICAgIHJldCA9IGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xyXG4gICAgaWdub3JlU3RhY2suc2hpZnQoKTtcclxuICAgIHJldHVybiByZXQ7XHJcbiAgfTtcclxuXHJcbiAgUGFjZS50cmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGFyZ3MsIGZuLCByZXQ7XHJcbiAgICBmbiA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XHJcbiAgICBpZ25vcmVTdGFjay51bnNoaWZ0KCd0cmFjaycpO1xyXG4gICAgcmV0ID0gZm4uYXBwbHkobnVsbCwgYXJncyk7XHJcbiAgICBpZ25vcmVTdGFjay5zaGlmdCgpO1xyXG4gICAgcmV0dXJuIHJldDtcclxuICB9O1xyXG5cclxuICBzaG91bGRUcmFjayA9IGZ1bmN0aW9uKG1ldGhvZCkge1xyXG4gICAgdmFyIF9yZWYyO1xyXG4gICAgaWYgKG1ldGhvZCA9PSBudWxsKSB7XHJcbiAgICAgIG1ldGhvZCA9ICdHRVQnO1xyXG4gICAgfVxyXG4gICAgaWYgKGlnbm9yZVN0YWNrWzBdID09PSAndHJhY2snKSB7XHJcbiAgICAgIHJldHVybiAnZm9yY2UnO1xyXG4gICAgfVxyXG4gICAgaWYgKCFpZ25vcmVTdGFjay5sZW5ndGggJiYgb3B0aW9ucy5hamF4KSB7XHJcbiAgICAgIGlmIChtZXRob2QgPT09ICdzb2NrZXQnICYmIG9wdGlvbnMuYWpheC50cmFja1dlYlNvY2tldHMpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSBlbHNlIGlmIChfcmVmMiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpLCBfX2luZGV4T2YuY2FsbChvcHRpb25zLmFqYXgudHJhY2tNZXRob2RzLCBfcmVmMikgPj0gMCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgUmVxdWVzdEludGVyY2VwdCA9IChmdW5jdGlvbihfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhSZXF1ZXN0SW50ZXJjZXB0LCBfc3VwZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIFJlcXVlc3RJbnRlcmNlcHQoKSB7XHJcbiAgICAgIHZhciBtb25pdG9yWEhSLFxyXG4gICAgICAgIF90aGlzID0gdGhpcztcclxuICAgICAgUmVxdWVzdEludGVyY2VwdC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgbW9uaXRvclhIUiA9IGZ1bmN0aW9uKHJlcSkge1xyXG4gICAgICAgIHZhciBfb3BlbjtcclxuICAgICAgICBfb3BlbiA9IHJlcS5vcGVuO1xyXG4gICAgICAgIHJldHVybiByZXEub3BlbiA9IGZ1bmN0aW9uKHR5cGUsIHVybCwgYXN5bmMpIHtcclxuICAgICAgICAgIGlmIChzaG91bGRUcmFjayh0eXBlKSkge1xyXG4gICAgICAgICAgICBfdGhpcy50cmlnZ2VyKCdyZXF1ZXN0Jywge1xyXG4gICAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgcmVxdWVzdDogcmVxXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIF9vcGVuLmFwcGx5KHJlcSwgYXJndW1lbnRzKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9O1xyXG4gICAgICB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPSBmdW5jdGlvbihmbGFncykge1xyXG4gICAgICAgIHZhciByZXE7XHJcbiAgICAgICAgcmVxID0gbmV3IF9YTUxIdHRwUmVxdWVzdChmbGFncyk7XHJcbiAgICAgICAgbW9uaXRvclhIUihyZXEpO1xyXG4gICAgICAgIHJldHVybiByZXE7XHJcbiAgICAgIH07XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5YTUxIdHRwUmVxdWVzdCwgX1hNTEh0dHBSZXF1ZXN0KTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7fVxyXG4gICAgICBpZiAoX1hEb21haW5SZXF1ZXN0ICE9IG51bGwpIHtcclxuICAgICAgICB3aW5kb3cuWERvbWFpblJlcXVlc3QgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciByZXE7XHJcbiAgICAgICAgICByZXEgPSBuZXcgX1hEb21haW5SZXF1ZXN0O1xyXG4gICAgICAgICAgbW9uaXRvclhIUihyZXEpO1xyXG4gICAgICAgICAgcmV0dXJuIHJlcTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBleHRlbmROYXRpdmUod2luZG93LlhEb21haW5SZXF1ZXN0LCBfWERvbWFpblJlcXVlc3QpO1xyXG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cclxuICAgICAgfVxyXG4gICAgICBpZiAoKF9XZWJTb2NrZXQgIT0gbnVsbCkgJiYgb3B0aW9ucy5hamF4LnRyYWNrV2ViU29ja2V0cykge1xyXG4gICAgICAgIHdpbmRvdy5XZWJTb2NrZXQgPSBmdW5jdGlvbih1cmwsIHByb3RvY29scykge1xyXG4gICAgICAgICAgdmFyIHJlcTtcclxuICAgICAgICAgIGlmIChwcm90b2NvbHMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXEgPSBuZXcgX1dlYlNvY2tldCh1cmwsIHByb3RvY29scyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXEgPSBuZXcgX1dlYlNvY2tldCh1cmwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHNob3VsZFRyYWNrKCdzb2NrZXQnKSkge1xyXG4gICAgICAgICAgICBfdGhpcy50cmlnZ2VyKCdyZXF1ZXN0Jywge1xyXG4gICAgICAgICAgICAgIHR5cGU6ICdzb2NrZXQnLFxyXG4gICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgIHByb3RvY29sczogcHJvdG9jb2xzLFxyXG4gICAgICAgICAgICAgIHJlcXVlc3Q6IHJlcVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiByZXE7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5XZWJTb2NrZXQsIF9XZWJTb2NrZXQpO1xyXG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBSZXF1ZXN0SW50ZXJjZXB0O1xyXG5cclxuICB9KShFdmVudHMpO1xyXG5cclxuICBfaW50ZXJjZXB0ID0gbnVsbDtcclxuXHJcbiAgZ2V0SW50ZXJjZXB0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoX2ludGVyY2VwdCA9PSBudWxsKSB7XHJcbiAgICAgIF9pbnRlcmNlcHQgPSBuZXcgUmVxdWVzdEludGVyY2VwdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfaW50ZXJjZXB0O1xyXG4gIH07XHJcblxyXG4gIHNob3VsZElnbm9yZVVSTCA9IGZ1bmN0aW9uKHVybCkge1xyXG4gICAgdmFyIHBhdHRlcm4sIF9qLCBfbGVuMSwgX3JlZjI7XHJcbiAgICBfcmVmMiA9IG9wdGlvbnMuYWpheC5pZ25vcmVVUkxzO1xyXG4gICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XHJcbiAgICAgIHBhdHRlcm4gPSBfcmVmMltfal07XHJcbiAgICAgIGlmICh0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBpZiAodXJsLmluZGV4T2YocGF0dGVybikgIT09IC0xKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHBhdHRlcm4udGVzdCh1cmwpKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG5cclxuICBnZXRJbnRlcmNlcHQoKS5vbigncmVxdWVzdCcsIGZ1bmN0aW9uKF9hcmcpIHtcclxuICAgIHZhciBhZnRlciwgYXJncywgcmVxdWVzdCwgdHlwZSwgdXJsO1xyXG4gICAgdHlwZSA9IF9hcmcudHlwZSwgcmVxdWVzdCA9IF9hcmcucmVxdWVzdCwgdXJsID0gX2FyZy51cmw7XHJcbiAgICBpZiAoc2hvdWxkSWdub3JlVVJMKHVybCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKCFQYWNlLnJ1bm5pbmcgJiYgKG9wdGlvbnMucmVzdGFydE9uUmVxdWVzdEFmdGVyICE9PSBmYWxzZSB8fCBzaG91bGRUcmFjayh0eXBlKSA9PT0gJ2ZvcmNlJykpIHtcclxuICAgICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgYWZ0ZXIgPSBvcHRpb25zLnJlc3RhcnRPblJlcXVlc3RBZnRlciB8fCAwO1xyXG4gICAgICBpZiAodHlwZW9mIGFmdGVyID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICBhZnRlciA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHN0aWxsQWN0aXZlLCBfaiwgX2xlbjEsIF9yZWYyLCBfcmVmMywgX3Jlc3VsdHM7XHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzb2NrZXQnKSB7XHJcbiAgICAgICAgICBzdGlsbEFjdGl2ZSA9IHJlcXVlc3QucmVhZHlTdGF0ZSA8IDI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHN0aWxsQWN0aXZlID0gKDAgPCAoX3JlZjIgPSByZXF1ZXN0LnJlYWR5U3RhdGUpICYmIF9yZWYyIDwgNCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzdGlsbEFjdGl2ZSkge1xyXG4gICAgICAgICAgUGFjZS5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICBfcmVmMyA9IFBhY2Uuc291cmNlcztcclxuICAgICAgICAgIF9yZXN1bHRzID0gW107XHJcbiAgICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMy5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcclxuICAgICAgICAgICAgc291cmNlID0gX3JlZjNbX2pdO1xyXG4gICAgICAgICAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgQWpheE1vbml0b3IpIHtcclxuICAgICAgICAgICAgICBzb3VyY2Uud2F0Y2guYXBwbHkoc291cmNlLCBhcmdzKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcclxuICAgICAgICB9XHJcbiAgICAgIH0sIGFmdGVyKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgQWpheE1vbml0b3IgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBmdW5jdGlvbiBBamF4TW9uaXRvcigpIHtcclxuICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgdGhpcy5lbGVtZW50cyA9IFtdO1xyXG4gICAgICBnZXRJbnRlcmNlcHQoKS5vbigncmVxdWVzdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBfdGhpcy53YXRjaC5hcHBseShfdGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgQWpheE1vbml0b3IucHJvdG90eXBlLndhdGNoID0gZnVuY3Rpb24oX2FyZykge1xyXG4gICAgICB2YXIgcmVxdWVzdCwgdHJhY2tlciwgdHlwZSwgdXJsO1xyXG4gICAgICB0eXBlID0gX2FyZy50eXBlLCByZXF1ZXN0ID0gX2FyZy5yZXF1ZXN0LCB1cmwgPSBfYXJnLnVybDtcclxuICAgICAgaWYgKHNob3VsZElnbm9yZVVSTCh1cmwpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0eXBlID09PSAnc29ja2V0Jykge1xyXG4gICAgICAgIHRyYWNrZXIgPSBuZXcgU29ja2V0UmVxdWVzdFRyYWNrZXIocmVxdWVzdCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdHJhY2tlciA9IG5ldyBYSFJSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50cy5wdXNoKHRyYWNrZXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gQWpheE1vbml0b3I7XHJcblxyXG4gIH0pKCk7XHJcblxyXG4gIFhIUlJlcXVlc3RUcmFja2VyID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgZnVuY3Rpb24gWEhSUmVxdWVzdFRyYWNrZXIocmVxdWVzdCkge1xyXG4gICAgICB2YXIgZXZlbnQsIHNpemUsIF9qLCBfbGVuMSwgX29ucmVhZHlzdGF0ZWNoYW5nZSwgX3JlZjIsXHJcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xyXG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcclxuICAgICAgaWYgKHdpbmRvdy5Qcm9ncmVzc0V2ZW50ICE9IG51bGwpIHtcclxuICAgICAgICBzaXplID0gbnVsbDtcclxuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICAgICAgICBpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IF90aGlzLnByb2dyZXNzICsgKDEwMCAtIF90aGlzLnByb2dyZXNzKSAvIDI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIF9yZWYyID0gWydsb2FkJywgJ2Fib3J0JywgJ3RpbWVvdXQnLCAnZXJyb3InXTtcclxuICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcclxuICAgICAgICAgIGV2ZW50ID0gX3JlZjJbX2pdO1xyXG4gICAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwO1xyXG4gICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBfb25yZWFkeXN0YXRlY2hhbmdlID0gcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2U7XHJcbiAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciBfcmVmMztcclxuICAgICAgICAgIGlmICgoX3JlZjMgPSByZXF1ZXN0LnJlYWR5U3RhdGUpID09PSAwIHx8IF9yZWYzID09PSA0KSB7XHJcbiAgICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gMTAwO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDMpIHtcclxuICAgICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSA1MDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiB0eXBlb2YgX29ucmVhZHlzdGF0ZWNoYW5nZSA9PT0gXCJmdW5jdGlvblwiID8gX29ucmVhZHlzdGF0ZWNoYW5nZS5hcHBseShudWxsLCBhcmd1bWVudHMpIDogdm9pZCAwO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gWEhSUmVxdWVzdFRyYWNrZXI7XHJcblxyXG4gIH0pKCk7XHJcblxyXG4gIFNvY2tldFJlcXVlc3RUcmFja2VyID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgZnVuY3Rpb24gU29ja2V0UmVxdWVzdFRyYWNrZXIocmVxdWVzdCkge1xyXG4gICAgICB2YXIgZXZlbnQsIF9qLCBfbGVuMSwgX3JlZjIsXHJcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xyXG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcclxuICAgICAgX3JlZjIgPSBbJ2Vycm9yJywgJ29wZW4nXTtcclxuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XHJcbiAgICAgICAgZXZlbnQgPSBfcmVmMltfal07XHJcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gU29ja2V0UmVxdWVzdFRyYWNrZXI7XHJcblxyXG4gIH0pKCk7XHJcblxyXG4gIEVsZW1lbnRNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgZnVuY3Rpb24gRWxlbWVudE1vbml0b3Iob3B0aW9ucykge1xyXG4gICAgICB2YXIgc2VsZWN0b3IsIF9qLCBfbGVuMSwgX3JlZjI7XHJcbiAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcclxuICAgICAgICBvcHRpb25zID0ge307XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5lbGVtZW50cyA9IFtdO1xyXG4gICAgICBpZiAob3B0aW9ucy5zZWxlY3RvcnMgPT0gbnVsbCkge1xyXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0b3JzID0gW107XHJcbiAgICAgIH1cclxuICAgICAgX3JlZjIgPSBvcHRpb25zLnNlbGVjdG9ycztcclxuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XHJcbiAgICAgICAgc2VsZWN0b3IgPSBfcmVmMltfal07XHJcbiAgICAgICAgdGhpcy5lbGVtZW50cy5wdXNoKG5ldyBFbGVtZW50VHJhY2tlcihzZWxlY3RvcikpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIEVsZW1lbnRNb25pdG9yO1xyXG5cclxuICB9KSgpO1xyXG5cclxuICBFbGVtZW50VHJhY2tlciA9IChmdW5jdGlvbigpIHtcclxuICAgIGZ1bmN0aW9uIEVsZW1lbnRUcmFja2VyKHNlbGVjdG9yKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0b3IgPSBzZWxlY3RvcjtcclxuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XHJcbiAgICAgIHRoaXMuY2hlY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBFbGVtZW50VHJhY2tlci5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3RvcikpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgcmV0dXJuIF90aGlzLmNoZWNrKCk7XHJcbiAgICAgICAgfSksIG9wdGlvbnMuZWxlbWVudHMuY2hlY2tJbnRlcnZhbCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgRWxlbWVudFRyYWNrZXIucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3MgPSAxMDA7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBFbGVtZW50VHJhY2tlcjtcclxuXHJcbiAgfSkoKTtcclxuXHJcbiAgRG9jdW1lbnRNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgRG9jdW1lbnRNb25pdG9yLnByb3RvdHlwZS5zdGF0ZXMgPSB7XHJcbiAgICAgIGxvYWRpbmc6IDAsXHJcbiAgICAgIGludGVyYWN0aXZlOiA1MCxcclxuICAgICAgY29tcGxldGU6IDEwMFxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBEb2N1bWVudE1vbml0b3IoKSB7XHJcbiAgICAgIHZhciBfb25yZWFkeXN0YXRlY2hhbmdlLCBfcmVmMixcclxuICAgICAgICBfdGhpcyA9IHRoaXM7XHJcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAoX3JlZjIgPSB0aGlzLnN0YXRlc1tkb2N1bWVudC5yZWFkeVN0YXRlXSkgIT0gbnVsbCA/IF9yZWYyIDogMTAwO1xyXG4gICAgICBfb25yZWFkeXN0YXRlY2hhbmdlID0gZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlO1xyXG4gICAgICBkb2N1bWVudC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoX3RoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdICE9IG51bGwpIHtcclxuICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gX3RoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHlwZW9mIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPT09IFwiZnVuY3Rpb25cIiA/IF9vbnJlYWR5c3RhdGVjaGFuZ2UuYXBwbHkobnVsbCwgYXJndW1lbnRzKSA6IHZvaWQgMDtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gRG9jdW1lbnRNb25pdG9yO1xyXG5cclxuICB9KSgpO1xyXG5cclxuICBFdmVudExhZ01vbml0b3IgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBmdW5jdGlvbiBFdmVudExhZ01vbml0b3IoKSB7XHJcbiAgICAgIHZhciBhdmcsIGludGVydmFsLCBsYXN0LCBwb2ludHMsIHNhbXBsZXMsXHJcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xyXG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcclxuICAgICAgYXZnID0gMDtcclxuICAgICAgc2FtcGxlcyA9IFtdO1xyXG4gICAgICBwb2ludHMgPSAwO1xyXG4gICAgICBsYXN0ID0gbm93KCk7XHJcbiAgICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGRpZmY7XHJcbiAgICAgICAgZGlmZiA9IG5vdygpIC0gbGFzdCAtIDUwO1xyXG4gICAgICAgIGxhc3QgPSBub3coKTtcclxuICAgICAgICBzYW1wbGVzLnB1c2goZGlmZik7XHJcbiAgICAgICAgaWYgKHNhbXBsZXMubGVuZ3RoID4gb3B0aW9ucy5ldmVudExhZy5zYW1wbGVDb3VudCkge1xyXG4gICAgICAgICAgc2FtcGxlcy5zaGlmdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhdmcgPSBhdmdBbXBsaXR1ZGUoc2FtcGxlcyk7XHJcbiAgICAgICAgaWYgKCsrcG9pbnRzID49IG9wdGlvbnMuZXZlbnRMYWcubWluU2FtcGxlcyAmJiBhdmcgPCBvcHRpb25zLmV2ZW50TGFnLmxhZ1RocmVzaG9sZCkge1xyXG4gICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XHJcbiAgICAgICAgICByZXR1cm4gY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMCAqICgzIC8gKGF2ZyArIDMpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDUwKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gRXZlbnRMYWdNb25pdG9yO1xyXG5cclxuICB9KSgpO1xyXG5cclxuICBTY2FsZXIgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBmdW5jdGlvbiBTY2FsZXIoc291cmNlKSB7XHJcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgICB0aGlzLmxhc3QgPSB0aGlzLnNpbmNlTGFzdFVwZGF0ZSA9IDA7XHJcbiAgICAgIHRoaXMucmF0ZSA9IG9wdGlvbnMuaW5pdGlhbFJhdGU7XHJcbiAgICAgIHRoaXMuY2F0Y2h1cCA9IDA7XHJcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSB0aGlzLmxhc3RQcm9ncmVzcyA9IDA7XHJcbiAgICAgIGlmICh0aGlzLnNvdXJjZSAhPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHJlc3VsdCh0aGlzLnNvdXJjZSwgJ3Byb2dyZXNzJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBTY2FsZXIucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbihmcmFtZVRpbWUsIHZhbCkge1xyXG4gICAgICB2YXIgc2NhbGluZztcclxuICAgICAgaWYgKHZhbCA9PSBudWxsKSB7XHJcbiAgICAgICAgdmFsID0gcmVzdWx0KHRoaXMuc291cmNlLCAncHJvZ3Jlc3MnKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodmFsID49IDEwMCkge1xyXG4gICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHZhbCA9PT0gdGhpcy5sYXN0KSB7XHJcbiAgICAgICAgdGhpcy5zaW5jZUxhc3RVcGRhdGUgKz0gZnJhbWVUaW1lO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLnNpbmNlTGFzdFVwZGF0ZSkge1xyXG4gICAgICAgICAgdGhpcy5yYXRlID0gKHZhbCAtIHRoaXMubGFzdCkgLyB0aGlzLnNpbmNlTGFzdFVwZGF0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jYXRjaHVwID0gKHZhbCAtIHRoaXMucHJvZ3Jlc3MpIC8gb3B0aW9ucy5jYXRjaHVwVGltZTtcclxuICAgICAgICB0aGlzLnNpbmNlTGFzdFVwZGF0ZSA9IDA7XHJcbiAgICAgICAgdGhpcy5sYXN0ID0gdmFsO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh2YWwgPiB0aGlzLnByb2dyZXNzKSB7XHJcbiAgICAgICAgdGhpcy5wcm9ncmVzcyArPSB0aGlzLmNhdGNodXAgKiBmcmFtZVRpbWU7XHJcbiAgICAgIH1cclxuICAgICAgc2NhbGluZyA9IDEgLSBNYXRoLnBvdyh0aGlzLnByb2dyZXNzIC8gMTAwLCBvcHRpb25zLmVhc2VGYWN0b3IpO1xyXG4gICAgICB0aGlzLnByb2dyZXNzICs9IHNjYWxpbmcgKiB0aGlzLnJhdGUgKiBmcmFtZVRpbWU7XHJcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBNYXRoLm1pbih0aGlzLmxhc3RQcm9ncmVzcyArIG9wdGlvbnMubWF4UHJvZ3Jlc3NQZXJGcmFtZSwgdGhpcy5wcm9ncmVzcyk7XHJcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBNYXRoLm1heCgwLCB0aGlzLnByb2dyZXNzKTtcclxuICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgubWluKDEwMCwgdGhpcy5wcm9ncmVzcyk7XHJcbiAgICAgIHRoaXMubGFzdFByb2dyZXNzID0gdGhpcy5wcm9ncmVzcztcclxuICAgICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3M7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBTY2FsZXI7XHJcblxyXG4gIH0pKCk7XHJcblxyXG4gIHNvdXJjZXMgPSBudWxsO1xyXG5cclxuICBzY2FsZXJzID0gbnVsbDtcclxuXHJcbiAgYmFyID0gbnVsbDtcclxuXHJcbiAgdW5pU2NhbGVyID0gbnVsbDtcclxuXHJcbiAgYW5pbWF0aW9uID0gbnVsbDtcclxuXHJcbiAgY2FuY2VsQW5pbWF0aW9uID0gbnVsbDtcclxuXHJcbiAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XHJcblxyXG4gIGhhbmRsZVB1c2hTdGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKG9wdGlvbnMucmVzdGFydE9uUHVzaFN0YXRlKSB7XHJcbiAgICAgIHJldHVybiBQYWNlLnJlc3RhcnQoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlICE9IG51bGwpIHtcclxuICAgIF9wdXNoU3RhdGUgPSB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGU7XHJcbiAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgaGFuZGxlUHVzaFN0YXRlKCk7XHJcbiAgICAgIHJldHVybiBfcHVzaFN0YXRlLmFwcGx5KHdpbmRvdy5oaXN0b3J5LCBhcmd1bWVudHMpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGlmICh3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUgIT0gbnVsbCkge1xyXG4gICAgX3JlcGxhY2VTdGF0ZSA9IHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZTtcclxuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBoYW5kbGVQdXNoU3RhdGUoKTtcclxuICAgICAgcmV0dXJuIF9yZXBsYWNlU3RhdGUuYXBwbHkod2luZG93Lmhpc3RvcnksIGFyZ3VtZW50cyk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgU09VUkNFX0tFWVMgPSB7XHJcbiAgICBhamF4OiBBamF4TW9uaXRvcixcclxuICAgIGVsZW1lbnRzOiBFbGVtZW50TW9uaXRvcixcclxuICAgIGRvY3VtZW50OiBEb2N1bWVudE1vbml0b3IsXHJcbiAgICBldmVudExhZzogRXZlbnRMYWdNb25pdG9yXHJcbiAgfTtcclxuXHJcbiAgKGluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciB0eXBlLCBfaiwgX2ssIF9sZW4xLCBfbGVuMiwgX3JlZjIsIF9yZWYzLCBfcmVmNDtcclxuICAgIFBhY2Uuc291cmNlcyA9IHNvdXJjZXMgPSBbXTtcclxuICAgIF9yZWYyID0gWydhamF4JywgJ2VsZW1lbnRzJywgJ2RvY3VtZW50JywgJ2V2ZW50TGFnJ107XHJcbiAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcclxuICAgICAgdHlwZSA9IF9yZWYyW19qXTtcclxuICAgICAgaWYgKG9wdGlvbnNbdHlwZV0gIT09IGZhbHNlKSB7XHJcbiAgICAgICAgc291cmNlcy5wdXNoKG5ldyBTT1VSQ0VfS0VZU1t0eXBlXShvcHRpb25zW3R5cGVdKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIF9yZWY0ID0gKF9yZWYzID0gb3B0aW9ucy5leHRyYVNvdXJjZXMpICE9IG51bGwgPyBfcmVmMyA6IFtdO1xyXG4gICAgZm9yIChfayA9IDAsIF9sZW4yID0gX3JlZjQubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XHJcbiAgICAgIHNvdXJjZSA9IF9yZWY0W19rXTtcclxuICAgICAgc291cmNlcy5wdXNoKG5ldyBzb3VyY2Uob3B0aW9ucykpO1xyXG4gICAgfVxyXG4gICAgUGFjZS5iYXIgPSBiYXIgPSBuZXcgQmFyO1xyXG4gICAgc2NhbGVycyA9IFtdO1xyXG4gICAgcmV0dXJuIHVuaVNjYWxlciA9IG5ldyBTY2FsZXI7XHJcbiAgfSkoKTtcclxuXHJcbiAgUGFjZS5zdG9wID0gZnVuY3Rpb24oKSB7XHJcbiAgICBQYWNlLnRyaWdnZXIoJ3N0b3AnKTtcclxuICAgIFBhY2UucnVubmluZyA9IGZhbHNlO1xyXG4gICAgYmFyLmRlc3Ryb3koKTtcclxuICAgIGNhbmNlbEFuaW1hdGlvbiA9IHRydWU7XHJcbiAgICBpZiAoYW5pbWF0aW9uICE9IG51bGwpIHtcclxuICAgICAgaWYgKHR5cGVvZiBjYW5jZWxBbmltYXRpb25GcmFtZSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uKTtcclxuICAgICAgfVxyXG4gICAgICBhbmltYXRpb24gPSBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluaXQoKTtcclxuICB9O1xyXG5cclxuICBQYWNlLnJlc3RhcnQgPSBmdW5jdGlvbigpIHtcclxuICAgIFBhY2UudHJpZ2dlcigncmVzdGFydCcpO1xyXG4gICAgUGFjZS5zdG9wKCk7XHJcbiAgICByZXR1cm4gUGFjZS5zdGFydCgpO1xyXG4gIH07XHJcblxyXG4gIFBhY2UuZ28gPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBzdGFydDtcclxuICAgIFBhY2UucnVubmluZyA9IHRydWU7XHJcbiAgICBiYXIucmVuZGVyKCk7XHJcbiAgICBzdGFydCA9IG5vdygpO1xyXG4gICAgY2FuY2VsQW5pbWF0aW9uID0gZmFsc2U7XHJcbiAgICByZXR1cm4gYW5pbWF0aW9uID0gcnVuQW5pbWF0aW9uKGZ1bmN0aW9uKGZyYW1lVGltZSwgZW5xdWV1ZU5leHRGcmFtZSkge1xyXG4gICAgICB2YXIgYXZnLCBjb3VudCwgZG9uZSwgZWxlbWVudCwgZWxlbWVudHMsIGksIGosIHJlbWFpbmluZywgc2NhbGVyLCBzY2FsZXJMaXN0LCBzdW0sIF9qLCBfaywgX2xlbjEsIF9sZW4yLCBfcmVmMjtcclxuICAgICAgcmVtYWluaW5nID0gMTAwIC0gYmFyLnByb2dyZXNzO1xyXG4gICAgICBjb3VudCA9IHN1bSA9IDA7XHJcbiAgICAgIGRvbmUgPSB0cnVlO1xyXG4gICAgICBmb3IgKGkgPSBfaiA9IDAsIF9sZW4xID0gc291cmNlcy5sZW5ndGg7IF9qIDwgX2xlbjE7IGkgPSArK19qKSB7XHJcbiAgICAgICAgc291cmNlID0gc291cmNlc1tpXTtcclxuICAgICAgICBzY2FsZXJMaXN0ID0gc2NhbGVyc1tpXSAhPSBudWxsID8gc2NhbGVyc1tpXSA6IHNjYWxlcnNbaV0gPSBbXTtcclxuICAgICAgICBlbGVtZW50cyA9IChfcmVmMiA9IHNvdXJjZS5lbGVtZW50cykgIT0gbnVsbCA/IF9yZWYyIDogW3NvdXJjZV07XHJcbiAgICAgICAgZm9yIChqID0gX2sgPSAwLCBfbGVuMiA9IGVsZW1lbnRzLmxlbmd0aDsgX2sgPCBfbGVuMjsgaiA9ICsrX2spIHtcclxuICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50c1tqXTtcclxuICAgICAgICAgIHNjYWxlciA9IHNjYWxlckxpc3Rbal0gIT0gbnVsbCA/IHNjYWxlckxpc3Rbal0gOiBzY2FsZXJMaXN0W2pdID0gbmV3IFNjYWxlcihlbGVtZW50KTtcclxuICAgICAgICAgIGRvbmUgJj0gc2NhbGVyLmRvbmU7XHJcbiAgICAgICAgICBpZiAoc2NhbGVyLmRvbmUpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgc3VtICs9IHNjYWxlci50aWNrKGZyYW1lVGltZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGF2ZyA9IHN1bSAvIGNvdW50O1xyXG4gICAgICBiYXIudXBkYXRlKHVuaVNjYWxlci50aWNrKGZyYW1lVGltZSwgYXZnKSk7XHJcbiAgICAgIGlmIChiYXIuZG9uZSgpIHx8IGRvbmUgfHwgY2FuY2VsQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgYmFyLnVwZGF0ZSgxMDApO1xyXG4gICAgICAgIFBhY2UudHJpZ2dlcignZG9uZScpO1xyXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgYmFyLmZpbmlzaCgpO1xyXG4gICAgICAgICAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICByZXR1cm4gUGFjZS50cmlnZ2VyKCdoaWRlJyk7XHJcbiAgICAgICAgfSwgTWF0aC5tYXgob3B0aW9ucy5naG9zdFRpbWUsIE1hdGgubWF4KG9wdGlvbnMubWluVGltZSAtIChub3coKSAtIHN0YXJ0KSwgMCkpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZW5xdWV1ZU5leHRGcmFtZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBQYWNlLnN0YXJ0ID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcclxuICAgIGV4dGVuZChvcHRpb25zLCBfb3B0aW9ucyk7XHJcbiAgICBQYWNlLnJ1bm5pbmcgPSB0cnVlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgYmFyLnJlbmRlcigpO1xyXG4gICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgIE5vVGFyZ2V0RXJyb3IgPSBfZXJyb3I7XHJcbiAgICB9XHJcbiAgICBpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWNlJykpIHtcclxuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoUGFjZS5zdGFydCwgNTApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgUGFjZS50cmlnZ2VyKCdzdGFydCcpO1xyXG4gICAgICByZXR1cm4gUGFjZS5nbygpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIGRlZmluZShbJ3BhY2UnXSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBQYWNlO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gUGFjZTtcclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKG9wdGlvbnMuc3RhcnRPblBhZ2VMb2FkKSB7XHJcbiAgICAgIFBhY2Uuc3RhcnQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59KS5jYWxsKHRoaXMpO1xyXG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0aWYgKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XG5cdFx0bW9kdWxlLnBhdGhzID0gW107XG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cdFx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xuXHR9XG5cdHJldHVybiBtb2R1bGU7XG59O1xuIiwiLy8gTG9hZGVkIGFmdGVyIENvcmVVSSBhcHAuanNcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgSXRlbSBOYW1lOiBNYXRlcmlhbGl6ZSAtIE1hdGVyaWFsIERlc2lnbiBBZG1pbiBUZW1wbGF0ZVxuICBWZXJzaW9uOiA1LjBcbiAgQXV0aG9yOiBQSVhJTlZFTlRcbiAgQXV0aG9yIFVSTDogaHR0cHM6Ly90aGVtZWZvcmVzdC5uZXQvdXNlci9waXhpbnZlbnQvcG9ydGZvbGlvXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4iLCIvL2ltcG9ydCAnQGNvcmV1aS9jb3JldWknXG4iLCIvKipcbiAqIEZpcnN0IHdlIHdpbGwgbG9hZCBhbGwgb2YgdGhpcyBwcm9qZWN0J3MgSmF2YVNjcmlwdCBkZXBlbmRlbmNpZXMgd2hpY2hcbiAqIGluY2x1ZGVzIFZ1ZSBhbmQgb3RoZXIgbGlicmFyaWVzLiBJdCBpcyBhIGdyZWF0IHN0YXJ0aW5nIHBvaW50IHdoZW5cbiAqIGJ1aWxkaW5nIHJvYnVzdCwgcG93ZXJmdWwgd2ViIGFwcGxpY2F0aW9ucyB1c2luZyBWdWUgYW5kIExhcmF2ZWwuXG4gKi9cblxuLy8gTG9hZGVkIGJlZm9yZSBDb3JlVUkgYXBwLmpzXG5pbXBvcnQgJy4uL2Jvb3RzdHJhcCc7XG5pbXBvcnQgJ3BhY2UnO1xuaW1wb3J0ICcuLi9wbHVnaW5zJztcbiIsIi8qKlxuICogVGhpcyBib290c3RyYXAgZmlsZSBpcyB1c2VkIGZvciBib3RoIGZyb250ZW5kIGFuZCBiYWNrZW5kXG4gKi9cblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xuaW1wb3J0IFN3YWwgZnJvbSAnc3dlZXRhbGVydDInO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCAncG9wcGVyLmpzJzsgLy8gUmVxdWlyZWQgZm9yIEJTNFxuaW1wb3J0ICdib290c3RyYXAnO1xuXG4vKipcbiAqIFdlJ2xsIGxvYWQgalF1ZXJ5IGFuZCB0aGUgQm9vdHN0cmFwIGpRdWVyeSBwbHVnaW4gd2hpY2ggcHJvdmlkZXMgc3VwcG9ydFxuICogZm9yIEphdmFTY3JpcHQgYmFzZWQgQm9vdHN0cmFwIGZlYXR1cmVzIHN1Y2ggYXMgbW9kYWxzIGFuZCB0YWJzLiBUaGlzXG4gKiBjb2RlIG1heSBiZSBtb2RpZmllZCB0byBmaXQgdGhlIHNwZWNpZmljIG5lZWRzIG9mIHlvdXIgYXBwbGljYXRpb24uXG4gKi9cblxud2luZG93LiQgPSB3aW5kb3cualF1ZXJ5ID0gJDtcbndpbmRvdy5Td2FsID0gU3dhbDtcbndpbmRvdy5fID0gXzsgLy8gTG9kYXNoXG5cbi8qKlxuICogV2UnbGwgbG9hZCB0aGUgYXhpb3MgSFRUUCBsaWJyYXJ5IHdoaWNoIGFsbG93cyB1cyB0byBlYXNpbHkgaXNzdWUgcmVxdWVzdHNcbiAqIHRvIG91ciBMYXJhdmVsIGJhY2stZW5kLiBUaGlzIGxpYnJhcnkgYXV0b21hdGljYWxseSBoYW5kbGVzIHNlbmRpbmcgdGhlXG4gKiBDU1JGIHRva2VuIGFzIGEgaGVhZGVyIGJhc2VkIG9uIHRoZSB2YWx1ZSBvZiB0aGUgXCJYU1JGXCIgdG9rZW4gY29va2llLlxuICovXG5cbndpbmRvdy5heGlvcyA9IGF4aW9zO1xud2luZG93LmF4aW9zLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLVJlcXVlc3RlZC1XaXRoJ10gPSAnWE1MSHR0cFJlcXVlc3QnO1xuXG4vKipcbiAqIE5leHQgd2Ugd2lsbCByZWdpc3RlciB0aGUgQ1NSRiBUb2tlbiBhcyBhIGNvbW1vbiBoZWFkZXIgd2l0aCBBeGlvcyBzbyB0aGF0XG4gKiBhbGwgb3V0Z29pbmcgSFRUUCByZXF1ZXN0cyBhdXRvbWF0aWNhbGx5IGhhdmUgaXQgYXR0YWNoZWQuIFRoaXMgaXMganVzdFxuICogYSBzaW1wbGUgY29udmVuaWVuY2Ugc28gd2UgZG9uJ3QgaGF2ZSB0byBhdHRhY2ggZXZlcnkgdG9rZW4gbWFudWFsbHkuXG4gKi9cblxuY29uc3QgdG9rZW4gPSBkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cImNzcmYtdG9rZW5cIl0nKTtcblxuaWYgKHRva2VuKSB7XG4gICAgd2luZG93LmF4aW9zLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLUNTUkYtVE9LRU4nXSA9IHRva2VuLmNvbnRlbnQ7XG59IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0NTUkYgdG9rZW4gbm90IGZvdW5kOiBodHRwczovL2xhcmF2ZWwuY29tL2RvY3MvY3NyZiNjc3JmLXgtY3NyZi10b2tlbicpO1xufVxuXG4vKipcbiAqIEVjaG8gZXhwb3NlcyBhbiBleHByZXNzaXZlIEFQSSBmb3Igc3Vic2NyaWJpbmcgdG8gY2hhbm5lbHMgYW5kIGxpc3RlbmluZ1xuICogZm9yIGV2ZW50cyB0aGF0IGFyZSBicm9hZGNhc3QgYnkgTGFyYXZlbC4gRWNobyBhbmQgZXZlbnQgYnJvYWRjYXN0aW5nXG4gKiBhbGxvd3MgeW91ciB0ZWFtIHRvIGVhc2lseSBidWlsZCByb2J1c3QgcmVhbC10aW1lIHdlYiBhcHBsaWNhdGlvbnMuXG4gKi9cblxuLy8gaW1wb3J0IEVjaG8gZnJvbSAnbGFyYXZlbC1lY2hvJ1xuXG4vLyB3aW5kb3cuUHVzaGVyID0gcmVxdWlyZSgncHVzaGVyLWpzJyk7XG5cbi8vIHdpbmRvdy5FY2hvID0gbmV3IEVjaG8oe1xuLy8gICAgIGJyb2FkY2FzdGVyOiAncHVzaGVyJyxcbi8vICAgICBrZXk6IHByb2Nlc3MuZW52Lk1JWF9QVVNIRVJfQVBQX0tFWVxuLy8gICAgIGNsdXN0ZXI6IHByb2Nlc3MuZW52Lk1JWF9QVVNIRVJfQVBQX0NMVVNURVIsXG4vLyAgICAgZW5jcnlwdGVkOiB0cnVlXG4vLyB9KTtcbiIsIi8qKlxuICogQWxsb3dzIHlvdSB0byBhZGQgZGF0YS1tZXRob2Q9XCJNRVRIT0QgdG8gbGlua3MgdG8gYXV0b21hdGljYWxseSBpbmplY3QgYSBmb3JtXG4gKiB3aXRoIHRoZSBtZXRob2Qgb24gY2xpY2tcbiAqXG4gKiBFeGFtcGxlOiA8YSBocmVmPVwie3tyb3V0ZSgnY3VzdG9tZXJzLmRlc3Ryb3knLCAkY3VzdG9tZXItPmlkKX19XCJcbiAqIGRhdGEtbWV0aG9kPVwiZGVsZXRlXCIgbmFtZT1cImRlbGV0ZV9pdGVtXCI+RGVsZXRlPC9hPlxuICpcbiAqIEluamVjdHMgYSBmb3JtIHdpdGggdGhhdCdzIGZpcmVkIG9uIGNsaWNrIG9mIHRoZSBsaW5rIHdpdGggYSBERUxFVEUgcmVxdWVzdC5cbiAqIEdvb2QgYmVjYXVzZSB5b3UgZG9uJ3QgaGF2ZSB0byBkaXJ0eSB5b3VyIEhUTUwgd2l0aCBkZWxldGUgZm9ybXMgZXZlcnl3aGVyZS5cbiAqL1xuZnVuY3Rpb24gYWRkRGVsZXRlRm9ybXMoKSB7XG4gICAgJCgnW2RhdGEtbWV0aG9kXScpLmFwcGVuZChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghJCh0aGlzKS5maW5kKCdmb3JtJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiXFxuPGZvcm0gYWN0aW9uPSdcIiArICQodGhpcykuYXR0cignaHJlZicpICsgXCInIG1ldGhvZD0nUE9TVCcgbmFtZT0nZGVsZXRlX2l0ZW0nIHN0eWxlPSdkaXNwbGF5Om5vbmUnPlxcblwiICtcbiAgICAgICAgICAgICAgICBcIjxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9J19tZXRob2QnIHZhbHVlPSdcIiArICQodGhpcykuYXR0cignZGF0YS1tZXRob2QnKSArIFwiJz5cXG5cIiArXG4gICAgICAgICAgICAgICAgXCI8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPSdfdG9rZW4nIHZhbHVlPSdcIiArICQoJ21ldGFbbmFtZT1cImNzcmYtdG9rZW5cIl0nKS5hdHRyKCdjb250ZW50JykgKyBcIic+XFxuXCIgK1xuICAgICAgICAgICAgICAgICc8L2Zvcm0+XFxuJztcbiAgICAgICAgfSBlbHNlIHsgcmV0dXJuICcnIH1cbiAgICB9KVxuICAgICAgICAuYXR0cignaHJlZicsICcjJylcbiAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ2N1cnNvcjpwb2ludGVyOycpXG4gICAgICAgIC5hdHRyKCdvbmNsaWNrJywgJyQodGhpcykuZmluZChcImZvcm1cIikuc3VibWl0KCk7Jyk7XG59XG5cbi8qKlxuICogUGxhY2UgYW55IGpRdWVyeS9oZWxwZXIgcGx1Z2lucyBpbiBoZXJlLlxuICovXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBBZGQgdGhlIGRhdGEtbWV0aG9kPVwiZGVsZXRlXCIgZm9ybXMgdG8gYWxsIGRlbGV0ZSBsaW5rc1xuICAgICAqL1xuICAgIGFkZERlbGV0ZUZvcm1zKCk7XG5cbiAgICAvKipcbiAgICAgKiBEaXNhYmxlIGFsbCBzdWJtaXQgYnV0dG9ucyBvbmNlIGNsaWNrZWRcbiAgICAgKi9cbiAgICAkKCdmb3JtJykuc3VibWl0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5maW5kKCdpbnB1dFt0eXBlPVwic3VibWl0XCJdJykuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgJCh0aGlzKS5maW5kKCdidXR0b25bdHlwZT1cInN1Ym1pdFwiXScpLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogR2VuZXJpYyBjb25maXJtIGZvcm0gZGVsZXRlIHVzaW5nIFN3ZWV0IEFsZXJ0XG4gICAgICovXG4gICAgJCgnYm9keScpLm9uKCdzdWJtaXQnLCAnZm9ybVtuYW1lPWRlbGV0ZV9pdGVtXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjb25zdCBmb3JtID0gdGhpcztcbiAgICAgICAgY29uc3QgbGluayA9ICQoJ2FbZGF0YS1tZXRob2Q9XCJkZWxldGVcIl0nKTtcbiAgICAgICAgY29uc3QgY2FuY2VsID0gKGxpbmsuYXR0cignZGF0YS10cmFucy1idXR0b24tY2FuY2VsJykpID8gbGluay5hdHRyKCdkYXRhLXRyYW5zLWJ1dHRvbi1jYW5jZWwnKSA6ICdDYW5jZWwnO1xuICAgICAgICBjb25zdCBjb25maXJtID0gKGxpbmsuYXR0cignZGF0YS10cmFucy1idXR0b24tY29uZmlybScpKSA/IGxpbmsuYXR0cignZGF0YS10cmFucy1idXR0b24tY29uZmlybScpIDogJ1llcywgZGVsZXRlJztcbiAgICAgICAgY29uc3QgdGl0bGUgPSAobGluay5hdHRyKCdkYXRhLXRyYW5zLXRpdGxlJykpID8gbGluay5hdHRyKCdkYXRhLXRyYW5zLXRpdGxlJykgOiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGl0ZW0/JztcblxuICAgICAgICBTd2FsLmZpcmUoe1xuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBjb25maXJtLFxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogY2FuY2VsLFxuICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnXG4gICAgICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgcmVzdWx0LnZhbHVlICYmIGZvcm0uc3VibWl0KCk7XG4gICAgICAgIH0pO1xuICAgIH0pLm9uKCdjbGljaycsICdhW25hbWU9Y29uZmlybV9pdGVtXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmljICdhcmUgeW91IHN1cmUnIGNvbmZpcm0gYm94XG4gICAgICAgICAqL1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY29uc3QgbGluayA9ICQodGhpcyk7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gKGxpbmsuYXR0cignZGF0YS10cmFucy10aXRsZScpKSA/IGxpbmsuYXR0cignZGF0YS10cmFucy10aXRsZScpIDogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkbyB0aGlzPyc7XG4gICAgICAgIGNvbnN0IGNhbmNlbCA9IChsaW5rLmF0dHIoJ2RhdGEtdHJhbnMtYnV0dG9uLWNhbmNlbCcpKSA/IGxpbmsuYXR0cignZGF0YS10cmFucy1idXR0b24tY2FuY2VsJykgOiAnQ2FuY2VsJztcbiAgICAgICAgY29uc3QgY29uZmlybSA9IChsaW5rLmF0dHIoJ2RhdGEtdHJhbnMtYnV0dG9uLWNvbmZpcm0nKSkgPyBsaW5rLmF0dHIoJ2RhdGEtdHJhbnMtYnV0dG9uLWNvbmZpcm0nKSA6ICdDb250aW51ZSc7XG5cbiAgICAgICAgU3dhbC5maXJlKHtcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogY29uZmlybSxcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6IGNhbmNlbCxcbiAgICAgICAgICAgIHR5cGU6ICdpbmZvJ1xuICAgICAgICB9KS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdC52YWx1ZSAmJiB3aW5kb3cubG9jYXRpb24uYXNzaWduKGxpbmsuYXR0cignaHJlZicpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAgLy8gJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgSXRlbSBOYW1lOiBNYXRlcmlhbGl6ZSAtIE1hdGVyaWFsIERlc2lnbiBBZG1pbiBUZW1wbGF0ZVxuICBWZXJzaW9uOiA1LjBcbiAgQXV0aG9yOiBQSVhJTlZFTlRcbiAgQXV0aG9yIFVSTDogaHR0cHM6Ly90aGVtZWZvcmVzdC5uZXQvdXNlci9waXhpbnZlbnQvcG9ydGZvbGlvXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cblxuXG4gICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNpemV0YWJsZSgpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gcmVzaXpldGFibGUoKSB7XG4gICAgICAgIGlmKCQod2luZG93KS53aWR0aCgpIDwgOTc2KXtcbiAgICAgICAgICAgIGlmKCQoJy52ZXJ0aWNhbC1sYXlvdXQudmVydGljYWwtZ3JhZGllbnQtbWVudSAuc2lkZW5hdi1kYXJrIC5icmFuZC1sb2dvJykubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgJCgnLnZlcnRpY2FsLWxheW91dC52ZXJ0aWNhbC1ncmFkaWVudC1tZW51IC5zaWRlbmF2LWRhcmsgLmJyYW5kLWxvZ28gaW1nJykuYXR0cignc3JjJywnLi4vLi4vLi4vYXBwLWFzc2V0cy9pbWFnZXMvbG9nby9tYXRlcmlhbGl6ZS1sb2dvLWNvbG9yLnBuZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJCgnLnZlcnRpY2FsLWxheW91dC52ZXJ0aWNhbC1kYXJrLW1lbnUgLnNpZGVuYXYtZGFyayAuYnJhbmQtbG9nbycpLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICQoJy52ZXJ0aWNhbC1sYXlvdXQudmVydGljYWwtZGFyay1tZW51IC5zaWRlbmF2LWRhcmsgLmJyYW5kLWxvZ28gaW1nJykuYXR0cignc3JjJywnLi4vLi4vLi4vYXBwLWFzc2V0cy9pbWFnZXMvbG9nby9tYXRlcmlhbGl6ZS1sb2dvLWNvbG9yLnBuZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJCgnLnZlcnRpY2FsLWxheW91dC52ZXJ0aWNhbC1tb2Rlcm4tbWVudSAuc2lkZW5hdi1saWdodCAuYnJhbmQtbG9nbycpLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICQoJy52ZXJ0aWNhbC1sYXlvdXQudmVydGljYWwtbW9kZXJuLW1lbnUgLnNpZGVuYXYtbGlnaHQgLmJyYW5kLWxvZ28gaW1nJykuYXR0cignc3JjJywnLi4vLi4vLi4vYXBwLWFzc2V0cy9pbWFnZXMvbG9nby9tYXRlcmlhbGl6ZS1sb2dvLnBuZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBpZigkKCcudmVydGljYWwtbGF5b3V0LnZlcnRpY2FsLWdyYWRpZW50LW1lbnUgLnNpZGVuYXYtZGFyayAuYnJhbmQtbG9nbycpLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICQoJy52ZXJ0aWNhbC1sYXlvdXQudmVydGljYWwtZ3JhZGllbnQtbWVudSAuc2lkZW5hdi1kYXJrIC5icmFuZC1sb2dvIGltZycpLmF0dHIoJ3NyYycsJy4uLy4uLy4uL2FwcC1hc3NldHMvaW1hZ2VzL2xvZ28vbWF0ZXJpYWxpemUtbG9nby5wbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCQoJy52ZXJ0aWNhbC1sYXlvdXQudmVydGljYWwtZGFyay1tZW51IC5zaWRlbmF2LWRhcmsgLmJyYW5kLWxvZ28nKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAkKCcudmVydGljYWwtbGF5b3V0LnZlcnRpY2FsLWRhcmstbWVudSAuc2lkZW5hdi1kYXJrIC5icmFuZC1sb2dvIGltZycpLmF0dHIoJ3NyYycsJy4uLy4uLy4uL2FwcC1hc3NldHMvaW1hZ2VzL2xvZ28vbWF0ZXJpYWxpemUtbG9nby5wbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCQoJy52ZXJ0aWNhbC1sYXlvdXQudmVydGljYWwtbW9kZXJuLW1lbnUgLnNpZGVuYXYtbGlnaHQgLmJyYW5kLWxvZ28nKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAkKCcudmVydGljYWwtbGF5b3V0LnZlcnRpY2FsLW1vZGVybi1tZW51IC5zaWRlbmF2LWxpZ2h0IC5icmFuZC1sb2dvIGltZycpLmF0dHIoJ3NyYycsJy4uLy4uLy4uL2FwcC1hc3NldHMvaW1hZ2VzL2xvZ28vbWF0ZXJpYWxpemUtbG9nby1jb2xvci5wbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXNpemV0YWJsZSgpO1xuXG4vLyBBZGQgbWVzc2FnZSB0byBjaGF0XG4gICAgZnVuY3Rpb24gc2xpZGVfb3V0X2NoYXQoKSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gJChcIi5zZWFyY2hcIikudmFsKCk7XG4gICAgICAgIGlmIChtZXNzYWdlICE9IFwiXCIpIHtcbiAgICAgICAgICAgIHZhciBodG1sID1cbiAgICAgICAgICAgICAgICAnPGxpIGNsYXNzPVwiY29sbGVjdGlvbi1pdGVtIGRpc3BsYXktZmxleCBhdmF0YXIganVzdGlmeS1jb250ZW50LWVuZCBwbC01IHBiLTBcIiBkYXRhLXRhcmdldD1cInNsaWRlLW91dC1jaGF0XCI+PGRpdiBjbGFzcz1cInVzZXItY29udGVudCBzcGVlY2gtYnViYmxlLXJpZ2h0XCI+JyArXG4gICAgICAgICAgICAgICAgJzxwIGNsYXNzPVwibWVkaXVtLXNtYWxsXCI+JyArXG4gICAgICAgICAgICAgICAgbWVzc2FnZSArXG4gICAgICAgICAgICAgICAgXCI8L3A+XCIgK1xuICAgICAgICAgICAgICAgIFwiPC9kaXY+PC9saT5cIjtcbiAgICAgICAgICAgICQoXCIjcmlnaHQtc2lkZWJhci1uYXYgI3NsaWRlLW91dC1jaGF0IC5jaGF0LWJvZHkgLmNvbGxlY3Rpb25cIikuYXBwZW5kKGh0bWwpO1xuICAgICAgICAgICAgJChcIi5zZWFyY2hcIikudmFsKFwiXCIpO1xuICAgICAgICAgICAgdmFyIGNoYXJTY3JvbGwgPSAkKFwiI3JpZ2h0LXNpZGViYXItbmF2ICNzbGlkZS1vdXQtY2hhdCAuY2hhdC1ib2R5IC5jb2xsZWN0aW9uXCIpO1xuICAgICAgICAgICAgaWYgKGNoYXJTY3JvbGwubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgY2hhclNjcm9sbFswXS5zY3JvbGxUb3AgPSBjaGFyU2Nyb2xsWzBdLnNjcm9sbEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufSk7XG4kKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy8gSW5pdCBjb2xsYXBzaWJsZVxuICAgICQoXCIuY29sbGFwc2libGVcIikuY29sbGFwc2libGUoe1xuICAgICAgICBhY2NvcmRpb246IHRydWUsXG4gICAgICAgIG9uT3BlblN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZWQgb3BlbiBjbGFzcyBmaXJzdCBhbmQgYWRkIG9wZW4gYXQgY29sbGFwc2libGUgYWN0aXZlXG4gICAgICAgICAgICAkKFwiLmNvbGxhcHNpYmxlID4gbGkub3BlblwiKS5yZW1vdmVDbGFzcyhcIm9wZW5cIik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQoXCIjc2xpZGUtb3V0ID4gbGkuYWN0aXZlID4gYVwiKVxuICAgICAgICAgICAgICAgICAgICAucGFyZW50KClcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKFwib3BlblwiKTtcbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIG9wZW4gY2xhc3Mgb24gaW5pdFxuICAgICQoXCIjc2xpZGUtb3V0ID4gbGkuYWN0aXZlID4gYVwiKVxuICAgICAgICAucGFyZW50KClcbiAgICAgICAgLmFkZENsYXNzKFwib3BlblwiKTtcblxuICAgIC8vIE9wZW4gYWN0aXZlIG1lbnUgZm9yIG11bHRpIGxldmVsXG4gICAgaWYgKCQoXCJsaS5hY3RpdmUgLmNvbGxhcHNpYmxlLXN1YiAuY29sbGFwc2libGVcIikuZmluZChcImEuYWN0aXZlXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJChcImxpLmFjdGl2ZSAuY29sbGFwc2libGUtc3ViIC5jb2xsYXBzaWJsZVwiKVxuICAgICAgICAgICAgLmZpbmQoXCJhLmFjdGl2ZVwiKVxuICAgICAgICAgICAgLmNsb3Nlc3QoXCJkaXYuY29sbGFwc2libGUtYm9keVwiKVxuICAgICAgICAgICAgLnNob3coKTtcbiAgICAgICAgJChcImxpLmFjdGl2ZSAuY29sbGFwc2libGUtc3ViIC5jb2xsYXBzaWJsZVwiKVxuICAgICAgICAgICAgLmZpbmQoXCJhLmFjdGl2ZVwiKVxuICAgICAgICAgICAgLmNsb3Nlc3QoXCJkaXYuY29sbGFwc2libGUtYm9keVwiKVxuICAgICAgICAgICAgLmNsb3Nlc3QoXCJsaVwiKVxuICAgICAgICAgICAgLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgIH1cblxuICAgIC8vIEF1dG8gU2Nyb2xsIG1lbnUgdG8gdGhlIGFjdGl2ZSBpdGVtXG4gICAgdmFyIHBvc2l0aW9uO1xuICAgIGlmIChcbiAgICAgICAgJChcIi5zaWRlbmF2LW1haW4gbGkgYS5hY3RpdmVcIilcbiAgICAgICAgICAgIC5wYXJlbnQoXCJsaS5hY3RpdmVcIilcbiAgICAgICAgICAgIC5wYXJlbnQoXCJ1bC5jb2xsYXBzaWJsZS1zdWJcIikubGVuZ3RoID4gMFxuICAgICkge1xuICAgICAgICBwb3NpdGlvbiA9ICQoXCIuc2lkZW5hdi1tYWluIGxpIGEuYWN0aXZlXCIpXG4gICAgICAgICAgICAucGFyZW50KFwibGkuYWN0aXZlXCIpXG4gICAgICAgICAgICAucGFyZW50KFwidWwuY29sbGFwc2libGUtc3ViXCIpXG4gICAgICAgICAgICAucG9zaXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwb3NpdGlvbiA9ICQoXCIuc2lkZW5hdi1tYWluIGxpIGEuYWN0aXZlXCIpXG4gICAgICAgICAgICAucGFyZW50KFwibGkuYWN0aXZlXCIpXG4gICAgICAgICAgICAucG9zaXRpb24oKTtcbiAgICB9XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICQoXCIuc2lkZW5hdi1tYWluIHVsXCIpXG4gICAgICAgICAgICAgICAgLnN0b3AoKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKHsgc2Nyb2xsVG9wOiBwb3NpdGlvbi50b3AgLSAzMDAgfSwgMzAwKTtcbiAgICAgICAgfVxuICAgIH0sIDMwMCk7XG5cbiAgICAvLyBDb2xsYXBzaWJsZSBuYXZpZ2F0aW9uIG1lbnVcbiAgICAkKFwiLm5hdi1jb2xsYXBzaWJsZSAubmF2YmFyLXRvZ2dsZXJcIikuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFRvZ2dsZSBuYXZpZ2F0aW9uIGV4cGFuIGFuZCBjb2xsYXBzZSBvbiByYWRpbyBjbGlja1xuICAgICAgICBpZiAoJChcIi5zaWRlbmF2LW1haW5cIikuaGFzQ2xhc3MoXCJuYXYtZXhwYW5kZWRcIikgJiYgISQoXCIuc2lkZW5hdi1tYWluXCIpLmhhc0NsYXNzKFwibmF2LWxvY2tcIikpIHtcbiAgICAgICAgICAgICQoXCIuc2lkZW5hdi1tYWluXCIpLnRvZ2dsZUNsYXNzKFwibmF2LWV4cGFuZGVkXCIpO1xuICAgICAgICAgICAgJChcIiNtYWluXCIpLnRvZ2dsZUNsYXNzKFwibWFpbi1mdWxsXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJChcIiNtYWluXCIpLnRvZ2dsZUNsYXNzKFwibWFpbi1mdWxsXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNldCBuYXZpZ2F0aW9uIGxvY2sgLyB1bmxvY2sgd2l0aCByYWRpbyBpY29uXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgIC50ZXh0KCkgPT0gXCJyYWRpb19idXR0b25fdW5jaGVja2VkXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAudGV4dChcInJhZGlvX2J1dHRvbl9jaGVja2VkXCIpO1xuICAgICAgICAgICAgJChcIi5zaWRlbmF2LW1haW5cIikuYWRkQ2xhc3MoXCJuYXYtbG9ja1wiKTtcbiAgICAgICAgICAgICQoXCIubmF2YmFyIC5uYXYtY29sbGFwc2libGVcIikuYWRkQ2xhc3MoXCJzaWRlTmF2LWxvY2tcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAudGV4dChcInJhZGlvX2J1dHRvbl91bmNoZWNrZWRcIik7XG4gICAgICAgICAgICAkKFwiLnNpZGVuYXYtbWFpblwiKS5yZW1vdmVDbGFzcyhcIm5hdi1sb2NrXCIpO1xuICAgICAgICAgICAgJChcIi5uYXZiYXIgLm5hdi1jb2xsYXBzaWJsZVwiKS5yZW1vdmVDbGFzcyhcInNpZGVOYXYtbG9ja1wiKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoXCIudG9nZ2xlLWZ1bGxzY3JlZW5cIikuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIHRvZ2dsZUZ1bGxTY3JlZW4oKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2Z1bGxzY3JlZW4nKTtcbiAgICB9KTtcbiAgICAvLyBFeHBhbmQgbmF2aWdhdGlvbiBvbiBtb3VzZWVudGVyIGV2ZW50XG4gICAgJChcIi5zaWRlbmF2LW1haW4ubmF2LWNvbGxhcHNpYmxlLCAubmF2YmFyIC5icmFuZC1zaWRlYmFyXCIpLm1vdXNlZW50ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghJChcIi5zaWRlbmF2LW1haW4ubmF2LWNvbGxhcHNpYmxlXCIpLmhhc0NsYXNzKFwibmF2LWxvY2tcIikpIHtcbiAgICAgICAgICAgICQoXCIuc2lkZW5hdi1tYWluLm5hdi1jb2xsYXBzaWJsZSwgLm5hdmJhciAubmF2LWNvbGxhcHNpYmxlXCIpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKFwibmF2LWV4cGFuZGVkXCIpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwibmF2LWNvbGxhcHNlZFwiKTtcbiAgICAgICAgICAgICQoXCIjc2xpZGUtb3V0ID4gbGkuY2xvc2UgPiBhXCIpXG4gICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKFwib3BlblwiKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhcImNsb3NlXCIpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIE9wZW4gb25seSBpZiBjb2xsYXBzaWJsZSBoYXZlIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAgIGlmICgkKFwiLmNvbGxhcHNpYmxlIC5vcGVuXCIpLmNoaWxkcmVuKCkubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLmNvbGxhcHNpYmxlXCIpLmNvbGxhcHNpYmxlKFwib3BlblwiLCAkKFwiLmNvbGxhcHNpYmxlIC5vcGVuXCIpLmluZGV4KCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENvbGxhcHNlIG5hdmlnYXRpb24gb24gbW91c2VsZWF2ZSBldmVudFxuICAgICQoXCIuc2lkZW5hdi1tYWluLm5hdi1jb2xsYXBzaWJsZSwgLm5hdmJhciAuYnJhbmQtc2lkZWJhclwiKS5tb3VzZWxlYXZlKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoISQoXCIuc2lkZW5hdi1tYWluLm5hdi1jb2xsYXBzaWJsZVwiKS5oYXNDbGFzcyhcIm5hdi1sb2NrXCIpKSB7XG4gICAgICAgICAgICB2YXIgb3Blbkxlbmd0aCA9ICQoXCIuY29sbGFwc2libGUgLm9wZW5cIikuY2hpbGRyZW4oKS5sZW5ndGg7XG4gICAgICAgICAgICAkKFwiLnNpZGVuYXYtbWFpbi5uYXYtY29sbGFwc2libGUsIC5uYXZiYXIgLm5hdi1jb2xsYXBzaWJsZVwiKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcIm5hdi1jb2xsYXBzZWRcIilcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJuYXYtZXhwYW5kZWRcIik7XG4gICAgICAgICAgICAkKFwiI3NsaWRlLW91dCA+IGxpLm9wZW4gPiBhXCIpXG4gICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiY2xvc2VcIilcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJvcGVuXCIpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBPcGVuIG9ubHkgaWYgY29sbGFwc2libGUgaGF2ZSB0aGUgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICBpZiAob3Blbkxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5jb2xsYXBzaWJsZVwiKS5jb2xsYXBzaWJsZShcImNsb3NlXCIsICQoXCIuY29sbGFwc2libGUgLmNsb3NlXCIpLmluZGV4KCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNlYXJjaCBjbGFzcyBmb3IgZm9jdXNcbiAgICAkKFwiLmhlYWRlci1zZWFyY2gtaW5wdXRcIilcbiAgICAgICAgLmZvY3VzKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgIC5wYXJlbnQoXCJkaXZcIilcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJoZWFkZXItc2VhcmNoLXdyYXBwZXItZm9jdXNcIik7XG4gICAgICAgIH0pXG4gICAgICAgIC5ibHVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgIC5wYXJlbnQoXCJkaXZcIilcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJoZWFkZXItc2VhcmNoLXdyYXBwZXItZm9jdXNcIik7XG4gICAgICAgIH0pO1xuXG4gICAgLy9TZWFyY2ggYm94IGZvcm0gc21hbGwgc2NyZWVuXG4gICAgJChcIi5zZWFyY2gtYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKCQoXCIuc2VhcmNoLXNtXCIpLmlzKFwiOmhpZGRlblwiKSkge1xuICAgICAgICAgICAgJChcIi5zZWFyY2gtc21cIikuc2hvdygpO1xuICAgICAgICAgICAgJChcIi5zZWFyY2gtYm94LXNtXCIpLmZvY3VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKFwiLnNlYXJjaC1zbVwiKS5oaWRlKCk7XG4gICAgICAgICAgICAkKFwiLnNlYXJjaC1ib3gtc21cIikudmFsKFwiXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJChcIi5zZWFyY2gtc20tY2xvc2VcIikuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICAkKFwiLnNlYXJjaC1zbVwiKS5oaWRlKCk7XG4gICAgICAgICQoXCIuc2VhcmNoLWJveC1zbVwiKS52YWwoXCJcIik7XG4gICAgfSk7XG5cbiAgICAvL0JyZWFkY3J1bWJzIHdpdGggaW1hZ2VcbiAgICBpZiAoJChcIiNicmVhZGNydW1icy13cmFwcGVyXCIpLmF0dHIoXCJkYXRhLWltYWdlXCIpKSB7XG4gICAgICAgIHZhciBpbWFnZVVybCA9ICQoXCIjYnJlYWRjcnVtYnMtd3JhcHBlclwiKS5hdHRyKFwiZGF0YS1pbWFnZVwiKTtcbiAgICAgICAgJChcIiNicmVhZGNydW1icy13cmFwcGVyXCIpLmFkZENsYXNzKFwiYnJlYWRjcnVtYnMtYmctaW1hZ2VcIik7XG4gICAgICAgICQoXCIjYnJlYWRjcnVtYnMtd3JhcHBlclwiKS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsIFwidXJsKFwiICsgaW1hZ2VVcmwgKyBcIilcIik7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZmlyc3QgaWYgYW55IG9mIHRoZSB0YXNrIGlzIGNoZWNrZWRcbiAgICAkKFwiI3Rhc2stY2FyZCBpbnB1dDpjaGVja2JveFwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBjaGVja2JveF9jaGVjayh0aGlzKTtcbiAgICB9KTtcblxuICAgIC8vIFRhc2sgY2hlY2sgYm94XG4gICAgJChcIiN0YXNrLWNhcmQgaW5wdXQ6Y2hlY2tib3hcIikuY2hhbmdlKGZ1bmN0aW9uKCkge1xuICAgICAgICBjaGVja2JveF9jaGVjayh0aGlzKTtcbiAgICB9KTtcblxuICAgIC8vIENoZWNrIFVuY2hlY2sgZnVuY3Rpb25cbiAgICBmdW5jdGlvbiBjaGVja2JveF9jaGVjayhlbCkge1xuICAgICAgICBpZiAoISQoZWwpLmlzKFwiOmNoZWNrZWRcIikpIHtcbiAgICAgICAgICAgICQoZWwpXG4gICAgICAgICAgICAgICAgLm5leHQoKVxuICAgICAgICAgICAgICAgIC5jc3MoXCJ0ZXh0LWRlY29yYXRpb25cIiwgXCJub25lXCIpOyAvLyBvciBhZGRDbGFzc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJChlbClcbiAgICAgICAgICAgICAgICAubmV4dCgpXG4gICAgICAgICAgICAgICAgLmNzcyhcInRleHQtZGVjb3JhdGlvblwiLCBcImxpbmUtdGhyb3VnaFwiKTsgLy9vciBhZGRDbGFzc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9Jbml0IHRhYnNcbiAgICAkKFwiLnRhYnNcIikudGFicygpO1xuXG4gICAgLy8gU3dpcGVhYmxlIFRhYnMgRGVtbyBJbml0XG4gICAgaWYgKCQoXCIjdGFicy1zd2lwZS1kZW1vXCIpLmxlbmd0aCkge1xuICAgICAgICAkKFwiI3RhYnMtc3dpcGUtZGVtb1wiKS50YWJzKHtcbiAgICAgICAgICAgIHN3aXBlYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBQbHVnaW4gaW5pdGlhbGl6YXRpb25cblxuICAgICQoXCJzZWxlY3RcIikuZm9ybVNlbGVjdCgpO1xuICAgIC8vIFNldCBjaGVja2JveCBvbiBmb3Jtcy5odG1sIHRvIGluZGV0ZXJtaW5hdGVcbiAgICB2YXIgaW5kZXRlcm1pbmF0ZUNoZWNrYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmRldGVybWluYXRlLWNoZWNrYm94XCIpO1xuICAgIGlmIChpbmRldGVybWluYXRlQ2hlY2tib3ggIT09IG51bGwpIGluZGV0ZXJtaW5hdGVDaGVja2JveC5pbmRldGVybWluYXRlID0gdHJ1ZTtcblxuICAgIC8vIE1hdGVyaWFsaXplIFNsaWRlclxuICAgICQoXCIuc2xpZGVyXCIpLnNsaWRlcih7XG4gICAgICAgIGZ1bGxfd2lkdGg6IHRydWVcbiAgICB9KTtcblxuICAgIC8vIENvbW1vbSwgVHJhbnNsYXRpb24gJiBIb3Jpem9udGFsIERyb3Bkb3duXG4gICAgJChcIi5kcm9wZG93bi10cmlnZ2VyXCIpLmRyb3Bkb3duKCk7XG5cbiAgICAvLyBDb21tb20sIFRyYW5zbGF0aW9uXG4gICAgJChcIi5kcm9wZG93bi1idXR0b25cIikuZHJvcGRvd24oe1xuICAgICAgICBpbkR1cmF0aW9uOiAzMDAsXG4gICAgICAgIG91dER1cmF0aW9uOiAyMjUsXG4gICAgICAgIGNvbnN0cmFpbldpZHRoOiBmYWxzZSxcbiAgICAgICAgaG92ZXI6IHRydWUsXG4gICAgICAgIGd1dHRlcjogMCxcbiAgICAgICAgY292ZXJUcmlnZ2VyOiB0cnVlLFxuICAgICAgICBhbGlnbm1lbnQ6IFwibGVmdFwiXG4gICAgICAgIC8vIHN0b3BQcm9wYWdhdGlvbjogZmFsc2VcbiAgICB9KTtcblxuICAgIC8vIE5vdGlmaWNhdGlvbiwgUHJvZmlsZSwgVHJhbnNsYXRpb24sIFNldHRpbmdzIERyb3Bkb3duICYgSG9yaXpvbnRhbCBEcm9wZG93blxuICAgICQoXCIubm90aWZpY2F0aW9uLWJ1dHRvbiwgLnByb2ZpbGUtYnV0dG9uLCAudHJhbnNsYXRpb24tYnV0dG9uLCAuZHJvcGRvd24tc2V0dGluZ3MsIC5kcm9wZG93bi1tZW51XCIpLmRyb3Bkb3duKHtcbiAgICAgICAgaW5EdXJhdGlvbjogMzAwLFxuICAgICAgICBvdXREdXJhdGlvbjogMjI1LFxuICAgICAgICBjb25zdHJhaW5XaWR0aDogZmFsc2UsXG4gICAgICAgIGhvdmVyOiBmYWxzZSxcbiAgICAgICAgZ3V0dGVyOiAwLFxuICAgICAgICBjb3ZlclRyaWdnZXI6IGZhbHNlLFxuICAgICAgICBhbGlnbm1lbnQ6IFwicmlnaHRcIlxuICAgICAgICAvLyBzdG9wUHJvcGFnYXRpb246IGZhbHNlXG4gICAgfSk7XG5cbiAgICAvLyBGYWJcbiAgICAkKFwiLmZpeGVkLWFjdGlvbi1idG5cIikuZmxvYXRpbmdBY3Rpb25CdXR0b24oKTtcbiAgICAkKFwiLmZpeGVkLWFjdGlvbi1idG4uaG9yaXpvbnRhbFwiKS5mbG9hdGluZ0FjdGlvbkJ1dHRvbih7XG4gICAgICAgIGRpcmVjdGlvbjogXCJsZWZ0XCJcbiAgICB9KTtcbiAgICAkKFwiLmZpeGVkLWFjdGlvbi1idG4uY2xpY2stdG8tdG9nZ2xlXCIpLmZsb2F0aW5nQWN0aW9uQnV0dG9uKHtcbiAgICAgICAgZGlyZWN0aW9uOiBcImxlZnRcIixcbiAgICAgICAgaG92ZXJFbmFibGVkOiBmYWxzZVxuICAgIH0pO1xuICAgICQoXCIuZml4ZWQtYWN0aW9uLWJ0bi50b29sYmFyXCIpLmZsb2F0aW5nQWN0aW9uQnV0dG9uKHtcbiAgICAgICAgdG9vbGJhckVuYWJsZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIC8vIE1hdGVyaWFsaXplIFRhYnNcbiAgICAkKFwiLnRhYi1kZW1vXCIpXG4gICAgICAgIC5zaG93KClcbiAgICAgICAgLnRhYnMoKTtcbiAgICAkKFwiLnRhYi1kZW1vLWFjdGl2ZVwiKVxuICAgICAgICAuc2hvdygpXG4gICAgICAgIC50YWJzKCk7XG5cbiAgICAvLyBNYXRlcmlhbGl6ZSBzY3JvbGxTcHlcbiAgICAkKFwiLnNjcm9sbHNweVwiKS5zY3JvbGxTcHkoKTtcblxuICAgIC8vIE1hdGVyaWFsaXplIHRvb2x0aXBcbiAgICAkKFwiLnRvb2x0aXBwZWRcIikudG9vbHRpcCh7XG4gICAgICAgIGRlbGF5OiA1MFxuICAgIH0pO1xuXG4gICAgLy9NYWluIExlZnQgU2lkZWJhciBNZW51IC8vIHNpZGViYXItY29sbGFwc2VcbiAgICAkKFwiLnNpZGVuYXZcIikuc2lkZW5hdih7XG4gICAgICAgIGVkZ2U6IFwibGVmdFwiIC8vIENob29zZSB0aGUgaG9yaXpvbnRhbCBvcmlnaW5cbiAgICB9KTtcblxuICAgIC8vTWFpbiBSaWdodCBTaWRlYmFyXG4gICAgJChcIi5zbGlkZS1vdXQtcmlnaHQtc2lkZW5hdlwiKS5zaWRlbmF2KHtcbiAgICAgICAgZWRnZTogXCJyaWdodFwiXG4gICAgfSk7XG5cbiAgICAvL01haW4gUmlnaHQgU2lkZWJhciBDaGF0XG4gICAgJChcIi5zbGlkZS1vdXQtcmlnaHQtc2lkZW5hdi1jaGF0XCIpLnNpZGVuYXYoe1xuICAgICAgICBlZGdlOiBcInJpZ2h0XCJcbiAgICB9KTtcblxuICAgIC8vIFBlcmZlY3QgU2Nyb2xsYmFyXG4gICAgJChcInNlbGVjdFwiKVxuICAgICAgICAubm90KFwiLmRpc2FibGVkXCIpXG4gICAgICAgIC5zZWxlY3QoKTtcbiAgICB2YXIgbGVmdG5hdiA9ICQoXCIucGFnZS10b3BiYXJcIikuaGVpZ2h0KCk7XG4gICAgdmFyIGxlZnRuYXZIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBsZWZ0bmF2O1xuICAgIHZhciByaWdodHRuYXYgPSAkKFwiI3NsaWRlLW91dC1yaWdodFwiKS5oZWlnaHQoKTtcblxuICAgIGlmICgkKFwiI3NsaWRlLW91dC5sZWZ0c2lkZS1uYXZpZ2F0aW9uXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKCEkKFwiI3NsaWRlLW91dC5sZWZ0c2lkZS1uYXZpZ2F0aW9uXCIpLmhhc0NsYXNzKFwibmF0aXZlLXNjcm9sbFwiKSkge1xuICAgICAgICAgICAgdmFyIHBzX2xlZnRzaWRlX25hdiA9IG5ldyBQZXJmZWN0U2Nyb2xsYmFyKFwiLmxlZnRzaWRlLW5hdmlnYXRpb25cIiwge1xuICAgICAgICAgICAgICAgIHdoZWVsU3BlZWQ6IDIsXG4gICAgICAgICAgICAgICAgd2hlZWxQcm9wYWdhdGlvbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgbWluU2Nyb2xsYmFyTGVuZ3RoOiAyMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCQoXCIuc2xpZGUtb3V0LXJpZ2h0LWJvZHlcIikubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgcHNfc2xpZGVvdXRfcmlnaHQgPSBuZXcgUGVyZmVjdFNjcm9sbGJhcihcIi5zbGlkZS1vdXQtcmlnaHQtYm9keSwgLmNoYXQtYm9keSAuY29sbGVjdGlvblwiLCB7XG4gICAgICAgICAgICBzdXBwcmVzc1Njcm9sbFg6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmICgkKFwiLmNoYXQtYm9keSAuY29sbGVjdGlvblwiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBwc19zbGlkZW91dF9jaGF0ID0gbmV3IFBlcmZlY3RTY3JvbGxiYXIoXCIuY2hhdC1ib2R5IC5jb2xsZWN0aW9uXCIsIHtcbiAgICAgICAgICAgIHN1cHByZXNzU2Nyb2xsWDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDaGFyIHNjcm9sbCB0aWxsIGJvdHRvbSBvZiB0aGUgY2hhciBjb250ZW50IGFyZWFcbiAgICB2YXIgY2hhdFNjcm9sbEF1dG8gPSAkKFwiI3JpZ2h0LXNpZGViYXItbmF2ICNzbGlkZS1vdXQtY2hhdCAuY2hhdC1ib2R5IC5jb2xsZWN0aW9uXCIpO1xuICAgIGlmIChjaGF0U2Nyb2xsQXV0by5sZW5ndGggPiAwKXtcbiAgICAgICAgY2hhdFNjcm9sbEF1dG9bMF0uc2Nyb2xsVG9wID0gY2hhdFNjcm9sbEF1dG9bMF0uc2Nyb2xsSGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIEZ1bGxzY3JlZW5cbiAgICBmdW5jdGlvbiB0b2dnbGVGdWxsU2NyZWVuKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAoZG9jdW1lbnQuZnVsbFNjcmVlbkVsZW1lbnQgJiYgZG9jdW1lbnQuZnVsbFNjcmVlbkVsZW1lbnQgIT09IG51bGwpIHx8XG4gICAgICAgICAgICAoIWRvY3VtZW50Lm1vekZ1bGxTY3JlZW4gJiYgIWRvY3VtZW50LndlYmtpdElzRnVsbFNjcmVlbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4oRWxlbWVudC5BTExPV19LRVlCT0FSRF9JTlBVVCk7XG4gICAgICAgICAgICB9ZWxzZSBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuY2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQud2Via2l0Q2FuY2VsRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LndlYmtpdENhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAvLyBEZXRlY3QgdG91Y2ggc2NyZWVuIGFuZCBlbmFibGUgc2Nyb2xsYmFyIGlmIG5lY2Vzc2FyeVxuICAgIGZ1bmN0aW9uIGlzX3RvdWNoX2RldmljZSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiVG91Y2hFdmVudFwiKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzX3RvdWNoX2RldmljZSgpKSB7XG4gICAgICAgICQoXCIjbmF2LW1vYmlsZVwiKS5jc3Moe1xuICAgICAgICAgICAgb3ZlcmZsb3c6IFwiYXV0b1wiXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlc2l6ZXRhYmxlKCk7XG5cblxufSk7Il0sInNvdXJjZVJvb3QiOiIifQ==