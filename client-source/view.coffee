{h,Component} = require 'preact'

Slide = require 'intui/Slide.coffee'
Overlay = require 'intui/Overlay.coffee'
Button = require 'intui/extras/Button.coffee'
InputFile = require 'intui/InputFile.coffee'
InputText = require 'intui/InputText.coffee'
InputTextArea = require 'intui/InputTextArea.coffee'
Modal = require 'intui/Modal.coffee'
{Grid,GridItem} = require 'intui/Grid.coffee'


SlideButton = require 'intui/extras/SlideButton.coffee'

monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]
Viewer = require './lib/Viewer.coffee'


cn = require 'classnames'



sortUsers = (users)->
	# gstate = store.state
	return users.sort (a,b)->
		if a.attributes._id == store.state.user._id
			return false
		else if b.attributes._id == store.state.user._id
			return true

doneColor = (count,total)->
	f = (255-Math.floor(count/total*150))
	return 'rgb('+255+','+f+','+f+')'

doneText = (count,total)->
	if !count && !total
		return null
	h 'div',
		style: {}
		h 'span',
			style: 
				color: doneColor(count,total)
			count
		h 'span',
			style:
				opacity: 0.5
			'/'
		h 'span',
			style:
				color: doneColor(total,total)
			total

	

connectToStores = require './lib/connectToStores'



class editTodoForm extends Component
	constructor: (props)->
		super(props)


		val = props.view.edit_todo.name
		if props.view.edit_todo_sub
			val = props.view.edit_todo_sub.name

		# edit_todo = props.view.edit_todo_sub && props.view.edit_todo_sub || props.view.edit_todo

		@state=
			todo_id: props.view.edit_todo._id
			sub_todo_id: props.view.edit_todo_sub && props.view.edit_todo_sub._id
			initial_name: val
			name: val

	componentDidMount: ->
		@_input.focus()
	
	save: (e)=>
		actions.editTodo store.state.group._id,@props.view.edit_todo,@state
		e.preventDefault()
		e.stopPropagation()
		return false
	
	render: (props)=>
		edit_todo = props.view.edit_todo_sub && props.view.edit_todo_sub || props.view.edit_todo
		h 'form',
			onSubmit: @save
			className: 'form'
			h 'div',
				className: 'title'
				'edit todo'
			h InputText,
				onInput: (e)=>
					@setState
						name: e.target.value
				ref: (e)=>
					@_input = e
				type: 'text'
				label: 'name'
				value: @state.name
			h SlideButton,
				outerClassName: 'input-amount-submit full-w'
				reverse: yes
				disabled: @state.name == @state.initial_name
				sClass: @state.name && 'input-amount-submit-s' || 'input-amount-submit-false'
				pClass: 'input-amount-submit-p'
				height: g.dim
				vertical: yes
				# active: @props.view.sub_right == 'actions' && 1 || 0
				onClick: @save
				label: 'save'
			h Button,
				height: g.dim
				width: g.dim
				className: 'error btn'
				onClick: ()=>
					actions.removeTodo store.state.group._id,props.view.edit_todo && props.view.edit_todo._id,props.view.edit_todo_sub && props.view.edit_todo_sub._id
				name: @state.name
				i: 'remove_circle_outline'



class addTodoForm extends Component
	constructor: (props)->
		super(props)
		@state=
			text: null
			group_id: props.group._id
			parent_todo_id: props.view.parent_todo && props.view.parent_todo._id
	componentDidMount: ->
		@_input.focus()
	render: =>
		if @props.view.parent_todo
			parent_label = h 'span',
				className: 'modal-label'
				h 'span',
					className: 'modal-label-pre'
					'parent: '
				@props.view.parent_todo.name

		h 'form',
			onSubmit: (e)=>
				actions.addTodo @state
				e.preventDefault()
				return false
			className: 'form'
			h 'div',
				className: 'title'
				'add todo to '+@props.group.name
			parent_label
			h InputText,
				onInput: (e)=>
					@setState
						text: e.target.value
				ref: (e)=>
					@_input = e
				type: 'text'
				label: 'name'
				value: @state.text
			h SlideButton,
				outerClassName: 'input-amount-submit full-w'
				reverse: yes
				disabled: !@state.text
				sClass: @state.text && 'input-amount-submit-s' || 'input-amount-submit-false'
				pClass: 'input-amount-submit-p'

				height: g.dim
				vertical: yes
				# active: @props.view.sub_right == 'actions' && 1 || 0
				onClick: (e)=>
					actions.addTodo @state
					e.preventDefault()
					return false
				i: 'check'


class ExpandBtn extends Component
	constructor: (props)->
		super(props)
	render: (props)->
		# @props.hover && 0 || @props.done && 0
		h Button,
			i: 'keyboard_arrow_down'
			class: @props.expanded && 'expand-btn expanded' || 'expand-btn'
			onMouseEnter: @props.onMouseEnter
			onMouseLeave: @props.onMouseLeave
			vertical: no
			dim: g.dim
			onClick: (e)=>
				props.onClick && props.onClick()
				e.preventDefault()
				e.stopPropagation()
				return false
			i: 'keyboard_arrow_down'


class Check extends Component
	constructor: (props)->
		super(props)
		@state = 
			hover: no

	render: (props)->
		h Button,
			onMouseEnter: (e)=>
				@setState
					hover: yes
				if @props.onMouseEnter then @props.onMouseEnter(e)
			onMouseLeave: (e)=>
				@setState
					hover: no
				if @props.onMouseLeave then @props.onMouseLeave(e)
			className: cn 'btn', 'check-btn', @props.done && 'check-btn-done'
			width: g.dim*2
			vertical: no
			onClick: (e)=>
				
				props.onClick()
				e.preventDefault()
				e.stopPropagation()
				return false
			i: 'check'


class User extends Component
	render: (props)->
		
		if props.selected
			selected = h 'div',
				className: 'profile-mini-selected'
				h 'i',className:'material-icons','check'
		# state = store.getState()
		
		if store.state.user.id == props.id
			label = h 'div',
				className: 'profile-self-label'
		if !@props.thumb
			icon = h 'i',
				className: 'material-icons'
				'person'
		h 'div',
			onClick: @props.onClick
			className: 'profile-mini center'
			h 'div',
				style:
					backgroundImage: 'url('+@props.thumb+')'
					transform: ''
				className: 'avatar center'
				selected
				icon
				# label

			!@props.hide_name && h 'div',
				className: 'profile-name'
				@props.name || 'Anon'
			
			# h 'div',
			# 	className: 'name'
			# 	@props.name


class Todo extends Component
	constructor: (props)->
		super(props)
		@state = 
			hover: no
			hover_sub: []
			hover_opt: no
			hover_sub_opt: []
			hover_sub_opt_left: []
			expanded: yes

	subTodos: ()->
		if !@props.todos
			return
		view = store.state.view
		t_switch_d = null
		t_switch_d2 = null
	
		@props.todos.map (todo,i)=>
			h Todo,todo

	render: (props)->
		date = 	h 'div',
			className: cn 'sub created_at', !@state.hover && 'opaque'
			if @props.completed_at then 'Completed ' + @props.completed_at.toDateString() else 'Created '+@props.created_at.toDateString() 
		
		if props.completed_at
			photo_count = props.pins.length
		else
			photo_count = props.pins.length


		hide_pin = true


		if @state.hover || @state.hover_opt || (!store.state.view.show_todo_sub && store.state.view.show_todo && store.state.view.show_todo._id == props._id)
			hide_pin = false

		active = false
		if store.state.view.show_todo && store.state.view.show_todo._id == props._id
			active = true
		

		hover_left = @state.hover_opt_left
		if store.state.view.edit_todo && store.state.view.edit_todo._id == props._id
			hover_left = yes



		# SHOW PINS BUTTON
		show_pins_button = h Button,
			width: g.dim*2
			className: cn 'pin-btn',active && 'active-pin',hide_pin && 'hidden-pin-btn'
			onMouseEnter: (e)=>
				@setState
					hover_opt: yes
			onMouseLeave: (e)=>
				@setState
					hover_opt: no
			onClick: (e)=>
				actions.showPins(@props)
				e.preventDefault()
				e.stopPropagation()
				return false
			i: props.completed_at && 'photo_camera' || 'location_on'
			pre: h 'div',
				className: 'photo_count'
				photo_count


		if props.todos.length && @state.expanded
			sub_todos = @subTodos()

		# store_state = store.getState()
		options_left = [
				!@props.sub && h Slide,
					width: g.dim*2
					className: 'pin-btn center btn b1'
					onMouseEnter: ()=> 
						@setState
							hover_opt_left: yes
					onMouseLeave: ()=>
						@setState
							hover_opt_left: no
					onClick: (e)=>
						actions.showAddSubTodo(@props)
						e.preventDefault()
						e.stopPropagation()
					h 'i',{className:'material-icons'},'add'
			,
				h Slide,
					width: g.dim*2
					className: 'pin-btn center btn b1'
					onMouseEnter: ()=> 
						@setState
							hover_opt_left: yes
					onMouseLeave: ()=>
						@setState
							hover_opt_left: no
					onClick: (e)=>
						actions.showTodoEditModal(@props,null)
						e.preventDefault()
						e.stopPropagation()
					h 'i',{className:'material-icons'},'mode_edit'
		]			

		options = h Slide,
				width: g.dim*2
				className: 'pin-btn center btn b1'
				onMouseEnter: ()=>
					@setState
						hover_opt: yes
				onMouseLeave: ()=>
					@setState
						hover_opt: no
				onClick: (e)=>
					actions.showAddPinModal(@props,null)
					e.preventDefault()
					e.stopPropagation()
				h 'i',{className:'material-icons'},'add'


		if !props.todos.length
			check_btn = h Check,
				_intui_slide: yes
				done: !!@props.completed_at
				width: g.dim
				onMouseEnter: (e)=>
					@setState
						hover_opt_left: yes
				onMouseLeave: (e)=>
					@setState
						hover_opt_left: no
				onClick: ()=>
					actions.editTodo store.state.group._id,props,
						completed_at: if @props.completed_at instanceof Date then null else new Date()
		else
			check_btn = h ExpandBtn,
				onClick: ()=>
					@setState
						expanded: !@state.expanded
				onMouseEnter: (e)=>
					@setState
						hover_opt_left: yes
				onMouseLeave: (e)=>
					@setState
						hover_opt_left: no
				hover: @state.hover
				index: @props.index
				_intui_slide: yes
				expanded: @state.expanded






		# TODO NAME AND DATE
		name_date = h Slide,
			key: 'name_date'
			vertical: no
			beta: 100
			onClick: ()=>
				if @props.todos.length
					@setState
						expanded: !@state.expanded
				else if !@props.completed_at
					actions.editTodo store.state.group._id,@props,
						completed_at: if @props.completed_at instanceof Date then null else new Date()
			className: 'name'
			h 'span',null,@props.name
			date






		# if !@state
		if !@state.hover
			options = null
			options_left = null

		# if @state.hover
		
		full_todo = h Slide,
			className: cn 'todo',props.completed_at && 'done' || 'undone' 
			vertical: no
			slide: no
			height: g.dim*2
			check_btn			
			h Slide,
				key: 'todo-main'
				beta: 100
				slide: yes
				pos: if @state.hover_opt then 2 else if hover_left then 0 else 1
				className: cn 'todo todo-main'
				
				#left options
				h Slide,
					width: g.dim*2
					options_left

				# name/date
				name_date
				options
			show_pins_button
		# # else
		# mini_todo = h Slide,
		# 	className: !sub_todos && (cn 'todo-wrap',(@props.i%2 == 0 && 'list-alt' || '') ,props.completed_at && 'done' || 'undone')
		# 	vertical: no
		# 	slide: no
		# 	height: g.dim
		# 	check_btn
		# 	name_date
		# 	show_pins_button
		
		# return full_todo
			

		h Slide,
			onMouseEnter: (e)=>
				@setState
					hover: yes
			onMouseLeave: (e)=>
				@setState
					hover: no
			key: @props._id
			vertical: yes
			className: cn 'todo-wrap',(@props.i%2 == 0 && 'list-alt' || '') ,props.completed_at && 'done' || 'undone',(@props.sub && 'todo-sub-item' || '')
			auto: yes
			full_todo
			sub_todos
			
		

			
			








class Slideshow extends Component
	constructor: (props)->
		super(props)
		@state=
			slide: 0
	render: (props,state)->
		h Overlay,
			strokeStyle: g.light
			show: props.show
			onClick: ()->
				actions.hideSlideshow()
			h Slide,
				pos: state.pos
				slide: yes


class addPinForm extends Component
	constructor: (props)->
		super(props)
		if props.view.edit_todo_sub
			is_event = !!props.view.edit_todo_sub.completed_at
		else
			is_event = !!props.view.edit_todo.completed_at

		@state=
			files: null
			name: null
			text: null
			link: null
			type: 'photo'
			is_event: is_event

	btn: (type,r)->
		h SlideButton,
			className: 'pin-type-button'
			# reverse: yes
			disabled: @props.is_event
			sClass: ''
			pClass: 'b0'
			active: @state.type == type
			width: g.dim
			vertical: yes
			reverse: no
			onClick: ()=>
				@setState
					type: type
			i: type

	submit: ()=>
		f = new FormData()
		if @state.type == 'photo'
			f.append 'name',@state.name
			f.append 'file',@state.files[0]
		else if @state.type == 'link'
			f.append 'link', @state.link
		else if @state.type == 'text'
			f.append 'text',@state.text
		
		f.append 'type',@state.type
		actions.addPin(store.state.group._id,@props.view.edit_todo,f,@state)


	componentWillMount: ()->
	
		
		if @props.view.edit_todo_sub
			is_event = !!@props.view.edit_todo_sub.completed_at
		else
			is_event = !!@props.view.edit_todo.completed_at
		
		@setState
			files: null
			name: null
			text: null
			link: null
			type: 'photo'
			is_event: is_event
		
		# @state.is_event = is_event
	componentDidMount: ()->
		@forceUpdate()


	render: (props,state)=>

		if @state.type == 'photo'
			title = 'pin photo'
			ctx = h 'div',
				className: 'pin-ctx'
				h InputText,
					onInput: (e)=>
						@setState
							name: e.target.value
					ref: (e)=>
						@_caption = e
					type: 'text'
					label: 'caption'
					value: @state.name
				h InputFile,
					onInput: (e)=>
						@setState
							files: e.target.files
					ref: (e)=>
						@_file = e
					label: 'picture'
					value: null
			check_submit = (@state.files && true || false)
			

		else if @state.type == 'link'
			title = 'pin a link'
			ctx = h 'div',
				className: 'pin-ctx'
				h InputText,
					onInput: (e)=>
						@setState
							link: e.target.value
					ref: (e)=>
						@_link = e
					
					type: 'text'
					label: 'link'
					value: @state.link
			check_submit =  @state.link &&  true || false
			

		else if @state.type == 'textsms'
			title = 'pin text'
			ctx = h 'div',
				className: 'pin-ctx'
				h InputTextArea,
					onInput: (e)=>
						@setState
							text: e.target.value
					ref: (e)=>
						@_text = e
					value: @state.text
					type: 'text'
					label: 'a short text'
					# value: @state.text
			check_submit = @state.text && true || false
		
		


		h 'form',
			onSubmit: (e)=>
				actions.addListItem @state
				e.preventDefault()
				return false
			className: 'form pin-form'

			# h 'span',
			# 	className: 'modal-label'
			# 	h 'span',
			# 		className: 'modal-label-pre'
			# 		'pin to: '
			# 	props.view.edit_todo.name
			h Slide,
				# center: yes
				vertical: no
				height: g.dim
				@btn('photo',yes)
				@btn('link',no)
				@btn('textsms',yes)
			ctx
			h SlideButton,
				outerClassName: 'input-amount-submit full-w'
				reverse: yes
				disabled: !check_submit
				sClass: 'b0'
				pClass: 'b3'

				height: g.dim
				vertical: yes
				onClick: @submit
				label:'create'




class SlideShow extends Component
	constructor: (props)->
		super(props)
		@state=
			pos: 0
	render: (props,state)=>
		h Viewer,
			img: props.view.slideshow_pin.img
			onClick: ()->
				actions.hideModal()
		# h 'div',
		# 	className: 'slideshow center' 
		# 	h 'img',
		# 		src: props.slideshow_pin.img


class ListItemView extends Component
	constructor: (props)->
		super(props)
		@state=
			filter_checked: no
			filter_dates: no
			sort: no

	sort: ()=>
		@setState
			sort: !@state.sort
	filterDates: ()=>
		@setState
			sort: !@state.filter_dates
			filter_dates: !@state.filter_dates
	filterTodos: ()=>
		@setState
			filter_checked: !@state.filter_checked

	showGroupPins: ()->
		actions.showPins(null,null)
	render: (props,state)=>

		todo_items = props.group.state.todos.map (todo,i)->
			todo.index = i
			todo.key = todo._id
			todo.hover = store.state.view.hoverTodo_id == todo._id
			h Todo,todo

		if @state.sort
			# @state.refresh_sort = false
			todo_items.sort (a,b)->
				a = a.attributes
				b = b.attributes
				if !a.completed_at && b.completed_at
					return -1
				if !b.completed_at && a.completed_at
					return 1
				if a.completed_at && b.completed_at
					if a.completed_at < b.completed_at
						return 1
					else
						return -1
				else return a.created_at - b.created_at





		if @state.filter_checked
			todo_items = todo_items.filter (todo)->
				!(todo.attributes.completed_at instanceof Date)

		for todo,i in todo_items
			todo.attributes.i = i

		
		if @state.filter_dates
			l = todo_items.length
			l_m = null
			l_y = null
			l_t = null
			for i in [0...l]
				todo = todo_items[i].attributes
				if todo.completed_at
					date = todo.completed_at
				else
					date = todo.created_at

				m = date.getMonth()
				y = date.getFullYear()
				t = !!todo.completed_at
			
				if l_m != m || l_y != y || l_t != t
					l_m = m
					l_y = y
					l_t = t
					
					d = h Slide,
						height: g.dim
						className: cn 'todo-date',todo.completed_at && 'done',((todo.i)%2 == 0 && 'list-alt' || '')
						h 'span',{},(todo.completed_at && 'completed ' || 'created ') + monthNames[m]+' '+y
					todo_items.splice(i,0,d)
					i++

			

				



		

		count = 0
		for pin in props.group.state.todos
			count += pin.pins.length

		


		options = [
			h SlideButton,
				onClick: actions.addTodo
				className: 'btn'
				pClass: 'b3'
				width: g.dim
				vertical: yes
				reverse: no
				i: 'date_range'
				active: @state.filter_dates
				onClick: @filterDates
			h SlideButton,
				onClick: @filterTodos
				className: 'btn'
				sClass: ''
				pClass: 'b3'
				width: g.dim
				vertical: yes
				reverse: no
				i: 'playlist_add_check'
				active: @state.filter_checked
			h SlideButton,
				onClick: @sort
				active: @state.sort
				className: 'btn'
				sClass: ''
				pClass: 'b3'
				width: g.dim
				vertical: yes
				reverse: no
				i: 'sort'
		]

		h Slide,
			className: 'list'
			vertical: yes 
			h Slide,
				# center: yes
				height: g.dim
				# vertical: no
				options
				h SlideButton,
					onClick: @showGroupPins
					class: 'show-listitem-pins'
					sClass: ''
					pClass: 'b3'
					width: g.dim
					vertical: yes
					reverse: no
					i: 'photo_camera'
					active: props.view.side_view == 'pins' && !props.view.show_todo
					pre: h 'div',
						className: 'photo_count'
						count


			h Slide,
				auto: yes
				vertical: yes 
				className: 'list-content'
				todo_items
				h Button,
					onClick: ()->
						actions.setModal('addTodo')
					className: 'add-btn'
					width: g.dim*2
					height: g.dim*2
					i: 'add'
				# h SlideButton,
				# 	height: g.dim*2
				# 	width: g.dim*2
				# 	className: 'btn list-alt'
				# 	sClass: ''
				# 	pClass: 'b3'
				# 	# width: g.dim * 2
				# 	vertical: yes
				# 	reverse: yes
				# 	i: 'add'
				# 	active: props.view.modal_content == 'addTodo' || false
				# 	onClick: ()=>
						


class Pin extends Component
	render: (props)->
		if props.name
			name = h 'div',
				className: 'pin-title'
				props.name

		pin_icon = h 'i',
			className: 'material-icons pin_icon'
			if props.is_event then 'photo_camera' else 'location_on' 
		if props.type == 'photo'
			pin = h 'div',
				onClick: ()=>
					props.onClick()
				className: 'pin pin-img'
				style:
					backgroundImage: 'url('+(props.thumb || props.img)+')'
				name
				pin_icon
		else if props.type == 'textsms'		
			pin = h 'div',
				className: 'pin pin-textsms'
				props.text
				pin_icon
		else if props.type == 'link'
			pin = h 'div',
				onClick: (e)=>
					document.location.href = props.link
				className: 'pin pin-link center'
				h 'img',
					src: props.link_icon_img
				pin_icon

		return h 'div',
			className: 'pin-wrap center'
			pin




class PinsView extends Component
	constructor: (props)->
		super(props)
		@state = 
			filter: null

	
	componentWillUpdate: (props,state)->
		if state.filter != @state.filter
			state.reset_grid = true	


	render: (props,state)->
		pins = []
		if !props.group
			return
		
		list_key = @state.filter || 'all-' 
		# decide which pins to display
		if props.view.show_todo_sub
			pins = pins.concat props.view.show_todo_sub.pins
			list_key += props.view.show_todo_sub._id
		else if props.view.show_todo
			pins = pins.concat props.view.show_todo.pins
			list_key += props.view.show_todo._id
		else
			for todo in props.group.state.todos
				pins = pins.concat todo.pins





		# filter plan / event pins
		if @state.filter == 'plan'
			pins = pins.filter (pin)->
				!pin.is_event
		else if @state.filter == 'event'
			pins = pins.filter (pin)->
				pin.is_event
		

		pins = pins.map (pin,i)=>
			if !pin
				return null
			pin.onClick = ()->
				actions.showSlides
					pins: pins
					pin: pin
			h GridItem,
				w: pin.w
				h: pin.h
				key: pin.id
				i:i
				h Pin,pin

		h Grid,
			w: 2
			oclass: 'pins'
			auto: true
			iclass: 'grid-inner'
			list_key: list_key
			pre_children: h Slide,
				vertical: no
				height: g.dim
				class: 'pins-options'
				h SlideButton,
					onClick: actions.addTodo
					className: 'btn pins-option'
					sClass: ''
					pClass: 'b1'
					width: g.dim
					vertical: no
					reverse: no
					i: 'location_on'
					active: @state.filter == 'plan'
					onClick: ()=>
						@setState
							filter: if @state.filter == 'plan' then null else 'plan' 
				h SlideButton,
					onClick: actions.addTodo
					className: 'btn pins-option'
					sClass: ''
					pClass: 'b1'
					width: g.dim
					vertical: no
					reverse: yes
					i: 'photo_camera'
					active:  @state.filter == 'event'
					onClick: ()=>
						@setState
							filter: if @state.filter == 'event' then null else 'event' 
			pins



class UserLoginView extends Component
	login: ()=>
		actions.login @state
	constructor: (props)->
		super(props)
		@state=
			email: null
			pass: null
	render: ()=>
		h Slide,
			vertical: yes
			auto: yes
			onEnter: @login
			h InputText,
				height: g.dim
				disabled: @props.disabled
				onInput: (e)=>
					@setState
						email: e.target.value
				type: 'text'
				name: 'email'
				label: 'username'
				value: @state.email
			h InputText,
				height: g.dim
				disabled: @props.disabled
				onInput: (e)=>
					@setState
						pass: e.target.value
				type: 'password'
				autoComplete: 'new-password'
				name: 'pass'
				label: 'pass'
				value: @state.pass
			h Slide,
				height: g.dim
			h SlideButton,
				onClick: @login
				className: 'btn'
				sClass: 'b0'
				pClass: 'b3'
				height: g.dim
				vertical: no
				vertical: yes
				reverse: yes
				label: 'login'
				disabled: !@state.email || !@state.pass
					
			



class UserSignupView extends Component
	signup: ()=>
		actions.signup @state
	constructor: (props)->
		super(props)
		@state=
			email: null
			pass: null
			pass_confirm: null
	render: ()=>
		h Slide,
			vertical: yes
			auto: yes
		
			h InputText,
				height: g.dim
				onInput: (e)=>
					@setState
						email: e.target.value
				type: 'text'
				name: 'email'
				disabled: @props.disabled
				label: 'email'
				value: @state.email
			
			h InputText,
				height: g.dim
				onInput: (e)=>
					@setState
						pass: e.target.value
				type: 'password'
				disabled: @props.disabled
				autoComplete: 'new-password'
				name: 'password'
				label: 'password'
				value: @state.pass
			
			h InputText,
				height: g.dim
				onInput: (e)=>
					@setState
						pass_confirm: e.target.value
				type: 'password'
				autoComplete: 'new-password'
				name: 'confirm pass'
				disabled: @props.disabled
				label: 'confirm pass'
				value: @state.pass_confirm
			h SlideButton,
				onClick: @signup
				className: 'btn'
				sClass: 'b0'
				pClass: 'b3'
				height: g.dim
				vertical: yes
				reverse: yes
				label: 'signup'
				disabled: !@state.email || !@state.pass || !@state.pass_confirm



class UserAuthView extends Component
	constructor: (props)->
		super(props)
		@state=
			show_signup: no
			pass: null
	render: (props,state)=>
		if @state.show_signup
			pos = 1
		else
			pos = 0
		
		h Slide,
			vertical: yes
			auto: yes
			h Slide,
				height: g.dim*4
				slide: yes
				pos: pos
				vertical: no
				h UserLoginView, Object.assign 
					disabled:@state.show_signup
					_intui_slide: yes
					props
				h UserSignupView, Object.assign
					disabled:!@state.show_signup
					_intui_slide: yes
					props
			h Slide,
				height: g.dim
				slide: yes
				vertical: yes
				onClick: ()=>
					@setState
						show_signup: !@state.show_signup
				pos: if @state.show_signup then 1 else 0 
				h Slide,
					className: 'btn'
					center: yes
					'signup'
				h Slide,
					className: 'btn'
					center: yes
					'login'





class HomeView extends Component
	constructor: (props)->
		super(props)
		
	render: (props,state)=>
		h Slide,
			center: yes
			beta: 100
			vertical: yes
			h Slide,
				vertical: yes
				auto: yes
				width: g.dim*6
				h Slide,
					height: g.dim*2
					center: yes
					className: 'home-title'
					'checki'
				h Slide,
					height: g.dim
					center: yes
					className: 'home-desc'
					'login or signup'
				h UserAuthView, props					






class LinkGroup extends Component
	componentWillMount: ->
		actions.generateGroupLink(@props.group._id)

	copy: =>
		copyToClipboard(@props.view.group_invite_link.link)
		@setState
			copied: yes
	render: =>
		# if !@props.view.group_invite_link
		# 	return h Slide,
		# 		className: 'modal-link'
		# 		height: g.dim*2
		# 		vertical: yes
		# 		center: yes
		# 		'fetching new link...'
		
		h Slide,
			height: g.dim*2
			className: 'modal-link'
			center: yes
			vertical: yes
			h 'span',
				className: 'modal-label'
				h 'span',
					className: 'modal-label-pre'
					@props.group.name
			h 'div',
				className: 'title'
				!@props.view.group_invite_link && 'fetching new link...' || 'group invite link'
			h Slide,
				height: g.dim
				vertical: no
				h Slide,
					className: 'b0 invite-link select'
					h 'span',className:'select',@props.view.group_invite_link?.link
				h SlideButton,
					slide_duration: 0.1
					vertical: no
					reverse: yes
					width: g.dim
					pClass: 'b3'
					active: @state.copied
					# sClass: 'b0'
					i: 'content_paste'
					onClick: @copy

class ModalView extends Component
	render: (props,state)=>
		ctn = props.view.modal_content
		modal_color =  '#232E34'
		if props.modal_content == 'slideshow'
			modal_color = '#000'

		modal_content = null
		
		if props.view.show_modal
			

			switch ctn
				when 'addTodo' then modal_content = h addTodoForm,props
				when 'addPin' then modal_content = h addPinForm,props
				when 'editTodo' then modal_content = h editTodoForm,props
				when 'slideshow' then modal = h SlideShow,props
				when 'newGroup' then modal_content = h CreateGroupForm,props
				when 'addFriend' then modal_content = h AddFriendView,props
				when 'editGroup' then modal_content = h EditGroupForm,props
				when 'userSettings' then modal_content = h UserSettings,props
				when 'linkGroup' then modal_content = h LinkGroup,props



		show = !!@props.view.show_modal

		if props.user && !props.user.name
			show = true
			modal_content = h UserSettings,props
		



		if ctn != 'slideshow'
			modal = h Modal,
				className: 'modal'
				backColor: modal_color
				show: show
				mouse: g.mouse
				onClick: ()=>
					if @props.user && @props.user.name
						actions.hideModal()
				modal_content
			main_view = null

		return modal


class GroupView extends Component
	render: (props,state)=>




		main = h ListItemView,props
		users = sortUsers props.group.users.map (user)->
			h User, Object.assign {dim:g.dim},user


		if props.view.side_view == 'pins'
			side_view = h PinsView, props


		side = h Slide,
			beta: if g.mobile then 100 else (if props.view.main_view == 'lists' then 0 else 30)
			width: if g.mobile then undefined else 400
			offset: if g.mobile then -80 else 0
			side_view


		main_view = h Slide,
			className: props.view.modal_content == 'slideshow' && 'hidden2' || ''
			beta: 100
			slide: if g.mobile then yes else no
			vertical: no
			pos: props.view.side_view == 'pins' && 1 || 0
			h Slide,
				beta: 100
				scroll: yes
				main
				# overlay
			side


		h Slide,
			className:'view-main'
			duration: g.slide_duration
			vertical: yes
			main_view





stat = (label,val)->
	h Slide,
		className: 'stat'
		center: yes
		auto: yes
		h 'span',
			className: 'stat-label'
			label+': '
		h 'span',
			className: 'stat-val'
			val



class UserViewGroupItem extends Component
	render: (props,state)->
		participants = 

		gstate = store.getState()

		h Slide,
			onClick: (e)->
				actions.showGroup(props._id)
				e.preventDefault()
				e.stopPropagation()
				return false
			vertical: yes
			center: yes
			className: 'list-item'
			h Slide,
				height: g.dim/2
				center: yes
				className: 'list-count'
				doneText(props.done_count,props.total_count)
			h Slide,
				height: g.dim/2
				center: yes
				className: 'list-name'
				h 'span',null,props.name
			h Slide,
				className: 'list-participants'
				height: g.dim/2
				center: yes
				stat('members',props.users.length)



class EditGroupForm extends Component
	constructor: (props)->
		super(props)
		@state=
			name: props.group.name
			remove_users: []

	componentDidMount: ->
		@_input?.focus()

	save: (e)=>
		actions.editGroup(@state,@props.group._id)
		e.preventDefault()
		e.stopPropagation()
		return false

	leave: (e)=>
		actions.leaveGroup(@props.group._id)
		e.preventDefault()
		e.stopPropagation()
		return false		

	render: (props)=>


		if @props.group.owner != @props.user._id
			return h Button,
				width: g.dim*5
				height: g.dim
				class: 'b0'
				label: 'leave group'
				onClick: @leave



		users = @props.group.users.map (u,i)=>
			h GridItem,
				w: 1
				h: 1
				key: u._id
				class: 'center'
				i:i
				[
					h User,u
					h 'div',
						onClick: ((i)=>
							r_i = @state.remove_users.indexOf(u._id)
							if r_i < 0
								@state.remove_users.push(u._id)
							else
								@state.remove_users.splice r_i,1

							@setState()

						).bind(this,i)
						className: cn(@state.remove_users.indexOf(u._id) < 0 && 'hidden' || '','user-overlay-delete')
						h 'i',
							className: 'material-icons user-overlay-delete-icon'
							'remove_circle_outline'
				]

	
		h 'form',
			onSubmit: @save
			className: 'form'
			h 'div',
				className: 'title'
				'edit group'
			h InputText,
				onInput: (e)=>
					@setState
						name: e.target.value
				ref: (e)=>
					@_input = e
				type: 'text'
				label: 'name'
				value: @state.name
			h Slide,
				className: 'title'
				height: 30
				'group users:'
			h Slide,
				height: g.dim*6
				h Grid,
					w: 4
					users
			h SlideButton,
				outerClassName: 'input-amount-submit full-w'
				reverse: yes
				disabled: !@state.name
				sClass: @state.name && 'input-amount-submit-s' || 'input-amount-submit-false'
				pClass: 'input-amount-submit-p'
				height: g.dim
				vertical: yes
				onClick: @save
				label: 'save'
			h Button,
				height: g.dim
				class: 'b0'
				label: 'leave group'
				onClick: @leave
		


class CreateGroupForm extends Component
	constructor: (props)->
		super(props)
		@state=
			name: props.name

	componentDidMount: ->
		@_input.focus()

	save: (e)=>
		actions.createGroup(@state)
		e.preventDefault()
		e.stopPropagation()
		return false

	render: (props)=>		
		h 'form',
			onSubmit: @save
			className: 'form'
			h 'div',
				className: 'title'
				'create group'
			h InputText,
				onInput: (e)=>
					@setState
						name: e.target.value
				ref: (e)=>
					@_input = e
				type: 'text'
				label: 'name'
				value: @state.name
			h SlideButton,
				outerClassName: 'input-amount-submit full-w'
				reverse: yes
				disabled: !@state.name
				sClass: @state.name && 'input-amount-submit-s' || 'input-amount-submit-false'
				pClass: 'input-amount-submit-p'
				height: g.dim
				vertical: yes
				onClick: @save
				label: 'create'
		




class Menu extends Component

	constructor: (props)->
		super(props)
		
	goHome: ()=>
		actions.goUserHome()



	opt: (icon,onClick,active,hover,w)->
		h SlideButton,
			# className: 'btn'
			sClass: ''
			pClass: 'b3'
			width: g.dim * (w || 1)
			vertical: yes
			hover: hover
			reverse: no
			# active_index_offset: 5
			index_offset: 5
			i: icon
			active: active
			onClick: onClick


	render: (props,state)=>

		more_btn_right = h Button,
			className: cn 'btn btn-rotate',@props.show_more_right && 'btn-rotate-90'
			i: 'more_horiz'
			# active: @state.show_more
			disabled: !props.state.user
			width: g.dim
			onClick: ()=>
				actions.setView
					show_more_right: true

		if props.state.user
			user_icon = h Slide,
				width: g.dim
				center: yes
				h 'div',
					onClick: ->
						actions.setModal('userSettings')
					className: 'avatar'
					style:
						cursor: 'pointer'
						width: '60%'
						height: '60%'
						'background-position': 'center'
						'background-size': 'cover'
						borderRadius: '50%'
						backgroundImage: 'url('+props.state.user.thumb+')'
						transform: ''
		
	

		left_options = props.left_options.map (opt)=>
			if !opt.icon
				return opt
			else
				return @opt(opt.icon,opt.action,opt.active,opt.hover,opt.w)


		h Slide,
			className: 'main-menu b0'
			height: g.dim
			beta: 100
			vertical: no	
			h Slide,
				beta: 100
				@opt('home',@goHome,props.state.view.main_view == 'user' || props.state.view.main_view == 'home')
				left_options
				props.left_children
			h Slide,
				reverse: yes
				more_btn_right
				user_icon
				



class AddFriendView extends Component
	constructor: (props)->
		super(props)
		@state=
			selected: []
			search: null
	search: ()->
		alert 'search'

	componentDidMount: ->
		@_input.focus()	

	render: (props,state)=>
		results = props.view.search_users.map (u)->
			u.key = u._id
			u.onClick = ((u)->
				actions.addFriend(u)
			).bind(@,u)
			h User,u


		h Slide,
			vertical: yes
			className: 'add-friend-view'
			h 'div',
				className: 'title'
				'add friend'
			h Slide,
				className: 'pad-5-5'
				center: yes
				vertical: no
				height: g.dim
				h InputText,
					ref: (e)=>
						@_input = e
					onInput: (e)=>
						@setState
							search: e.target.value
						actions.searchUsers(@state.search)
					placeholder: 'search'
					value: @state.search
				h SlideButton,
					vertical: no
					reverse: yes
					width: g.dim
					height: g.dim
					pClass: 'b3'
					# sClass: 'b0'
					i: 'search'
					onClick: @search
			h Slide,
				className: 'search-results'
				results




class UserView extends Component

	constructor: (props)->
		super(props)
		@state=
			add_friend: no

	title: (title)->
		h Slide,
			className: 'title pad-0-0'
			height: 30
			title
	makeGroups: (props)=>
		group_items = @props.user.groups.map (g,i)->
			h GridItem,
				i:i, w: 2,h: 1,key: g._id,
					h UserViewGroupItem,g
		group_items.push h GridItem,
			w: 1
			h: 1
			key: 'add'
			i: group_items.length
			h Button,
				onClick: ()->
					actions.setModal('newGroup')
				className: 'add-btn'
				i: 'playlist_add'

		return group_items

	# componentWillRecieveProps: (props)->
	# 	if @props.user.groups.length != props.user.groups.length
	# 		@makeGroups(props)
	
	# componentWillMount: ()->
	# 	@makeGroups(@props)



	render: (props,state)=>
		user = props.user

		group_items = 
		


		friend_items = props.user.friends.map (u,i)->
			h GridItem,
				i:i,w: 1,h: 1,key: u._id,
					h User,u

		friend_items.push h GridItem,
			i: friend_items.length
			w: 1
			h: 1
			key: 'add'
			h Button,
				onClick: ()->
					actions.setModal('addFriend')
				className: 'add-btn'
				i: 'person_add'


		h Slide,
			vertical: yes
			scroll: yes
			className: 'pad-50-50'
			# h Slide,
			# 	className: 'pad-0-20'
			# 	height: g.dim
			# 	stat('email',user.email)

			@title 'my groups:'
		
			h Grid,
				w: 8
				fixed: yes
				max_reached: true
				@makeGroups()

			@title 'my friends:'


				
			
			h Grid,
				show_loader: no
				w: 8
				fixed: yes
				max_reached: true
				friend_items


MAX_NAME_LENGTH = 12
class UserSettings extends Component
	constructor: (props)->
		super(props)
		if props.user
			@state = 
				ok: no
				name: props.user.name
				email: props.user.email
				img: props.user.img
		else
			@state =
				name: ''


	componentDidMount: ->
		@_input.focus()	


	setPicture: (e)=>
		file = e.target.files[0]
		url = URL.createObjectURL(file)
		@setState
			file: file
			img: url
			ok: true
		# img.onload = ()->
		# 	dim = getPinWH(img.width,img.height)
		# 	Object.assign state,dim

	save: =>
		if @state.name.length > MAX_NAME_LENGTH
			actions.showError 'name is too long max:'+MAX_NAME_LENGTH
		actions.setUser
			name: @state.name
			file: @state.file


	render: =>
	
		user = h User,
			thumb: @state.img
			name: @state.name

	
		h Slide,
			className: 'modal-link'
			auto: yes
			vertical: yes
			onEnter: @save
			h InputText,
				onInput: (e)=>
					@setState
						ok: e.target.value && yes
						name: e.target.value
				ref: (e)=>
					@_input = e
				type: 'text'
				label: 'name'
				height: g.dim
				value: @state.name
			h InputFile,
				height: g.dim
				onInput: @setPicture
				label: 'picture'
				value: null
			h Slide,
				height: g.dim*3
				width: g.dim*3
				style:
					'align-self':'center'
				center: yes
				vertical: yes
				user
			h SlideButton,
				outerClassName: 'input-amount-submit full-w'
				reverse: no
				disabled: !@state.ok
				# disabled: !@state.name || @state.name == @props.user.name || @state.name.length > MAX_NAME_LENGTH || @state.file
				sClass: 'b2'
				pClass: 'b3'
				height: g.dim
				vertical: no
				onClick: @save
				label: 'save'





class MainView extends Component
	@getStores: ->
		return [store]
	
	@getPropsFromStores: ->
		return store.getState()
	constructor: (props)->
		super(props)


	logout: ()=>	
		@setState
			show_more: no
		actions.logout()
	componentDidMount: ()->
		window.addEventListener 'resize',()=>
			@forceUpdate()

	opt: (icon,onClick,label)->
		# h Slide,
		# 	dim: g.dim
		# 	vertical: no
		h SlideButton,
			# className: 'btn'
			sClass: 'home-more-btn'
			pClass: 'b3 home-more-btn'
			vertical: no
			dim: g.dim
			# hover: hover
			reverse: yes
			# active_index_offset: 5
			index_offset: 5
			i: icon
			# active: active
			onClick: onClick
			label: label
	
	logout: ()=>
		actions.logout()

	goUserSettings: ()->
		actions.setModal('userSettings')

	render: (props,state)=>
		# return h Slide,{},'asd'

		if props.view.main_view == 'home'
			main_top = h HomeView,props
		else if props.group
			main_top = h GroupView,props
		

		if props.user && props.view.main_view == 'user'
			main_bot = h UserView,props


		if props.view.main_view == 'home'
			main_pos = 0
		else if props.view.main_view == 'user'
			main_pos = 1
		else if props.view.main_view == 'group'
			main_pos = 0






		if props.view.main_view == 'group' && props.group?
			menu = h Menu,
				left_options: [
					h SlideButton,
						className: 'btn'
						sClass: 'blue'
						pClass: 'blue-inv'
						width: g.dim
						vertical: yes
						reverse: no
						i: 'add'
						active: props.view.modal_content == 'addTodo' || false
						onClick: ()=>
							actions.setModal('addTodo')
					h SlideButton,
						onClick: ()=>
							actions.setModal('linkGroup')
						sClass: ''
						pClass: 'b3'
						width: g.dim
						vertical: yes
						reverse: no
						# reverse: yes
						i: 'link'
						active: props.view.modal_content == 'linkGroup'
					h SlideButton,
						onClick: ()=>
							actions.setModal('editGroup')
						sClass: ''
						pClass: 'b3'
						width: g.dim
						vertical: yes
						reverse: no
						# reverse: yes
						i: 'settings'
						active: props.view.modal_content == 'editGroup'
				]
				left_children: [
					h 'span',
						className: 'list-title'
						props.group.name
					h Slide,
						auto: yes
						center: yes
						className: 'list-count'
						doneText(props.group.done_count,props.group.total_count)
				]
				show_more_right: @props.view.show_more_right
				state: props
		
		else if props.view.main_view == 'user'
			menu = h Menu,
				left_options: [
						h SlideButton,
							onClick: ()=>
								actions.setModal('newGroup')
							sClass: 'blue'
							pClass: 'blue-inv'
							width: g.dim
							vertical: yes
							i:'playlist_add'
							active: props.view.modal_content == 'newGroup'
					,
						h SlideButton,
							i: 'person_add'
							sClass: 'blue'
							pClass: 'blue-inv'
							width: g.dim
							vertical: yes
							active: props.view.modal_content == 'addFriend'
							w: 1
							onClick: ()=>
								actions.setModal('addFriend')
				]
				show_more_right: @props.view.show_more_right
				state: props


		h Slide,
			className: 'root-view'
			vertical: yes
			slide: yes
			pos: if props.error then 1 else 0
			h Slide,
				slide: yes
				vertical: no
				pos: @props.view.show_more_right && 1 || 0
				outer_children: [
					h ModalView,props
					h Overlay,
						strokeStyle: g.light
						show: props.error
						dir: 'bottom'
						onClick: ()->
							actions.setState
								error: null
				]

				h Slide,
					beta: 100
					vertical: yes
					outer_children: [
						h Overlay,
							dir: 'right'
							strokeStyle: g.light
							show: props.view.show_more_right
							onClick: ()->
								actions.setView
									show_more_right: no
					]

					menu
					h Slide,
						beta: 100
						slide: yes
						pos: main_pos
						ease_dur: 0.3
						# ease: 'cubic-bezier(0, 0.85, 0.37, 1.01)'
						vertical: yes
						h Slide,
							beta: 100
							main_top
						h Slide,
							beta: 100
							main_bot

				h Slide,
					dim: g.dim*3
					class: 'b0'
					onMouseEnter: ()=>
						actions.setView
							show_more_right: yes
					vertical: yes
					@opt('exit_to_app',@logout,'logout')
					@opt('settings',@goUserSettings,'settings')
				

					
			h Slide,
				className: 'error-bg'
				height: g.dim
				center: yes
				props.error
			
			


	







module.exports = connectToStores(MainView)