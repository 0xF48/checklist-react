
var React = require('react');
var el = React.createElement

require('./style/Overlay.scss');

var Overlay = React.createClass({
	displayName: 'Overlay',
	componentDidMount: function(){
		if(this.refs.angle != null){
			this.ctx = this.refs.angle.getContext('2d')
			this.refs.angle.height = 50
			this.refs.angle.width = 50
			
			this.stage = {
				alpha: 1,
				alpha2: 1,
			}
			
			this.refs.overlay.addEventListener('mouseenter',function(){
				this.hover(true)
			}.bind(this))
			
			this.refs.overlay.addEventListener('mouseleave',function(){
				this.hover(false)
			}.bind(this))
			
			this.ctx.translate(this.refs.angle.width/2+0.5, this.refs.angle.height/2+0.5);
			if(this.props.dir == 'right'){
				this.ctx.rotate(-Math.PI/2);
			}else if(this.props.dir == 'left'){
				this.ctx.rotate(Math.PI/2);
			}else if(this.props.dir == 'top'){
				this.ctx.rotate(-Math.PI);
			}else if(this.props.dir == 'bottom'){

			}
			this.ctx.translate(-this.refs.angle.width/2, -this.refs.angle.height/2);

			this.renderAngle(this.stage.alpha,this.stage.alpha2);
		}
	},
	hover: function(enter){
		if(this.ctx == null) return;
		TweenLite.to(this.stage,0.65,{
			ease: Power4.easeOut,
			alpha: enter ? 0.8 : 1,
			alpha2: enter ? 0.8 : 1,
			onUpdate: function(){
				this.renderAngle(this.stage.alpha,this.stage.alpha2)
			}.bind(this)
		})
	},
	renderAngle: function(a,a2){
		this.ctx.clearRect(0,0,50,50);
		this.ctx.lineWidth = 1.5
		this.ctx.lineCap = 'square';
		this.ctx.lineJoin = 'square';
		this.ctx.strokeStyle = this.props.strokeStyle || 'rgba(255,255,255,0.7)';
		this.ctx.beginPath();
	

		var angle = Math.PI/2*a;
		var off = -Math.PI/2		
		var d = 6;


		this.ctx.moveTo(25+Math.cos(off+angle)*10,25+Math.sin(off+angle)*10);
		this.ctx.lineTo(25,25);
		this.ctx.lineTo(25+Math.cos(off+-angle)*10,25+Math.sin(off+-angle)*10);
		

		this.ctx.moveTo(25+Math.cos(off+angle)*10,25+d+Math.sin(off+angle)*10);
		this.ctx.lineTo(25,25+d);
		this.ctx.lineTo(25+Math.cos(off+-angle)*10,25+d+Math.sin(off+-angle)*10);
		this.ctx.stroke();


	},

	// onClick: function(e){
	// 	if(this.props.disabled){
	// 		return false
	// 	}
	// 	this.props.onClick(e)
	// },

	render: function(){
		if(this.props.dir != null && !this.props.dir.match('top|bottom|left|right')){
			throw new Error('Overlay bad direction property')
		}
		var angle;
		if(this.props.dir != null && !this.props.disabled){
			angle = el('canvas',{ref:'angle',className:'-i-angle -i-angle-'+this.props.dir})
		}
		var style = Object.assign({pointerEvents: this.props.show ? 'all' : 'none', 'opacity':this.props.show ? 1 : 0},this.props.style)
		return el('div',Object.assign(this.props,{
			onKeyDown: function(e){
				if(e.keyCode == 27){
					this.props.onClick && this.props.onClick()
				}
			}.bind(this),
			ref: 'overlay',
			style:style,
			className: '-i-overlay '+this.props.className,
			// onClick:this.onClick.bind(this)
		}),angle,this.props.children)
			
	}
})


module.exports = Overlay