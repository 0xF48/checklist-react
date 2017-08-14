
# Input Text
Input = require './Input.coffee'
{createElement,Component} = require 'react'
el = createElement
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
		if e.keyCode == 13
			@props.onEnter && @props.onEnter(e)
		@props.onKeyDown && @props.onKeyDown(e)
	onChange: (e)=>
		@setState
			initial_value: !@props.locked && null
			value: e.target.value
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

		el Input,
			onFocus: @onFocus
			onBlur: @onBlur
			disabled: @props.disabled
			# hideLabel: @props.hideLabel
			label: @props.label
			icon: @props.icon
			className: cn @props.className,@state.focus && 'focus',(@state.focus || @state.value) && 'has-data',@props.icon_label && '-i-icon-label'
		,el 'input', Object.assign({},@props,{
				ref: (e)=>
					@_input = e
				onKeyDown: @onKey
				onFocus: @onFocus
				onBlur: @onBlur
				# onChange: @onChange
				# value: @state.initial_value || @state.value 
				type: @props.type || 'text'
				style: style
				className: '-i-input-text'
			})


module.exports = InputText