# The official slide component by Intui
# For use with Preact library
# Preact can be found at https://github.com/developit/preact
# Created by Yury Sidorov. arxii @ https://github.com/arxii

# Best used with Coffeescript and Preact
_extends = require './lib/_extends'

{h,Component} = require 'preact'
cn = require 'classnames'


if !Object.assign
	throw 'Object.assign not found, use polyfill'
if !cn
	throw 'classnames not found'

class Slide extends Component

	# init
	constructor: (props)->
		super(props)
		@state=
			ok:yes
	
	# verify if child is a slide component
	isChild: (c)->
		if !cc then return no
		if cc.getAttribute('class') && cc.getAttribute('class').match(/-i-slide-outer|-i-slide-static/) != null then return yes
		return no
		
	# get the rect
	rect: ()->
		rect=
			width: @props.width || @_outer.clientWidth
			height: @props.height || @_outer.clientHeight	

	events: [
		'onClick'
		'onMouseEnter'
		'onMouseLeave'
	]

	# pass down any event handlers that are part of the array above to the topmost element
	passProps: ()->
		@pass_props = {}
		@events.forEach (e)=>
			if @props[e]
				@pass_props[e] = @props[e];
	
	componentWillMount: ()->
		@passProps()



	componentWillUnUnmount: ()->
		# window.removeEventListener ('resize',this.resize.bind(this))
		# window.removeEventListener ('resize',this.resize)


	# render component
	render: (props,state)->

		o_c = cn '-i-slide-outer', @props.outerClassName, (@props.height != null || @props.width != null) && ' -i-slide-fixed'

		if @props.slide
			inner = []
			outer = []
			for item in props.children
				if @isChild(item)
					inner.push(item)
				else
					outer.push(item)
			ret = h 'div',
				className: o_c
				h 'div',
					_extends {}, pass_props,
						className: '-i-slide-inner', @props.vertical && '-i-slide-vertical', @props.innerClassName, @props.center && '-i-slide-center'
					inner
				outer
		else
			ret = h 'div',
				_extends {},pass_props,className: o_c
				@props.children


		return ret




Slide.defaultProps=
	pos: 0 #initial position of the slide (0,1,2,3....)
	animate: false #3d transitions
	offset: 0 #offset in pixels (positive...how much to add, negative will subtract)
	slide: no #slides through children, if disabled will ignore all internal slide logic, and apply default flex CSS.
	beta: 100 #beta variable
	width: null #width number in pixels
	height: null #same as width
	center: no #css flex center
	vert: no #css flex direction column
	inverse: no #css flex direction inverse





module.exports = Slide





