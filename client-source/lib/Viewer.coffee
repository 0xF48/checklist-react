{h,Component} = require 'preact'
Slide = require('./intui/Slide.coffee')


class Viewer extends Component
	
	constructor: (props)->
		super(props)
		@state =
			loaded: false
			scale: 1
			min_scale: 1

		@stage = {}

	onUpdate: ()=>
		if !@_img
			return
		str = 'translate3d('+@stage.x+'px,'+@stage.y+'px,0px) scale('+@stage.scale+')'
		@_img.style.transform = str
		# log @_img.style.transform

	imageLoaded: ()=>
		log 'IMAGE LOADED'
		@setInitialScale()

		if !@_img then return

		i_w = @_img.naturalWidth
		i_h = @_img.naturalHeight
		c_w = @_root.clientWidth
		c_h = @_root.clientHeight

		@_img.style.width = i_w
		@_img.style.height = i_h

		TweenLite.set this.stage,
			x: c_w/2 - i_w/2
			y:  c_h/2 - i_h/2

		@onUpdate()

		@setState
			loaded: yes

	setInitialScale: ()->
		if !@_img then return

		i_w = @_img.naturalWidth
		i_h = @_img.naturalHeight
		c_w = @_root.clientWidth
		c_h = @_root.clientHeight
		# @pos = @_root.getBoundingClientRect()
		if i_w <= c_w and i_h <=c_h then return

		s_w = c_w/i_w*0.9
		s_h = c_h/i_h*0.9
		
		if s_h < s_w
			s = s_h
		else
			s = s_w
		@state.min_scale = s
		@state.scale = s
		TweenLite.set @stage,
			scale: s
			onUpdate: @onUpdate

	onMouseMove: (e,get)=>
		
		if !@_img then return

		# log this.pos
		i_w0 = this._img.naturalWidth
		i_h0 = this._img.naturalHeight

		i_w = this._img.naturalWidth*this.state.scale
		i_h = this._img.naturalHeight*this.state.scale
		c_w = this._root.clientWidth
		c_h = this._root.clientHeight

		
		i_x = ( -e.layerX + c_w/2 ) * 1.3
		c_x = c_w/2 - i_w0/2

		i_y = ( -(e.clientY-this.pos.top) + c_h/2 ) * 1.15
		c_y = c_h/2 - i_h0/2

		x = c_x + ( i_x * (i_w-c_w) / c_w )
		y = c_y + ( i_y * (i_h-c_h) / c_h )

		if i_w <= c_w
			x = c_w/2 - i_w0/2

		if i_h <= c_h
			y = c_h/2 - i_h0/2
		
		if get == true
			return [x,y]




		TweenLite.to this.stage, 0.2,
			x: x
			y: y
			onUpdate: @onUpdate


	onWheelDelta: (e)=>
	
		if !this._img then return
		this.state.scale = this.state.scale + e.deltaY*0.005
		if this.state.scale > 1
			this.state.scale = 1
		else if this.state.scale < this.state.min_scale
			this.state.scale = this.state.min_scale

		i_w0 = this._img.naturalWidth
		i_h0 = this._img.naturalHeight

		i_w = this._img.naturalWidth*this.state.scale
		i_h = this._img.naturalHeight*this.state.scale

		c_w = this._root.clientWidth
		c_h = this._root.clientHeight

		

		n_s = {}
		n_s.scale = this.state.scale

		if i_w <= c_w
			n_s.x = c_w/2 - i_w0/2

		if i_h <= c_h
			n_s.y = c_h/2 - i_h0/2

		pos = this.onMouseMove(e,true)

		

		if !pos.length then return

		n_s.x = pos[0]
		n_s.y = pos[1]
		n_s.onUpdate = @onUpdate

		TweenLite.to(this.stage,0.4,n_s)	


	flushState: ()->
		@state.loaded = false
		@stage = {}
		@min_scale = 1



	componentDidUpdate: (props)->
		@pos = @_root.getBoundingClientRect()
	componentDidMount: ()->
		console.log "VIEWER MOUNTED"
		@state.scale = 1
		@state.min_scale = 1
		@pos = @_root.getBoundingClientRect()
		if @state.loaded == false
			if @_img.complete
				@imageLoaded()

		

	
	# updateImage: (props)->
	# 	this.pos = this._root.getBoundingClientRect()
	# 	# if @state.loaded == false
	# 	# 	if @_img.complete
	# 	# 		@imageLoaded()




	render: (props)=>
		if !@state.loaded
			loader = h 'div',
				className:'-i-loader'

		h 'div',
			ref: (e)=>
				@_root = e
			onMouseMove: @onMouseMove
			onMouseWheel: @onWheelDelta

			className: '-i-viewer'
			id: '-i-viewer'
			onClick: (e)=>
				if @props.onClick
					@props.onClick(e)
			h 'img',
				id: '-i-viewer-image'
				onClick: (e)=>
					e.preventDefault()
					e.stopPropagation()
					return false
				ref: (e)=>
					@_img = e
				src: @props.img
				onLoad: @imageLoaded
				className: '-i-viewer-image '+(!@state.loaded && 'hidden'||"")
			loader



module.exports = Viewer;