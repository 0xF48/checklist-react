require './style/Overlay.scss'
{h,Component} = require 'preact'
cn = require 'classnames'

class Overlay extends Component
	constructor: (props)->
		super(props)

	componentDidMount: ()->
		if !(@_angle?) 
			return

		@ctx = @_angle.getContext('2d')
		@_angle.height = 50
		@_angle.width = 50
		@stage =
			alpha: 1
			alpha2: 1

		@_overlay.addEventListener 'mouseenter',()=>
			@hover(true)

		@_overlay.addEventListener 'mouseleave',()=>
			@hover(false)


		this.ctx.translate(@_angle.width/2+0.5, @_angle.height/2+0.5)

		if this.props.dir == 'right'
			this.ctx.rotate(-Math.PI/2);
		else if this.props.dir == 'left'
			this.ctx.rotate(Math.PI/2);
		else if this.props.dir == 'top'
			this.ctx.rotate(-Math.PI);


		this.ctx.translate(-this._angle.width/2, -this._angle.height/2)
		this.renderAngle(this.stage.alpha,this.stage.alpha2)

	hover: (enter)->
		if !this.ctx? then return
		TweenLite.to(this.stage,0.3,{
			ease: Power4.easeOut,
			alpha: enter && 0.8 || 1,
			alpha2: enter && 0.8 || 1,
			onUpdate: ()=>
				this.renderAngle(this.stage.alpha,this.stage.alpha2)
		})


	renderAngle: (a,a2)->
		@ctx.clearRect(0,0,50,50);
		@ctx.lineWidth = 1.5
		@ctx.lineCap = 'square';
		@ctx.lineJoin = 'square';
		@ctx.strokeStyle = this.props.strokeStyle || 'rgba(255,255,255,0.7)';
		@ctx.beginPath();
	

		angle = Math.PI/2*a;
		offset = -Math.PI/2		
		d = 6;


		@ctx.moveTo(25+Math.cos(offset+angle)*10,25+Math.sin(offset+angle)*10)
		@ctx.lineTo(25,25)
		@ctx.lineTo(25+Math.cos(offset+-angle)*10,25+Math.sin(offset+-angle)*10)
		
		@ctx.moveTo(25+Math.cos(offset+angle)*10,25+d+Math.sin(offset+angle)*10)
		@ctx.lineTo(25,25+d)
		@ctx.lineTo(25+Math.cos(offset+-angle)*10,25+d+Math.sin(offset+-angle)*10)
		@ctx.stroke()


	render: =>
		if @props.dir? && !@props.dir.match('top|bottom|left|right')
			throw new Error('Overlay bad direction property')

		if this.props.dir != null && !this.props.disabled
			angle = h 'canvas',
				ref: (e)=>
					@_angle = e
				className:'-i-angle -i-angle-'+this.props.dir

	

		pass_props = Object.assign @props,
			onKeyDown: (e)=>
				if e.keyCode == 27
					this.props.onClick && this.props.onClick()
			ref: (e)=>
				@_overlay = e
			style: 
				pointerEvents: this.props.show && 'all' || 'none' 
				opacity :this.props.show && 1 || 0
			className: '-i-overlay '+(this.props.className||''),
		h 'div',pass_props,
			angle
			@props.children

Overlay.defaultProps=
	dir: 'bottom'

module.exports =  Overlay