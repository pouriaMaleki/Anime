Simple Animator
===============

Simply set only one request for animation on browser and handle your callback.

It request animation frame continuously if any animation exist.

Use it like other Browserify/CommonJS modules.

Installation
------------


	$ npm install simple-animator

API
---

    animator = require('simple-animator');

    duration = 3000; // duration in ms

    callback = function(progress){

    	console.log(progress);
    	// shows progress normal values(from 0 to 1)

    }

    handle = animator.animate(duration, callback);

    handle.pause();

    handle.continue();

    handle.cancel();




Sample of multiple requests

    handle1 = animator.animate(1000, callback1);
    handle2 = animator.animate(2000, callback2);
    handle3 = animator.animate(3000, callback3);

