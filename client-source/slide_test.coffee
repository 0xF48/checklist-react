Slide = require 'intui/Slide.coffee'
SlideButton = require 'intui/extras/SlideButton.coffee'
{h,Component} = require 'preact'


DIM = 50
class Test extends Component
	constructor: (props)->
		super(props)
		@state = 
			pos1: 0
			pos2: 0

	slide1: ()=>
		@setState
			pos1: 1 - @state.pos1

	slide2: ()=>
		@setState
			pos2: 1 - @state.pos2

	render: =>
		h Slide,
			vert: yes
			h Slide,
				dim: DIM
				class: 'b0'
				h SlideButton,
					top:
						class: 'b0'
						label: 'slide b'
					bot:
						class: 'b3'
						label: 'slide a'
					dim: DIM*2
					vert: yes
					active: @state.pos1
					onClick: @slide1
				h SlideButton,
					top:
						class: 'b0'
						label: 'slide 2'
					bot:
						class: 'b3'
						label: 'slide 1'
					dim: DIM*2
					vert: yes
					active: @state.pos2
					onClick: @slide2
			h Slide,
				slide: yes
				vert: yes
				pos: @state.pos1
				h Slide,
					vert: yes
					center: yes
					class: 'blue'
					'slide a'
				h Slide,
					slide: yes
					pos: @state.pos2
					oclass: 'b0'
					h Slide,
						class: 'b3'
						center: yes
						'slide 1'
					h Slide,
						center: yes
						'slide 2'


module.exports = Test

				
