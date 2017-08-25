
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

	onInput: (e)=>
		@props.onInput(e)
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
			value: @props.value
			type: @props.type || 'text'
			style: style
			className: '-i-input-text'
		})
		h Input,
			disabled: @props.disabled
			label: @props.label
			onFocus: @onFocus
			onClick: @onFocus
			icon: @props.icon
			className: cn @props.className,@state.focus && 'focus'||null,(@state.focus || @state.value) && 'has-data'||null,@props.icon_labh && '-i-icon-label'||null
			h 'input', props


module.exports = InputText