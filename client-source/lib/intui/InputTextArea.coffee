require './style/Input.scss';
#Input base class

{h,Component} = require 'preact'
cn = require 'classnames'

class InputTextArea extends Component
	constructor: (props)->
		@state = 
			focus: no
			initial_value: props.value
			value: props.value
	onClick: =>
		@_text_area.focus()

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
		setTimeout ()=>
			@_text_area.style.height = 'auto';
			@_text_area.style.height = @_text_area.scrollHeight+'px';
		,0

	onInput: (e)=>
		@resize(e)
		@state.value = e.value
		@props.onInput && @props.onInput(e)
	componentDidMount: =>
		@resize()
	render: ->
		if @props.label
			label = h 'span',className:'label',@props.label
		area = h 'textarea',
			onBlur: @onBlur
			value: @props.value
			onFocus: @onFocus
			onInput: @onInput
			ref: (e)=>
				@_text_area = e
			# onCut: @onChange
			# onPaste: @onChange
			# onDrop: @onChange
			# onKeyDown: @onChange

		,@props.value		

		bar = h 'div',className:'textarea-bar'
		h 'div',
			onClick: @onClick
			# onFocus: @onFocus
			# onBlur: @onBlur
			className: cn '-i-input',@state.focus && 'focus'||'','textarea',@props.className,@props.disabled && 'disabled'||''
		,
			bar
			label
			area

module.exports = InputTextArea
