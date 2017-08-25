require './style/Modal.scss'
{h,Component} = require 'preact'
Overlay = require './Overlay.coffee'
cn = require 'classnames'

class Modal extends Component
	constructor: (props)->
		super(props)
		@mouse = props.mouse || [window.innerWidth/2,window.innerHeight/2]
		@stage =
			x: 0
			y: 0
		@state =
			start_radius: 10


	attr: (b,a,delta)->
		b - (b-a) * delta


	
	draw_rect: (ctx)->
		if !@_canvas
			return
		ctx.clearRect 0,0,@_canvas.clientWidth,@_canvas.clientWidth
		ctx.beginPath()
		for i in [0..3]
			ctx.lineTo(@pos[i].x,@pos[i].y)
		ctx.closePath()
		ctx.fill()

	update: ()=>
		
		rect = @_content.getBoundingClientRect()
		@_canvas.width = @_overlay._overlay.clientWidth
		@_canvas.height = @_overlay._overlay.clientHeight
		@ctx.fillStyle = @props.backColor

		@pos = [
			{ x:rect.left, y:rect.top }
			{ x:rect.left + rect.width , y:rect.top }
			{ x:rect.left + rect.width, y:rect.top + rect.height }
			{ x:rect.left, y:rect.top + rect.height }
		]


		@draw_rect(@ctx)




	show: ()=>
		

		# console.log @root
		rect = @_content.getBoundingClientRect()
		# console.log rect
		rect = rect
		@ctx = @_canvas.getContext('2d')
		@_canvas.width = @_overlay._overlay.clientWidth
		@_canvas.height = @_overlay._overlay.clientHeight
		@ctx.fillStyle = @props.backColor

		@perim = [
			{ x:rect.left, y:rect.top }
			{ x:rect.left + rect.width , y:rect.top }
			{ x:rect.left + rect.width, y:rect.top + rect.height }
			{ x:rect.left, y:rect.top + rect.height }
		]

		r = @state.start_radius

		x = @mouse[0]
		y = @mouse[1]

		@perim_start = [
			{x: x, y: y }
			{x: x + r, y: y}
			{x: x + r,y:  y + r}
			{x: x, y: y + r }
		]

		@pos = @perim.slice(0)


		for i in [3..0]
			TweenLite.fromTo @pos[i],0.2+(i*0.1),
				x: @perim_start[i].x
				y: @perim_start[i].y
			,
				x: @perim[i].x
				y: @perim[i].y
				ease: Elastic.easeOut.config(0.2)
				onUpdate: ()=>
					# console.log 'draw'
					@draw_rect(@ctx)			


	componentDidUpdate:(props,state)->
		if @props.show == true && @props.show != props.show
			setTimeout @show,0
	
	componentDidMount: (props,state)->
		if @props.show == true
			setTimeout @show,0
			# @show()
		window.addEventListener 'resize',@update
	
	componentWillUnmount: ()->
		window.removeEventListener 'resize',@update
	
	render: =>
		h Overlay,
			className: '-i-modal-wrap'
			onClick: @props.onClick
			show: @props.show
			ref: (el)=>
				@_overlay = el
			
			h 'canvas',
				className: '-i-modal-canvas'
				ref: (el)=>
					@_canvas = el 
			
			h 'div',
				className: '-i-modal-close'
				onClick: (e)=>
					e.stopPropagation()
					e.preventDefault()
					@props.onClick()
					return false
				h 'i',
					className: 'material-icons'
					'close'
			
			h 'div',
				onClick: (e)->
					e.stopPropagation()
				ref: (el)=>
					@_content = el 
				# ref: 'content'
				className: cn '-i-modal-content',@props.className
				@props.children


module.exports = Modal

