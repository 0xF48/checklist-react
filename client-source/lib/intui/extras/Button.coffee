require './style/Button.scss';
Slide = require '../Slide.coffee'
#Input base class

{h,Component} = require 'preact'
cn = require 'classnames'
class Button extends Component
	getChildContext: ()=>
		vert: @context.vert
		dim: @context.dim
	render: ->

		if @props.label
			label = h 'span',className:'label',@props.label
		if @props.i
			i = h 'i',className:'material-icons',@props.i
		if @props.dim || @props.width || @props.height
			style = 
				width: (@props.width || @props.dim) + 'px'
				height: (@props.height || @props.dim) + 'px'
		h Slide,
			Object.assign {},@props,
				center: yes
				class: cn '-i-btn',@props.big && 'big',@props.square && 'square',@props.class,@props.disabled && 'disabled'
			@props.pre
			i
			label

module.exports = Button
