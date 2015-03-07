class Animis

	constructor: (@_start, @_time, @_callback) ->

		@_cancel = no
		@_pause = no

	pause: ->

		return if @_pause

		@_pausedAt = Date.now()
		@_pause = yes

	isPaused: ->

		@_pause

	continue: ->

		return unless @_pause

		@_start = @_start + Date.now() - @_pausedAt
		@_pause = no

	cancel: ->

		@_cancel = yes

	isCanceled: ->

		@_cancel

	getStart: ->

		@_start

	getTime: ->

		@_time

	getCallback: ->

		@_callback

class Animator

	constructor: ->

		@animating = no

		@animises = []

	animate: (time, cb) ->

		animis = new Animis(Date.now() ,time, cb)

		@animises.push(animis)

		@_requestAnimation()

		animis

	_requestAnimation: (recursive = no) ->

		return if not recursive and @animating

		@animating = yes

		dones = []

		requestAnimationFrame =>

			now = Date.now()

			for animis, i in @animises

				if animis.isCanceled()

					dones.push i

					continue

				if animis.isPaused()

					continue

				start = animis.getStart()
				time = animis.getTime()
				callback = animis.getCallback()

				progress = (now - start) / time

				if progress >= 1

					progress = 1

					callback(progress)

					dones.push i

					continue

				callback(progress)

			for i in dones

				@animises.splice(i, 1)

			if @animises.length > 0

				@_requestAnimation(yes)

			else

				@animating = no

animator = new Animator

module.exports = animator