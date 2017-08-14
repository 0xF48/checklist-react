# require './lib/polyfills.js'
require './lib/helpers.js'
{h,render} = require 'preact'
# require 'preact/devtools'

window.g =
	isSafari : /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
	colors : [ '#aa00ff', '#ff0000', '#0088ff', '#e55c00', '#00d991', '#3600cc', '#bf0000', '#0077b3', '#ff0044', '#00ccff', '#00f2e2', '#d9ca00', '#36cc00', '#bf00b3', '#b27700', '#b20047' ]
	dim : 50
	dark : '#171a1c'
	light : '#fff'
	slide_duration: 400
	small_width: window.innerWidth < 500
	origin: 'http://localhost:8787'

Alt = require('alt');
window.alt = new Alt();
window.actions = require './actions.coffee'
window.store = 	require './store.coffee'
View = require './view.coffee'
render h(View,{}),document.getElementById('checki')
require './style.scss'

