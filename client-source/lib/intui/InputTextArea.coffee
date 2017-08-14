require './style/Input.scss';
#Input base class

{createElement,Component} = require 'react'
el = createElement
cn = require 'classnames'

class InputTextArea extends Component
	constructor: (props)->
		@state = 
			focus: no
			initial_value: props.value
			value: props.value
	onClick: =>
		@base.querySelector('textarea').focus()

	onFocus: =>
		if @state.focus
			return false
		@setState
			focus: yes


	onBlur: =>
		if !@state.focus
			return false
		@setState
			focus: no

	resize: =>
		text = @base.querySelector('textarea')
		setTimeout ()=>
			text.style.height = 'auto';
			text.style.height = text.scrollHeight+'px';
		,0

	onChange: (e)=>
		@resize(e)
		@props.onChange && @props.onChange(e)
	componentDidMount: =>
		@resize()
	render: ->
		if @props.label
			label = el 'span',className:'label',@props.label
		area = el 'textarea',
			onBlur: @onBlur
			onFocus: @onFocus
			onChange: @onChange
			# onCut: @onChange
			# onPaste: @onChange
			# onDrop: @onChange
			# onKeyDown: @onChange

		,@props.value		

		bar = el 'div',className:'textarea-bar'
		el 'div',
			onClick: @onClick
			# onFocus: @onFocus
			# onBlur: @onBlur
			className: cn '-i-input',@state.focus && 'focus','textarea',@props.className,@props.disabled && 'disabled'
		,
			bar
			label
			area


module.exports = InputTextArea