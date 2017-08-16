
# Input Text
Input = require './Input.coffee'
{h,Component} = require 'preact'
cn = require 'classnames'

class InputText extends Component
	constructor: (props)->
		@state = 
			focus: no
			initial_value: props.value
			value: props.value
	onFocus: ()=>
		if @state.focus || @props.disabled then return false
		@setState
			focus: yes
		@_input.focus()
	onBlur: ()=>
		if !@state.focus then return false
		@setState
			focus: no
		@_input.blur()
	onKey: (e)=>
		console.log 'TEST'
		if e.keyCode == 13
			@props.onEnter && @props.onEnter(e)
		@props.onKeyDown && @props.onKeyDown(e)
	# onChange: (e)=>
	# 	# console.log 'onchange'
	# 	@setState
	# 		initial_value: !@props.locked && null
	# 		value: e.target.value
		# @props.onChange && @props.onChange(e)
	componentWillUpdate: (props,state)=>
		if @props.value != props.value
			@setState
				initial_value: props.value
				value: props.value

	focus: ->
		@_input.focus()

	render: =>	
		if @props.barColor
			style = 
				'border-color':@props.barColor
		props = Object.assign({},@props,{
			ref: (e)=>
				@_input = e
			onKeyDown: @onKey
			onFocus: @onFocus
			onBlur: @onBlur
			onInput: @props.onChange
			# value: @state.initial_value || @state.value 
			type: @props.type || 'text'
			style: style
			className: '-i-input-text'
		})
		h Input,
			onFocus: @onFocus
			onBlur: @onBlur
			disabled: @props.disabled
			# hideLabel: @props.hideLabel
			label: @props.label
			icon: @props.icon
			className: cn @props.className,@state.focus && 'focus'||null,(@state.focus || @state.value) && 'has-data'||null,@props.icon_labh && '-i-icon-label'||null
			h 'input', props


module.exports = InputText