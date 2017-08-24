require './style/Input.scss';
{h,Component} = require 'preact'
cn = require 'classnames'

class Input extends Component
	render: ->
		if @props.label
			label = h 'span',className:'label',@props.label

		if @props.icon
			icon = h 'i', className: 'material-icons',@props.icon
		
		children = [icon,label].concat @props.children
		
		h 'div',
			ref: @props.ref
			onClick:  @props.onClick || @props.onFocus
			className: cn '-i-input',@props.className,@props.disabled && 'disabled'
		,children


module.exports = Input