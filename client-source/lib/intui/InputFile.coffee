
# Input Text
Input = require './Input.coffee'
{h,Component} = require 'preact'
cn = require 'classnames'

class InputFile extends Component
	constructor: (props)->
		@state = 
			focus: no
			initial_value: props.value
			value: props.value
			clicked: false
	onBlur: (e)=>
		console.log 'blur'
	onClick: (e)=>
		if @state.clicked
			@setState
				clicked:false
			return false
		# console.log 'on click'
		@setState
			clicked:true
		
		e_n = new MouseEvent 'click',
			'view': window
			'bubbles': true
			'cancelable': true
		@_file.dispatchEvent(e_n)
		

	onInput: (e)=>
		# console.log e.target.value
		console.log "ON INPUT"
		@setState
			initial_value: null
			value: e.target.files[0].name
		@props.onInput && @props.onInput(e)
	# onComponentDidMount: (e)=>

	render: =>


		if @props.barColor
			style = 
				'border-color':@props.barColor
		
		
	

	
		h Input,
			onClick: @onClick
			onFocus: @onFocus
			onBlur: @onBlur
			disabled: @props.disabled
			label: @props.label
			className: cn 'file',@props.className,!@state.value && 'focus',(@state.focus || @state.value) && 'has-data'
		,
			label = h 'input',
				type: 'text'
				disabled: true
				style: style
				className: cn '-i-input-text',!@state.value && 'hidden'
				value: @state.value
			icon = h 'i',
				className: cn 'material-icons',@state.value && 'hidden'
			,'file_upload'

			h 'input',
				name: @props.name
				value: @state.initial_value || @state.value
				type: 'file'
				ref: (e)=>
					@_file = e
				onBlur: @onBlur
				onChange: @onInput
			

		
module.exports = InputFile