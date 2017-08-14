#Input base class

# Button = require './Button.coffee'
{createElement,Component} = require 'react'
el = createElement
cn = require 'classnames'
Slide = require './Slide.js'

class SlideButton extends Component
	
	constructor: (props)->
		super(props)
		@state = 
			pos: props.start || 0
	onClick: (e)=>
		if @props.disabled then return false
		@onEnter()
		@props.onClick && @props.onClick(e)

	onEnter: (e)=>
		# console.log @props.start
		# if @props.pos != null then return false
		if @props.disabled then return false
		@setState
			hover: yes
			pos: (1-(@props.start||0))
		if @props.onMouseEnter then @props.onMouseEnter(e)
	onLeave: (e)=>
		# if @props.pos != null then return false
		# if @props.disabled then return false
		# console.log (@props.start||0)
		@setState
			hover: no
			pos: (@props.start||0)
		if @props.onMouseLeave then @props.onMouseLeave(e)


	componentWillUpdate: (props,state)=>
		# console.log 'will update',@props.toggle
		if @props.toggle != props.toggle
			@setState
				pos: props.toggle
	render: =>
		# console.log 'render btn',@props.toggle
		# console.log @props.pos
		hover = @state.hover
		# console.log pos
		# console.log @state.pos
		# if typeof @props.hover == 'boolean'
		# 	if @props.hover
		# 		pos = (1-(@props.start||0))
		# 		hover = yes
		# 	else
		# 		pos = (@props.start||0)
		# 		hover = no
		# else
		if typeof @props.pos == 'number'
			pos = @props.pos
		else
			pos = @state.pos			

		if typeof @props.hover == 'boolean'
			offset = @props.hover && @props.index_offset || 0
		else
			offset = @state.hover && @props.index_offset || 0

		el Slide,
			className: cn('-i-slide-btn',@props.className,@props.disabled && 'disabled',@props.square && 'square')
			outerClassName: @props.outerClassName
			innerClassName: @props.innerClassName
			onMouseEnter: @onEnter
			onMouseLeave: @onLeave
			onClick: @onClick
			flip: no
			width: @props.width
			height: @props.height
			pos: pos
			slide: true
			index_offset: offset
			vertical: @props.vertical || false
		,
			el Slide,{},@props.children[@props.inverse && 1 || 0]
			el Slide,{},@props.children[!@props.inverse && 1 || 0]

SlideButton.defaultProps=
	pos: null

module.exports = SlideButton