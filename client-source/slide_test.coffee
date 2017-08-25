import Slide from 'intui/Slide.coffee'
import SlideButton from 'intui/extras/SlideButton.coffee'
import {h,Component} from 'preact'
{Grid,GridItem} = require 'intui/Grid.coffee'

DIM = 50
class Test extends Component
	constructor: (props)->
		super(props)
		@state = 
			pos1: 1
			pos2: 1
			grid_items: [0..100].map @gridItem

	slide1: ()=>
		@setState
			pos1: 1 - @state.pos1

	slide2: ()=>
		@setState
			pos2: 1 - @state.pos2

	gridItem: (index)=>
		h GridItem,
			key: index
			w: 1+Math.round(Math.random()*1)
			h: 1+Math.round(Math.random()*1)
			i: index
			h 'div',
				className: 'b2 center'
				style: 
					width: 'calc(100% - 10px)'
					height: 'calc(100% - 10px)'
					margin: '5px'
					fontSize: '22px'
				'i'+index

	componentDidMount: ()->
		window.addEventListener 'resize',()=>
			@forceUpdate()
		
	render: =>
	
		h Slide,
			vert: yes
			h Slide,
				dim: DIM
				class: 'b0'
				h SlideButton,
					top:
						class: 'b0'
						label: 'slide a'
					bot:
						class: 'b3'
						label: 'slide b'
					dim: DIM*2
					vert: yes
					active: @state.pos1
					onClick: @slide1
				h SlideButton,
					top:
						class: 'b0'
						label: 'slide a'
					bot:
						class: 'b3'
						label: 'grid'
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
						'slide a'
					h Slide,
						class: 'b0'
						h Grid, 
							w: 5
							@state.grid_items



export default Test

				
