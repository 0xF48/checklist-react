
{h,Component} = require 'preact'
require './style/Grid.scss'
el = h

class GridItem extends Component
	constructor: (props)->
		super(props)
		@state = 
			hidden: false
			show: false
		@state_show = false
		if props.w == 0 || props.h == 0
			throw new Error 'invalid grid item w/h '+w+','+h


	componentWillMount: ()->
		@state_show = false



	show: (set,delay)->

		if @hide_t
			clearTimeout(@hide_t)
			@hide_t = null

		@hide_t = setTimeout ()=>
			if !@_item
				return

			@state.transition = 'transform ' + @props.ease_dur + 's cubic-bezier(.29,.3,.08,1)'
			@state.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,0,0,1)'
			@_item?.style.transition = @state.transition
			@_item?.style.transform = @state.transform

		,delay
		@props.onShow?()


	render: ()->

			
		if @state.show != @props.show
			# console.log 'SHOW',@props.show,@state.show
			@state.show = @props.show
			@setState()

			if @state.show == true


				if @props.w > @props.h
					@state.transform = 'matrix3d(0.6,0,0.00,'+(-0.001+Math.random()*0.002)+',0.00,0,1.00,-0.003,0,-1,0,0,0,0,0,1)'
				else
					@state.transform = 'matrix3d(0,0,1,'+(-0.001+Math.random()*0.002)+',0.00,0.6,0.00,0.001,-1,0,0,0,0,0,0,1)'
					
				@state.transition = ''

				@show(false,50+Math.random()*100)

		# console.log @state.transition,@state_show,@props.children[0].children[0]

		d = this.context.dim
		# console.log d

		el 'div',
			className: '-i-grid-item-outer '+(@props.class||@props.className||@props.outerClassName||'')
			ref: (e)=>
				@_item = e
			style:
				visibility: !@props.show && 'hidden' || 'initial'
				transition: @state.transition
				transform: @state.transform
				left: (this.props.c/this.context.w*100) + '%'
				top: (this.props.r * d) + 'px'
				height: (this.props.h * d) + 'px'
				width: (this.props.w/this.context.w*100) + '%'
			@props.children




GridItem.defaultProps = 
	w: 1
	h: 1
	show: yes
	ease_dur: 0.4




class Grid extends Component
	constructor: (props)->
		super(props)
		@state =
			min_row_index: 0
			display_children: []
			index_array: []
			child_props: []
			inner_width: 0

	getChildContext: ()=>
		# console.log 'get dim'
		animate: @props.animate
		w: @props.w
		dim: @getDim()

	componentWillRecieveProps: (props)->
		if props.innerClass
			props.iclass = props.innerClass
		if props.outerClass
			props.oclass = props.outerClass
		if props.className
			props.oclass = props.className
		if props.outerClass
			props.oclass = props.outerClass
		
		# console.log 'UPDATE GRID'
		

	componentWillUnmount: ()->
		# @_outer.removeEventListener('DOMMouseScroll', this.onMouseWheel);
		# @_outer.removeEventListener('mousewheel', this.onMouseWheel);
		@_outer.removeEventListener('scroll', this.onScroll);
		clearInterval @check_end_interval



	
	addChildSpot: (child)->
		if child.attributes.r? && child.attributes.c?
			return child

		w = child.attributes.w
		h = child.attributes.h


	checkSpot: (r,c,w,h,arr)->
		if arr[r][c] > -1
			return false

		for row in [r...r+h]
			for col in [c...c+w]
				if arr[row]? && arr[row][col]?
					if arr[row][col] > -1
						return false
				else
					return false

		return true

	fillSpot: (w,h,r,c,arr,index)->
		for row in [r...r+h]
			for col in [c...c+w]
				if arr[row]? && arr[row][col]?
					arr[row][col] = index

	addSpots: (h,arr)->
		for i in [0...h]
			row = []
			for c in [0...@props.w]
				row[c] = -1
			arr.push row

	getSpot: (w,h,arr)->
		min_r_i = 0 #min row index
		found = false #found spot
		row_filled = true #row filled 



		if (arr.length - @state.min_row_index) < h
			@addSpots(h,arr)

		

		for row in [@state.min_row_index...arr.length]
			for spot,col in arr[row]
				if spot > -1
					row_filled = false #row is filled
				else if @checkSpot(row,col,w,h,arr)
					return [row,col]
			if row_filled
				@state.min_row_index = row


		@addSpots(h,arr)
		@getSpot(w,h,arr)



	flushState: ()->
		@state.display_children = []
		@state.index_array = []
		@state.min_row_index = 0
		@state.row_h = null
		@state.row_n = null
		@state.row_top = null
		@state.row_bot = null
		@state.offset_update = null




	addChild: (child,index)->
		w = child.attributes.w
		h = child.attributes.h
		# child. = index
		# log 'add child',@state.child_props
		[row,col] = @getSpot(w,h,@state.index_array)
		# log row,col
		@state.child_props[index] = 
			r: row
			c: col
		# log child
		@fillSpot(w,h,row,col,@state.index_array,index)


	setChildren: (children)->
		@flushState()
		for child,i in children
			@addChild(child,i)

		# console.log @state
		return children


	appendChildren: (children)->
		for child,i in children
			if child.attributes.r? && child.attributes.c?
				continue
			@addChild(child,i)
		return children





	getDim: ()=>
		# console.log @_inner?.clientWidth
		@_inner?.clientWidth / @props.w

	getInnerHeight: ()->
		@getDim() * @state.index_array.length

	offsetChildren: (children)=>
		# console.log @state.index_array
		
		arr = @state.index_array
		dim = @getDim()

		
		row_h = Math.round(@_outer.clientHeight/dim)
		row_n = Math.round((@props.offset_height_factor * @_outer.clientHeight)/dim)
		row_top = Math.round(@_outer.scrollTop/dim)
		row_top += Math.round((row_h/2 - row_n/2))
		row_bot = Math.round(row_top + row_n)

		if row_top < 0
			row_top = 0

		if row_bot > arr.length
			row_bot = arr.length

		if row_top > arr.length
			row_top = 0


		if @state.row_h == row_h && row_n == @state.row_n && row_top == @state.row_top && row_bot == @state.row_bot
			return @state.display_children

		@state.row_scroll_top = Math.round(@_outer.scrollTop/dim)
		@state.row_h = row_h
		@state.row_n = row_n
		@state.row_top = row_top
		@state.row_bot = row_bot
		@state.offset_update = true


		display_children = []
		added = []
		# console.log arr,@state.index_array
		for row in [row_top...row_bot]
			for spot in arr[row]
				if spot == -1
					continue
				if !(added[spot]?)
					added[spot] = true
					if @state.scroll_up
						display_children[display_children.length] = children[spot]
					else
						display_children.unshift(children[spot])

		return display_children

	updateGrid: (oldProps,newProps)->
		# console.log 'update grid'
		# console.log oldProps,newProps
		if oldProps.children.length != newProps.children.length || oldProps.list_key != newProps.list_key
			if @props.fixed
				@state.display_children = @setChildren(newProps.children)
			else
				@state.display_children = @offsetChildren(@setChildren(newProps.children))

		if oldProps.append_children.length != newProps.append_children.length
			if @props.fixed
				@appendChildren(newProps.children)
			else
				@state.display_children = @offsetChildren(@appendChildren(newProps.children))






	onScroll: ()=>
		if @state.last_scroll > @_outer.scrollTop
			@state.scroll_up = true
		else
			@state.scroll_up = false

		@state.last_scroll = @_outer.scrollTop
		# @s = @s || 0
		# @s++
		@state.display_children = @offsetChildren(@props.children)
		if @state.offset_update
			@forceUpdate()
		# else if @s % 10 == 0
		# 	@forceUpdate()


	componentDidMount: ()->
		@_outer.addEventListener('scroll', this.onScroll)
		setTimeout ()=>
			if @props.fixed 
				@state.display_children = @setChildren(@props.children)
			else
				@state.display_children = @offsetChildren(@setChildren(@props.children))
			@forceUpdate()
		,0

		

	updateScroll: ()->
		@_outer.scrollTop = @state.row_scroll_top * @getDim()


	componentWillUpdate: (newProps)->
		if @_inner.clientWidth != @state.inner_width
			# console.log 'WILL UPDATE'
			@updateScroll()
			# @state.display_children = @offsetChildren(@props.children)
			@state.inner_width = @_inner.clientWidth

		@updateGrid(@props,newProps)

	childVisible: (c)->
		d = @getDim()
		min = @_outer.scrollTop - 100
		max = @_outer.scrollTop + @_outer.clientHeight + 100
		top = c.attributes.r * d
		bot = top + c.attributes.h * d


		if @_outer?
			if min <= bot && top <= max
				return true
			else
				return false
				

		return false
		
		


		
	render: ()=>
		# console.log @state.display_children
		# log @state.display_children
		@state.display_children = @state.display_children.map (c)=>
			if !c
				return null
			@props.children[c.attributes.i]

		# log @state.display_children

		for c,i in @state.display_children
			if !c? || !@state.child_props.length
				continue
			# log @state.child_props
			c.attributes.r = @state.child_props[c.attributes.i].r
			c.attributes.c = @state.child_props[c.attributes.i].c
			c.attributes.show = if @props.fixed then true else @childVisible(c)
			# log 'VISIBLE',c.attributes.show
			
		# console.log @state
		if @props.show_loader
			stop_loader  = @props.max_reached && @max_scroll_pos >= @total_max_pos && '-i-loader-stop' || ''
			loader = h 'div',
				className: "-i-loader #{stop_loader||''}"

		# log 'RENDER GRID'

		@state.offset_update = false

		el 'div',
			key: @key
			ref: (e)=>
				@_outer = e
			className: "-i-grid #{@props.fixed && '-i-grid-fixed'||''} #{@props.oclass || @props.class || @props.className}"
			@props.pre_children
			el 'div',
				style:
					height: @getInnerHeight()+'px'
				ref: (e)=>
					@_inner = e
				className: "-i-grid-inner #{@props.iclass||''}"
				@state.display_children
				loader
			@props.post_children


Grid.defaultProps = 
	animate: yes
	append_children: []
	children: []
	pre_children: []
	fixed: no
	post_children: []
	offset_height_factor: 1.5
	w: 4

module.exports = {GridItem,Grid}
# module.exports = {Grid,GridItem} 
