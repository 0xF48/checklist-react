require './style/Button.scss';
#Input base class

{createElement,Component} = require 'react'
el = createElement
cn = require 'classnames'
SlideMixin = require './SlideMixin.js'
class Button extends Component
	mixins: [SlideMixin]
	render: ->

		if @props.label
			label = el 'span',className:'label',@props.label
		if @props.i
			i = el 'i',className:'material-icons',@props.i
		if @props.size || @props.width || @props.height
			style = 
				width: (@props.width || @props.size) + 'px'
				height: (@props.height || @props.size) + 'px'

		el 'div',
			Object.assign @props,
				onClick: @props.onClick
				className: cn '-i-btn',@props.big && 'big',@props.square && 'square',@props.className,@props.disabled && 'disabled'
				style: style
		,
			@props.pre
			i
			label



module.exports = Button