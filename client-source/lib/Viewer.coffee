{h,Component} = require 'preact'
Slide = require('./intui/Slide')


class Viewer extends Component
	
	constructor: (props)->
		super(props)
		@scale = 1
		@min_scale = 1
		@state =
			loaded: false

		@stage = {}

	onUpdate: ()=>
		if !@_img
			return
		str = 'translate3d('+@stage.x+'px,'+@stage.y+'px,0px) scale('+@stage.scale+')'
		@_img.style.transform = str
		# log @_img.style.transform

	imageLoaded: ()->
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

		@setState
			loaded: yes

	setInitialScale: ()->
		if !@_img then return

		i_w = @_img.naturalWidth
		i_h = @_img.naturalHeight
		c_w = @_root.clientWidth
		c_h = @_root.clientHeight
		@pos = @_root.getBoundingClientRect()
		if i_w <= c_w and i_h <=c_h then return

		s_w = c_w/i_w*0.9
		s_h = c_h/i_h*0.9
		
		if s_h < s_w
			s = s_h
		else
			s = s_w
		

		@min_scale = s
		@scale = s

		TweenLite.set @stage,
			scale: s
			onUpdate: @onUpdate

	onMouseMove: (e,get)=>
		if e.target.id != 'viewer-img' && e.target.id != 'viewer' then return


		if !this._img then return


		i_w0 = this._img.naturalWidth
		i_h0 = this._img.naturalHeight

		i_w = this._img.naturalWidth*this.scale
		i_h = this._img.naturalHeight*this.scale
		c_w = this._root.clientWidth
		c_h = this._root.clientHeight

		@pos = @_root.getBoundingClientRect()
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
		this.scale = this.scale + e.deltaY*0.005
		if this.scale > 1
			this.scale = 1
		else if this.scale < this.min_scale
			this.scale = this.min_scale

		i_w0 = this._img.naturalWidth
		i_h0 = this._img.naturalHeight

		i_w = this._img.naturalWidth*this.scale
		i_h = this._img.naturalHeight*this.scale

		c_w = this._root.clientWidth
		c_h = this._root.clientHeight

		this.pos = this._root.getBoundingClientRect()

		n_s = {}
		n_s.scale = this.scale

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


	componentDidMount: ()->
		this.pos = this._root.getBoundingClientRect()
		if this.state.loaded == false
			this._img.src = this.props.img
			if this._img.complete
				this.imageLoaded()
			else
				this._img.addEventListener('load',this.imageLoaded)
		
	
		this._root.addEventListener('mousemove',this.onMouseMove)
		this._root.addEventListener('mousewheel',this.onWheelDelta)
		this.setInitialScale()


	componentDidUpdate: ()->
		@pos = @_root.getBoundingClientRect()
		@setInitialScale()


	render: (props)=>
		h 'div',
			ref: (e)=>
				@_root = e
			className: 'viewer'
			id: 'viewer'
			onClick: (e)=>
				if @props.onClick
					@props.onClick(e)
			# style:
			# 	width: window.innerWidth
			# 	height: window.innerHeight
			h 'img',
				id: 'viewer-img'
				onClick: (e)=>
					e.preventDefault()
					e.stopPropagation()
					return false
				ref: (e)=>
					@_img = e
				className: 'viewer-image'



module.exports = Viewer;