var Animator, Animis, animator;

Animis = (function() {
  function Animis(_start, _time, _callback) {
    this._start = _start;
    this._time = _time;
    this._callback = _callback;
    this._cancel = false;
    this._pause = false;
  }

  Animis.prototype.pause = function() {
    if (this._pause) {
      return;
    }
    this._pausedAt = Date.now();
    return this._pause = true;
  };

  Animis.prototype.isPaused = function() {
    return this._pause;
  };

  Animis.prototype["continue"] = function() {
    if (!this._pause) {
      return;
    }
    this._start = this._start + Date.now() - this._pausedAt;
    return this._pause = false;
  };

  Animis.prototype.cancel = function() {
    return this._cancel = true;
  };

  Animis.prototype.isCanceled = function() {
    return this._cancel;
  };

  Animis.prototype.getStart = function() {
    return this._start;
  };

  Animis.prototype.getTime = function() {
    return this._time;
  };

  Animis.prototype.getCallback = function() {
    return this._callback;
  };

  return Animis;

})();

Animator = (function() {
  function Animator() {
    this.animating = false;
    this.animises = [];
  }

  Animator.prototype.animate = function(time, cb) {
    var animis;
    animis = new Animis(Date.now(), time, cb);
    this.animises.push(animis);
    this._requestAnimation();
    return animis;
  };

  Animator.prototype._requestAnimation = function(recursive) {
    var dones;
    if (recursive == null) {
      recursive = false;
    }
    if (!recursive && this.animating) {
      return;
    }
    this.animating = true;
    dones = [];
    return requestAnimationFrame((function(_this) {
      return function() {
        var animis, callback, i, now, progress, start, time, _i, _j, _len, _len1, _ref;
        now = Date.now();
        _ref = _this.animises;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          animis = _ref[i];
          if (animis.isCanceled()) {
            dones.push(i);
            continue;
          }
          if (animis.isPaused()) {
            continue;
          }
          start = animis.getStart();
          time = animis.getTime();
          callback = animis.getCallback();
          progress = (now - start) / time;
          if (progress >= 1) {
            progress = 1;
            callback(progress);
            dones.push(i);
            continue;
          }
          callback(progress);
        }
        for (_j = 0, _len1 = dones.length; _j < _len1; _j++) {
          i = dones[_j];
          _this.animises.splice(i, 1);
        }
        if (_this.animises.length > 0) {
          return _this._requestAnimation(true);
        } else {
          return _this.animating = false;
        }
      };
    })(this));
  };

  return Animator;

})();

animator = new Animator;

module.exports = animator;
