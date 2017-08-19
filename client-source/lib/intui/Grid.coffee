import {h as el,Component} from 'preact'
require './style/Grid.scss'


class GridItem extends Component
	constructor: (props)->
		super(props)
		@state = 
			hidden: false
		if props.w == 0 || props.h == 0
			throw new Error 'invalid grid item w/h '+w+','+h

	componentDidMount: ()->


	render: ()->
		d = this.context.dim
		# console.log @props.r,@props.c,d,@props.children[0].children[0],@props.w,@props.h
		el 'div',
			className: '-i-grid-item-outer '+(@props.class||@props.className||@props.outerClassName)
			ref: (e)=>
				@_item = e
			style:
				left: (this.props.c * d) + 'px'
				top: (this.props.r * d) + 'px'
				height: (this.props.h * d) + 'px'
				width: (this.props.w * d) + 'px'
			@props.children




GridItem.defaultProps = 
	w: 1
	h: 1

C = 100
cc = 0


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
		console.log 'get dim'
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
		
		console.log 'UPDATE GRID'
		@updateGrid(@props,newProps)

	componentWillUnmount: ()->

		@_outer.removeEventListener('mousewheel', this.onMouseWheel);
		@_outer.removeEventListener('scroll', this.onScroll);
		clearInterval @check_end_interval


	componentDidMount: ()->
		@_outer.addEventListener('DOMMouseScroll', this.onMouseWheel, false)
		@_outer.addEventListener('mousewheel', this.onMouseWheel)
		@_outer.addEventListener('scroll', this.onScroll)


	
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
		# log arr
		# if cc > C
		# 	throw 'overflow'
		# cc++
		min_r_i = 0 #min row index
		found = false #found spot
		row_filled = true #row filled 



		if (arr.length - @state.min_row_index) < h
			@addSpots(h,arr)

		# console.log arr,@state.min_row_index

		for row in [@state.min_row_index...arr.length]
			for spot,col in arr[row]
				if spot > -1
					row_filled = false #row is filled
				else
					# console.log row,col,w,h,arr
					# console.log @checkSpot(row,col,w,h,arr)
					if @checkSpot(row,col,w,h,arr)
						return [row,col]
			if row_filled
				@state.min_row_index = row

		@addSpots(h,arr)
		@getSpot(w,h,arr)



	flushState: ()->
		@state.display_children = []
		@state.index_array = []
		@state.min_row_index = 0




	addChild: (child,index)->
		w = child.attributes.w
		h = child.attributes.h
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
		return children


	appendChildren: (children)->
		for child,i in children
			if child.attributes.r? && child.attributes.c?
				continue
			@addChild(child,i)
		return children





	getDim: ()=>
		@_inner?.clientWidth / @props.w

	getInnerHeight: ()->
		@getDim() * @state.index_array.length

	offsetChildren: (children)->
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


		# log @_outer.clientHeight






		if @state.row_h == row_h && row_n == @state.row_n && row_top == @state.row_top && row_bot == @state.row_bot
			return @state.display_children

		@state.row_scroll_top = Math.round(@_outer.scrollTop/dim)
		@state.row_h = row_h
		@state.row_n = row_n
		@state.row_top = row_top
		@state.row_bot = row_bot
		@state.offset_update = true

		log 'offset ROW_H:', row_h
		log 'offset ROW_N:', row_n
		log 'offset ROW_TOP:', row_top
		log 'offset ROW_BOT:', row_bot



		display_children = []
		added = {}
		for row in [row_top...row_bot]
			for spot in arr[row]
				if !(added[spot]?)
					added[spot] = true
					display_children[display_children.length] = children[spot]

		
		return display_children

	updateGrid: (oldProps,newProps)->
		if oldProps.children.length != newProps.children.length
			@state.display_children = @offsetChildren(@setChildren(newProps.children))

		if oldProps.append_children.length != newProps.append_children.length
			@state.display_children = @offsetChildren(@appendChildren(newProps.children))






	onScroll: ()=>
		@state.display_children = @offsetChildren(@props.children)
		if @state.offset_update
			@forceUpdate()

	componentDidMount: ()->
		@state.display_children = @offsetChildren(@setChildren(@props.children))
		@render()

		@_outer.addEventListener 'scroll',@onScroll

	updateScroll: ()->
		@_outer.scrollTop = @state.row_scroll_top * @getDim()


	componentWillUpdate: ()->
		if @_inner.clientWidth != @state.inner_width
			console.log 'WILL UPDATE'
			@updateScroll()
			@state.display_children = @offsetChildren(@props.children)
			@state.inner_width = @_inner.clientWidth




		
	render: ()=>
		# console.log @state.display_children

		for c,i in @state.display_children
			c?.attributes.r = @state.child_props[c.attributes.index].r
			c?.attributes.c = @state.child_props[c.attributes.index].c
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
			className: "-i-grid #{@props.native_scroll && '-i-grid-scroll'||''} #{@props.oclass || ''}"
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
	append_children: []
	children: []
	pre_children: []
	post_children: []
	offset_height_factor: 2
	w: 4

export {GridItem,Grid}
# module.exports = {Grid,GridItem} 
