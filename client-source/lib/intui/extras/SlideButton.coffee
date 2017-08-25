#Input base class

# Button = require './Button.coffee'
{h,Component} = require 'preact'
cn = require 'classnames'
Button = require './Button.coffee'
Slide = require '../Slide.coffee'
require './style/SlideButton.scss'

class SlideButton extends Component
	
	getChildContext: ()=>
		vert: @context.vert
		dim: @context.dim
	
	constructor: (props)->
		super(props)
		@state = 
			hover: no
			start_pos: @getStartPos(props)
			pos: @getStartPos(props)


	getStartPos: (props)->
		pos = 0
		if props.active
			pos = 0
			if props.reverse
				pos = 1
		else
			pos = 0
			if props.reverse
				pos = 1
		return pos
	
	getPos: ()=>
		if @props.active
			return 1 - @state.start_pos
		else
			return @state.start_pos


	onMouseEnter: (e)=>
		if @props.disabled then return false
		offset = 0
		if !@props.index_reverse
			if @props.active
				offset = -@props.active_index_offset
			else
				offset = @props.index_offset

		if @props.reverse
			offset = -offset


		@setState
			hover: yes
			offset: offset
		if @props.onMouseEnter then @props.onMouseEnter(e)
	
	onMouseLeave: (e)=>
		offset = 0
		if @props.index_reverse
			if @props.active
				offset = -@props.active_index_offset
			else
				offset = @props.index_offset

		if @props.reverse
			offset = -offset
		
		@setState
			hover: no
			offset: offset
		if @props.onMouseLeave then @props.onMouseLeave(e)

	onClick: (e)=>
		if @props.onClick then @props.onClick(e);
		setTimeout ()=>
			@onMouseLeave(e)
		,0

	render: =>
		# hover = @state.hover

		# if typeof @props.hover == 'boolean'
		# 	offset = @props.hover && @props.index_offset || 0
		# else
		# 	offset = @state.hover && @props.index_offset || 0

		
		top = @props.top || {}
		bot = @props.bot || {}
		top.class = top.class || @props.sClass
		bot.class = bot.class || @props.pClass
		top.label = top.label || @props.label
		top.i = top.i || @props.i
		bot.label = bot.label || @props.label
		bot.i = bot.i || @props.i

		if @props.reverse
			tp = top.class
			top.class = bot.class
			bot.class = tp

		# console.log @props.disabled
		# console.log @getPos()

		props = Object.assign {},@props,
			className: cn('-i-slide-btn',@props.class || @props.className,@props.disabled && 'disabled'||null)
			onMouseEnter: @onMouseEnter
			onMouseLeave: @onMouseLeave
			onClick: @onClick
			pos: @getPos()
			slide: true
			index_offset: @state.offset

		# console.log props

		
		h Slide, props,
			h Button, top
			h Button, bot
		
		

SlideButton.defaultProps=
	pos: null
	index_reverse: false
	active_index_offset: 0
	index_offset: 5


module.exports = SlideButton
