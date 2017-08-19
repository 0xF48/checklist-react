# require './lib/polyfills.js'
require './lib/helpers.js'
import {h,render} from 'preact'
# require 'preact/devtools'

window.addEventListener 'mousemove',(e)->
	g.mouse[0] = e.clientX
	g.mouse[1] = e.clientY
window.g =
	isSafari : /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
	colors : [ '#aa00ff', '#ff0000', '#0088ff', '#e55c00', '#00d991', '#3600cc', '#bf0000', '#0077b3', '#ff0044', '#00ccff', '#00f2e2', '#d9ca00', '#36cc00', '#bf00b3', '#b27700', '#b20047' ]
	dim : 50
	dark : '#171a1c'
	mouse: [window.innerWidth/2,window.innerHeight/2]
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



	
# import Test from './slide_test.coffee'

# render h(Test,{}),document.getElementById('checki')



require './style.scss'

