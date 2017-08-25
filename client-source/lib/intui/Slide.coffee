# The official slide component by Intui
# For use with Preact library
# Preact can be found at https://github.com/developit/preact
# Created by Yury Sidorov. arxii @ https://github.com/arxii

# Best used with Coffeescript and Preact
# _extends = require './lib/_extends'

{h,Component} = require 'preact'
cn = require 'classnames'


if !Object.assign
	throw 'Object.assign not found, use polyfill'
if !cn
	throw 'module "classnames" not installed'

isset = (val)->
	val != null && val != undefined

EVENT_REGEX = new RegExp('^on[A-Z]')

class Slide extends Component

	# init
	constructor: (props)->
		super(props)
		@state=
			x: 0
			y: 0
			width: 0
			height: 0



	getChildContext: ()=>
		vert: @props.vert || @props.vertical || false
		dim: if @props.vert then @state.width else @state.height

	setStateDim: ()->
		@state.width = @_outer.clientWidth
		@state.height = @_outer.clientHeight

	legacyProps: (props)->
		if isset props.vertical
			props.vert = props.vertical 
		if props.width
			props.w = props.width
		if props.height
			props.h = props.height
		if isset props.innerClassName
			props.iclass = props.innerClassName
		
		if isset props.outerClassName
			props.class = props.outerClassName
		if isset props.className
			props.class = props.className



	componentWillReceiveProps: (props)->
		#legacy props support
		@legacyProps(props)


	componentDidUpdate: (p_props)->
		@updateSlidePos(@checkSlideUpdate(p_props))

	# componentDidMount: ()->

	checkSlideUpdate: (p_props)->
		if !@props.slide
			return 0

		if @props.pos != p_props.pos || @props.index_offset != p_props.index_offset || @props.index_offset_beta != p_props.index_offset_beta
			return 2

		rect_width = @state.width
		rect_height = @state.height
		@setStateDim()
		if @props.vert && rect_height != @state.height
			return 1
		if !@props.vert && rect_width != @state.width
			return 1
		return 0

	getTransision: ()->
		'transform ' + @props.ease_dur + 's ' + @props.ease

	toXY: (pos)->
		# @_inner.style.transition = 
		# setTimeout ()=>
		@setState
			transition: @getTransision()
			transform: 'matrix(1, 0, 0, 1, ' + String(-pos.x) + ', ' + String(-pos.y) + ')'
		# @_inner.style.transform = 
		@state.x = pos.x
		@state.y = pos.y
		# ,0

	setXY: (pos)->
		# @_inner.style.transition = ''
		@setState
			transition: ''
			transform: 'matrix(1, 0, 0, 1, ' + String(-pos.x) + ', ' + String(-pos.y) + ')'
		@state.x = pos.x
		@state.y = pos.y

	updateSlidePos: (update_type)->
		if !update_type
			return false

		@setStateDim()
		if update_type == 2
			@toXY @getIndexXY(@props.pos)
		if update_type == 1
			@setXY @getIndexXY(@props.pos)




	# pass down any event handlers that are part of the array above to the topmost element
	passProps: (props)->
		# log @props
		@pass_props = {}
		for prop_name,prop of props
			if EVENT_REGEX.test(prop_name)
				@pass_props[prop_name] = prop 
	
	componentWillMount: (props)->
		@passProps(@props)
		@legacyProps(@props)



	componentWillUnUnmount: ()->
		# window.removeEventListener ('resize',this.resize.bind(this))
		# window.removeEventListener ('resize',this.resize)

	
	# resize: ()->


	getIndexXY: (index)->
		if !isset index
			throw new Error 'index position is undefined'
		if index >= @props.children.length
			throw new Error 'index position out of bounds'

		x = 0
		y = 0
		
		cc = @_inner.children[index]
		

		if @props.vert
			y = cc.offsetTop
		else
			x = cc.offsetLeft

		
		if isset @props.index_offset
			if @props.vert
				y += @props.index_offset
			else
				x += @props.index_offset
		if isset @props.index_offset_beta
			if @props.vert
				y += @state.height/100*@props.index_offset_beta
			else
				x += @state.width/100*@props.index_offset_beta

		last_child = @_inner.children[@_inner.children.length-1]
		
		

		max_y = Math.abs((last_child.offsetTop + last_child.clientHeight)-@state.height)
		max_x = Math.abs((last_child.offsetLeft + last_child.clientWidth)-@state.width )
		


		


		if x > max_x
			x = max_x
		if y > max_y
			y = max_y


		x: x
		y: y


	componentDidMount: ()=>
		# log @props.pos,@props.class
		if @props.slide && @props.pos > 0
			# console.log 'SET XY'
			# setTimeout ()=>
			@setStateDim()
			@setXY @getIndexXY(@props.pos)

	# 	@bindEvents()
	# componentWillUnmount: ()=>
	# 	@unbindEvents()
			# ,0
	# componentWillUpdate: ()=>

	getBeta: ()=>
		beta = @props.beta + '%'

		
		if @props.offset
			sign = @props.offset < 0 && '-' || '+'
			offs = Math.abs(@props.offset) + 'px'
		else if @props.offset_beta
			sign = @props.offset_beta < 0 && '-' || '+'
			offs = Math.abs(@props.offset_beta) + '%'


		if offs
			return 'calc(#{beta} #{sign} #{offs})'
		else
			return beta


	getOuterHW: ()=>

		if @props.square
			dim = {}
			if @props.vert
				dim.height = @context.dim
				dim.width = '100%'
			else
				dim.height = '100%'
				dim.width = @context.dim
			return dim

		# console.log @props.w,@props.dim
		if @context.vert
			width = @props.w || null
			height = @props.dim || @props.h || null
		else
			width = @props.dim || @props.w  || null
			height = @props.h || null





		if @props.vert && @props.auto
			ph = 'auto'
		else if typeof height == 'number'
			ph = height + 'px'
		else
			ph = height


		if !@props.vert && @props.auto
			pw = 'auto'
		else if typeof width == 'number'
			pw = width + 'px'
		else
			pw = width


		if @context.vert
			pw = pw || '100%'
			ph = ph || @getBeta()
		else
			pw = pw || @getBeta()
			ph = ph || '100%'

		height: ph
		width: pw


	onKeyDown: (e)=>
		if e.which == 13 && @props.onEnter
			this.props.onEnter()

	# bindEvents: ()->
	# 	if @props.onMouseEnter
	# 		@_outer.addEventListener 'mouseenter',@props.onMouseEnter
	# 	if @props.onMouseLeave
	# 		@_outer.addEventListener 'mouseleave',@props.onMouseLeave
	
	# unbindEvents: ()->
	# 	if @props.onMouseEnter
	# 		@_outer.removeEventListener 'mouseenter',@props.onMouseEnter
	# 	if @props.onMouseLeave
	# 		@_outer.removeEventListener 'mouseleave',@props.onMouseLeave
	

	# render component
	render: =>
		# console.log 'render'


		class_center = @props.center && '-i-s-center' || null
		class_vert = @props.vert && '-i-s-vertical' || null
		class_fixed = ( (@props.dim || @props.w || @props.h) && '-i-s-fixed') || null
		class_reverse = @props.reverse && '-i-s-reverse' || null
		class_scroll = @props.scroll && '-i-s-scroll' || null


		if @props.slide
			outer_class = cn '-i-s-outer',@props.class,class_fixed
			inner = @props.children
			outer = @props.outer
			inner_props = 
				ref: (e)=>
					@_inner = e
				style:
					transition: @state.transition
					transform: @state.transform
				className: cn '-i-s-inner',class_vert,@props.iclass,class_center

			slide = h 'div',
				Object.assign 
					ref: (e)=>
						@_outer = e
					className: outer_class
					onKeyDown: @onKeyDown
					style:@getOuterHW()
				,@pass_props
				[
					h 'div',
						inner_props
						inner
					@props.outer_children
				]
		else
			outer_class = cn '-i-s-static',@props.class,class_fixed,class_vert,class_center,class_reverse,class_scroll
			slide = h 'div',
				Object.assign 
					ref: (e)=>
						@_outer = e
					onKeyDown: @onKeyDown,
					style:@getOuterHW()
					className: outer_class
				,@pass_props
				@props.children
				@props.outer_children


		slide



Slide.defaultProps=
	pos: 0 #initial position of the slide (0,1,2,3....)
	animate: false #3d transitions
	offset: 0 #offset in pixels (positive...how much to add, negative will subtract)
	slide: no #slides through children, if disabled will ignore all internal slide logic, and apply default flex CSS.
	beta: 100 #beta variable
	width: null #width number in pixels
	square: false
	height: null #same as width
	center: no #css flex center
	vert: no #css flex direction column
	inverse: no #css flex direction inverse
	dim: 0
	scroll: no
	w: 0
	h: 0
	ease: 'cubic-bezier(0.25, 0.34, 0, 1)' #slide easing
	ease_dur: 0.4 #slide easing duration




module.exports = Slide




