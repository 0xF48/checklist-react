
cn = require 'classnames'
SlideButton = require './SlideButton.coffee'
Button = require './Button.coffee'
{createElement,Component} = require 'react'
el = createElement

class SquareButton extends Component
	constructor: (props)->
		super(props)
	render: (props,state)=>
		if @props.reverse
			class2 = @props.pClass
			class1 = @props.sClass
			if @props.active
				pos = 0
				offset = 0
			else
				pos = 1
				offset = -5

		else
			class1 = @props.pClass
			class2 = @props.sClass
			if @props.active
				pos = 1
				offset = 0
			else
				pos = 0
				offset = 5


		# log @props.offset,offset

		if @props.offset != undefined
			offset = @props.offset

		

		el SlideButton, 
			Object.assign @props,
				className: 'btn '+@props.className
				outerClassName: @props.outerClassName
				innerClassName: @props.innerClassName
				index_offset: offset
				pos: pos
			el Button,
				i: @props.i2 || @props.i
				className: class2
				pre: @props.pre || @props.pre1
				label: @props.label
			el Button,
				i: @props.i
				className: class1
				pre: @props.pre || @props.pre2
				label: @props.label
				


module.exports = SquareButton