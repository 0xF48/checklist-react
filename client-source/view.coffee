{h,Component} = require 'preact'

Slide = require 'intui/Slide.js'
SlideMixin = require 'intui/SlideMixin.js'
Overlay = require 'intui/Overlay.js'
Button = require 'intui/Button.coffee'
SlideButton = require 'intui/SlideButton.coffee'
InputFile = require 'intui/InputFile.coffee'
InputText = require 'intui/InputText.coffee'
InputTextArea = require 'intui/InputTextArea.coffee'
# ProgressBar = require 'intui/ProgressBar.coffee'
Modal = require 'intui/Modal.coffee'
{Grid,GridItem,GridMixin} = require 'intui/TetrisGrid.js'
SquareButton = require 'intui/SquareButton.coffee'
monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]
Viewer = require './lib/Viewer.coffee'


cn = require 'classnames'

isset = (val)->
	if val == null || val == undefined || val == NaN
		return false
	return true

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
	# if !count && !total
	# 	return null
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
		actions.editTodo store.state.group._id,@state.todo_id,@state.sub_todo_id,@state
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
				onChange: (e)=>
					@setState
						name: e.target.value
				ref: (e)=>
					@_input = e
				type: 'text'
				label: 'name'
				value: @state.name
			h SquareButton,
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
				size: g.dim
				className: 'error'
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
				onChange: (e)=>
					@setState
						text: e.target.value
				ref: (e)=>
					@_input = e
				type: 'text'
				label: 'name'
				value: @state.text
			h SquareButton,
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
		h SquareButton,
			className: @props.expanded && 'expand-btn expanded' || 'expand-btn'
			# pClass: @props.expanded && 'check-btn-cancel' 
			width: g.dim
			vertical: no
			offset: 0
			onMouseEnter: @props.onMouseEnter
			onMouseLeave: @props.onMouseLeave
			# hover: hover
			# active: @props.done
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
		# console.log @state.hover
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
			size: g.dim
			vertical: no
			onClick: (e)=>
				# log 'INDEX ',@props.index
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

		h 'div',
			onClick: @props.onClick
			className: 'profile-mini center'
			style:
				transform: ''
				width: props.dim
				height: props.dim
			h 'div',
				style:
					backgroundImage: 'url('+@props.img+')'
					transform: ''
				className: 'avatar'
				selected
			label
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
		view = store.state.view
		t_switch_d = null
		t_switch_d2 = null
		props = @props
		h Slide,
			className: 'todo-sub'
			auto: yes
			vertical: yes
			props.todos.map (todo,i)=>

				hover_sub_left = @state.hover_sub_opt_left[todo.index] || (view.edit_todo && view.edit_todo._id == @props._id and view.edit_todo_sub && view.edit_todo_sub._id == todo._id)

				if todo.completed_at
					d_str = 'Completed '+ todo.completed_at.toDateString()
				else
					d_str = 'Created '+ todo.created_at.toDateString()

				t_date = h 'div',
					className: cn 'sub created_at', !@state.hover_sub[todo.index] && 'opaque' 
					d_str

				todo_options_left = h Slide,
					width: g.dim
					className: cn 'pin-btn center btn b1',props.completed_at && 'completed' || ''
					onClick: (e)=>
						actions.showTodoEditModal(@props,todo)
						e.preventDefault()
						e.stopPropagation()
						return false
					onMouseEnter: ()=>
						# log 'ENTER'
						@state.hover_sub_opt_left[todo.index] = true
						@setState
							hover_sub_opt_left: @state.hover_sub_opt_left
					onMouseLeave: ()=>
						@state.hover_sub_opt_left[todo.index] = false
						@setState
							hover_sub_opt_lef: @state.hover_sub_opt_left
					h 'i',{className:'material-icons'},'mode_edit'
				
			
				todo_options = h Slide,
					width: g.dim
					className: cn 'pin-btn center btn b1',props.completed_at && 'completed' || ''
					onClick: (e)=>
						actions.showAddPinModal(@props,todo)
						# actions.addPin(store.state.group._id,@props._id,todo._id)
						e.preventDefault()
						e.stopPropagation()
					onMouseEnter: ()=>
						# log 'ENTER'
						@state.hover_sub_opt[todo.index] = true
						@setState
							hover_sub_opt: @state.hover_sub_opt
					onMouseLeave: ()=>
						@state.hover_sub_opt[todo.index] = false
						@setState
							hover_sub_opt: @state.hover_sub_opt
					h 'i',{className:'material-icons'},'add'


				active = false
				console.log 
				if store.state.view.show_todo && store.state.view.show_todo._id == props._id
					if store.state.view.show_todo_sub && store.state.view.show_todo_sub._id == todo._id
						active = true
				

				h Slide, 
					key: todo._id
					height: g.dim
					className: cn 'todo todo-sub-item',todo.completed_at && 'done' || 'undone'
					vertical: no
					h Check,
						hover: @state.hover_sub_opt[todo.index] == true
						index: todo.index
						_intui_slide: yes
						done: !!todo.completed_at
						onMouseEnter: (e)=>
							@state.hover_sub_opt_left[todo.index] = true
							@setState
								hover_sub_opt_left: @state.hover_sub_opt_left
						onMouseLeave: (e)=>
							@state.hover_sub_opt_left[todo.index] = false
							@setState
								hover_sub_opt_lef: @state.hover_sub_opt_left
						onClick: ((todo)=>
							actions.editTodo store.state.group._id,props._id,todo._id,
								completed_at: if todo.completed_at instanceof Date then null else new Date()
						).bind(this,todo)

					h Slide,
						slide: yes
						pos: if @state.hover_sub_opt[todo.index] == true then 2 else if hover_sub_left == true then 0 else 1
						todo_options_left								
						h Slide,
							className: 'name'
							onClick: (e)=>
								if todo.completed_at
									return
								actions.editTodo store.state.group._id,props._id,todo._id,
									completed_at: new Date()
							onMouseEnter: (e)=>
								@state.hover_sub[todo.index] = true
								@setState
									hover_sub: @state.hover_sub
							onMouseLeave: (e)=>
								@state.hover_sub[todo.index] = false
								@setState
									hover_sub: @state.hover_sub
							h 'span',null,todo.name
							t_date
						todo_options


							
								
					h Button,
						# className:
						width: g.dim
						className: cn 'pin-btn', !active && (!@state.hover_sub[todo.index] && !@state.hover_sub_opt[todo.index]) && 'hidden-pin-btn',active && 'active'
						onMouseEnter: (e)=>
							@state.hover_sub_opt[todo.index] = true
							@setState
								hover_sub_opt: @state.hover_sub_opt
						onMouseLeave: (e)=>
							@state.hover_sub_opt[todo.index] = false
							@setState
								hover_sub_opt: @state.hover_sub_opt
						onClick: (e)=>
							actions.showPins(@props,todo)
							e.preventDefault()
							e.stopPropagation()
							return false
						i: todo.completed_at && 'photo_camera' || 'location_on'
						pre: h 'div',
							className: 'photo_count'
							todo.pins.length


	render: (props)->
		date = 	h 'div',
			className: cn 'sub created_at', !@state.hover && 'opaque'
			if @props.completed_at then 'Completed ' + @props.completed_at.toDateString() else 'Created '+@props.created_at.toDateString() 
		
		if props.completed_at
			photo_count = props.pins.length
		else
			photo_count = props.pins.length




		if props.todos.length && @state.expanded
			sub_todos = @subTodos()

		# store_state = store.getState()
		options_left = [
				h Slide,
					width: g.dim
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
					width: g.dim
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
				width: g.dim
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
				onMouseEnter: (e)=>
					@setState
						hover_opt_left: yes
				onMouseLeave: (e)=>
					@setState
						hover_opt_left: no
				onClick: ()=>
					actions.editTodo store.state.group._id,props._id,null,
						completed_at: if props.completed_at instanceof Date then null else new Date()
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


		active = false
		if store.state.view.show_todo && store.state.view.show_todo._id == props._id
			if !store.state.view.show_todo_sub
				active = true
		

		hide_pin = true


		if @state.hover || @state.hover_opt || (!store.state.view.show_todo_sub && store.state.view.show_todo && store.state.view.show_todo._id == props._id)
			hide_pin = false

		

		hover_left = @state.hover_opt_left
		if store.state.view.edit_todo && store.state.view.edit_todo._id == props._id
			if !store.state.view.edit_todo_sub
				hover_left = yes




		# TODO NAME AND DATE
		name_date = h Slide,
			vertical: no
			beta: 100
			onClick: ()=>
				if @props.todos.length
					@setState
						expanded: !@state.expanded
				else if !@props.completed_at
					actions.editTodo store.state.group._id,@props._id,null,
						completed_at: if @props.completed_at instanceof Date then null else new Date()
			onMouseEnter: (state)=>
				@setState 
					hover: true
			onMouseLeave: (state)=>
				@setState 
					hover: false
			className: 'name'
			h 'span',null,@props.name
			date



		# SHOW PINS BUTTON
		show_pins_button = h Button,
			className: cn 'pin-btn',active && 'active',hide_pin && 'hidden-pin-btn'
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





		h Slide,
			auto: yes
			vertical: yes
			className: cn 'todo-wrap',(@props.i%2 == 0 && 'list-alt' || '') ,props.completed_at && 'done' || 'undone'
			
			# main todo + options
			h Slide,
				vertical: no
				slide: no
				height: g.dim
				check_btn
				h Slide,
					beta: 100
					slide: yes
					pos: if @state.hover_opt then 2 else if hover_left then 0 else 1
					className: cn 'todo todo-main'
					
					#left options
					h Slide,
						auto: yes
						options_left

					# name/date
					name_date
					options
				show_pins_button

			# sub todos
			sub_todos
			

# class ListItem extends Component
# 	render: (props,state)->
# 		participants = props.participants.map (user)->
# 			h User, Object.assign {dim:g.dim},user

# 		gstate = store.getState()
# 		# log participants
# 		participants = sortUsers(participants)

# 		h Slide,
# 			onClick: (e)->
# 				actions.showList(props.index)
# 				e.preventDefault()
# 				e.stopPropagation()
# 				return false
# 			vertical: yes
# 			center: yes
# 			className: 'list-item'
# 			h Slide,
# 				height: g.dim/2
# 				center: yes
# 				className: 'list-count'
# 				# style: 
# 				# 	color: doneColor(props.done_count,props.total_count)
# 				doneText(props.done_count,props.total_count)
# 			h Slide,
# 				height: g.dim/2
# 				center: yes
# 				className: 'list-name'
# 				h 'span',null,props.name
# 			h Slide,
# 				className: 'list-participants'
# 				height: g.dim
# 				center: yes
# 				participants


# class joinRoomPass extends Component
# 	constructor: (props)->
# 		super(props)
# 		@state =
# 			pass: ''
# 	render: (props,state)->
# 		  h Slide,
# 		  	center: yes
# 		  	h InputText
# 		  		type: 'number'
# 		  		onChange: (e)->
# 		  			@setState
# 		  				pass: e.target.value
# 		  	h SquareButton,
# 				className: ''
# 				reverse: yes
# 				disabled: !@state.pass
# 				sClass: 'b1a'
# 				pClass: 'b3'
# 				width: 150
# 				height: g.dim
# 				vertical: yes
# 				onClick: ()=>
# 					actions.sendState
# 						pass: @state.pass
# 				label:label


# class CreateUserForm extends Component
# 	constructor: (props)->
# 		super(props)
# 		@state=
# 			name: null
# 			picture: null
	
# 	componentDidMount: ->
# 		@_input.focus()

# 	submit: =>
# 		f = new FormData()
# 		f.append 'file', @state.picture
# 		f.append 'name', @state.name
# 		actions.newGroupUser f

# 	render: ->
# 		h 'form',
# 			onSubmit: (e)=>
# 				@submit()
# 				e.preventDefault()
# 				e.stopPropagation()
# 				return false
# 			className: 'form'
# 			h 'div',
# 				className: 'title'
# 				'add user'
# 			h InputText,
# 				onChange: (e)=>
# 					@setState
# 						name: e.target.value
# 				ref: (e)=>
# 					@_input = e
# 				type: 'text'
# 				label: 'name'
# 				placeholder: 'Bob'
# 				value: @state.name
# 			h InputFile,
# 				onChange: (e)=>
# 					@setState
# 						picture: e.target.files[0]
# 				ref: (e)=>
# 					@_file = e
# 				label: 'picture'
# 				value: null
# 			h SquareButton,
# 				outerClassName: 'input-amount-submit full-w'
# 				reverse: yes
# 				disabled: !@state.name
# 				sClass: @state.text && 'input-amount-submit-s' || 'input-amount-submit-false'
# 				pClass: 'input-amount-submit-p'
# 				height: g.dim
# 				vertical: yes
# 				onClick: (e)=>
# 					@submit()
# 					e.preventDefault()
# 					e.stopPropagation()
# 					return false
# 				i: 'check'



# class joinRoomView extends Component
# 	constructor: (props)->
# 		super(props)
# 		@state = 
# 			update: false
# 			selected_index: null
# 	render: (props,stats)->



# 		users = props.group_state.users.map (user,i)=>
# 			user = Object.assign {selected:@state.selected_index == i},user
# 			user.dim = g.dim*2
# 			user.onClick = ()=>
# 				@setState
# 					update: !@state.update
# 					selected_index: i
# 			h User, user

		

# 		if typeof @state.selected_index == 'number'
# 			label = 'im '+props.group_state.users[@state.selected_index].name+' !'
# 		else
# 			label = 'click on a user!'

# 		if !props.group_state.users.length
# 			btn = h SquareButton,
# 				className: 'input-amount-submit full-w'
# 				reverse: yes
# 				# disabled: typeof @state.selected_index != 'number'
# 				sClass: 'b1a'
# 				pClass: 'b3'
# 				width: 150
# 				height: g.dim
# 				vertical: yes
# 				onClick: ()=>
# 					actions.setModal('createUser')
# 				label: 'add user'
# 		else
# 			btn = h SquareButton,
# 				className: 'input-amount-submit full-w'
# 				reverse: yes
# 				disabled: typeof @state.selected_index != 'number'
# 				sClass: 'b1a'
# 				pClass: 'b3'
# 				width: 150
# 				height: g.dim
# 				vertical: yes
# 				onClick: ()=>
# 					actions.setMyUser(@state.selected_index,props.group_state.users[@state.selected_index])
# 				label:label
	
# 		h Slide,
# 			center: yes
# 			className: 'joinRoomView'
# 			vertical: yes
# 			h Slide,
# 				center: yes
# 				height: g.dim
# 				className: 'list-name'
# 				'who are you?'
# 			h Slide,
# 				className: 'room-members'
# 				auto: yes
# 				center: yes
# 				users
# 			btn


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

	btn: (type)->
		h SquareButton,
			className: 'pin-type-button'
			# reverse: yes
			disabled: @props.is_event
			sClass: 'b1'
			pClass: 'b3'
			active: @state.type == type
			width: g.dim
			vertical: yes
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
		actions.addPin(store.state.group._id,@props.view.edit_todo._id,@props.view.edit_todo_sub && @props.view.edit_todo_sub._id,f,@state)
		

	render: (props,state)=>

		if @state.type == 'photo'
			title = 'pin photo'
			ctx = h 'div',
				className: 'pin-ctx'
				h InputText,
					onChange: (e)=>
						@setState
							name: e.target.value
					ref: (e)=>
						@_caption = e
					type: 'text'
					label: 'caption'
					value: @state.name
				h InputFile,
					onChange: (e)=>
						@setState
							files: e.target.files
					ref: (e)=>
						@_file = e
					label: 'picture'
					value: null
			check_submit = @state.name && @state.files && true || false
			# log @state	

		else if @state.type == 'link'
			title = 'pin a link'
			ctx = h 'div',
				className: 'pin-ctx'
				h InputText,
					onChange: (e)=>
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
					onChange: (e)=>
						log 'ON TEXT AREA ',e.target.value
						@setState
							text: e.target.value
					ref: (e)=>
						@_text = e
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

			h 'span',
				className: 'modal-label'
				h 'span',
					className: 'modal-label-pre'
					'pin to: '
				props.view.edit_todo.name
			h 'div',
				className: 'title'
				title
			h Slide,
				# center: yes
				vertical: no
				height: g.dim
				@btn('photo')
				@btn('link')
				@btn('textsms')
			ctx
			h SquareButton,
				outerClassName: 'input-amount-submit full-w'
				reverse: no
				disabled: !check_submit
				sClass: 'b1'
				pClass: 'b3'

				height: g.dim
				vertical: yes
				onClick: @submit
				label:'create'




# class addListItemForm extends Component
# 	constructor: (props)->
# 		super(props)
# 		if props.participants
# 			selected = props.participants.map (user)->
# 				return true
# 		else
# 			selected = [true]
# 		@state=
# 			text: props.name
# 			selected: selected

# 	componentDidMount: ->
# 		@_input.focus()
# 	render: (props,state)->
# 		if props.users
# 			participants = props.users.map (user,i)=>
# 				opt = Object.assign selected: false,user
# 				opt.selected = state.selected[i]
# 				opt.dim = 60
# 				opt.onClick = ()=>
# 					@state.selected[i] = !@state.selected[i]
# 					@setState()
# 				h User, opt
	

# 		participants = sortUsers(participants)


# 		participants.unshift h Button,
# 			className: 'center button-person-add'
# 			i: 'person_add'
# 			size: 60

# 		h 'form',
# 			onSubmit: (e)=>
# 				actions.addListItem @state
# 				e.preventDefault()
# 				return false
# 			className: 'form'
# 			h 'div',
# 				className: 'title'
# 				if props.modal_content == 'listSettings' then 'edit list' else 'create a new list'
# 			h InputText,
# 				onChange: (e)=>
# 					@setState
# 						text: e.target.value
# 				ref: (e)=>
# 					@_input = e
# 				type: 'text'
# 				label: 'list name'
# 				value: @state.text
# 			h Slide,
# 				height: 80
# 				participants
			
# 			h SquareButton,
# 				outerClassName: 'input-amount-submit full-w'
# 				reverse: no
# 				disabled: !@state.text
# 				sClass: 'b1'
# 				pClass: 'b3'

# 				height: g.dim
# 				vertical: yes
# 				onClick: ()=>
# 					actions.addListItem @state
# 				label:if props.modal_content == 'listSettings' then 'save' else 'create'


# class ListItemAdd extends Component
# 	render: (props,state)->
# 		h Slide,
# 			className: 'list-item'
# 			center: yes
# 			onClick: ()->
# 				actions.setModal('addListItem')
# 			h Button,
# 				i: 'add'


# class ListsView extends Component
# 	constructor: (props)->
# 		super(props)
# 	render: (props,state)->
# 		# log props
# 		items = props.group_state.lists.map (list,i)->
# 			list.index = i
# 			h GridItem,
# 				w: 2,h: 1,key: list.id,
# 					h ListItem,list

# 		# log 'render lists view'

# 		h Slide,
# 			vertical:yes
# 			innerClassName: 'lists-inner'
# 			h Grid,
# 				w: 4
# 				className: 'lists-grid'
# 				fixed : false
# 				auto: true
# 				animate: !g.isSafari && true || false
# 				max_grid_height_beta : 2
# 				max_reached: true
# 			,
# 				items
# 			h Slide,
# 				height: g.dim
# 				h Button,
# 					onClick: ()->
# 						actions.setModal('addListItem')
# 					i: 'add_box'


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
			refresh_sort: yes

	refreshSort: ()=>
		@setState
			refresh_sort: yes
	filterDates: ()=>
		@setState
			refresh_sort: yes
			filter_dates: !@state.filter_dates
	filterTodos: ()=>
		@setState
			refresh_sort: yes
			filter_checked: !@state.filter_checked

	showGroupPins: ()->
		actions.showPins(null,null)
	render: (props,state)=>

		todo_items = props.group.state.todos.map (todo,i)->
			todo.index = i
			todo.key = todo._id
			h Todo,todo

		if @state.refresh_sort
			@state.refresh_sort = false
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

		# log todo_items
		if @state.filter_dates
			# console.log todo_items
			l = todo_items.length
			l_m = null
			l_y = null
			l_t = null
			for i in [0...l]
				console.log i
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
			h SquareButton,
				onClick: actions.addTodo
				className: 'btn'
				pClass: 'b3'
				width: g.dim
				vertical: yes
				reverse: no
				i: 'date_range'
				active: @state.filter_dates
				onClick: @filterDates
			h SquareButton,
				onClick: @filterTodos
				className: 'btn'
				sClass: ''
				pClass: 'b3'
				width: g.dim
				vertical: yes
				reverse: no
				i: 'playlist_add_check'
				active: @state.filter_checked
			h Button,
				onClick: @refreshSort
				className: 'btn btn-opaque'
				width: g.dim
				vertical: yes
				reverse: no
				i: 'refresh'
		]

		h Slide,
			className: 'list pad-25-25'
			vertical: yes 
			h Slide,
				# center: yes
				className: 'participants'
				height: g.dim
				# vertical: no
				options
				h SquareButton,
					onClick: @showGroupPins
					outerClassName: 'show-listitem-pins'
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
					size: g.dim*2
					i: 'add'
				# h SquareButton,
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
		# console.log props
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
					console.log @props
					console.log 'ON CLICK'
					props.onClick()
				className: 'pin pin-img'
				style: 
					backgroundImage: 'url('+props.img+')'
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
			reset_grid: no
	componentWillRecieveProps: (props)->
		log props.vuew.show_todo && props.view.show_todo._id,@props.view.show_todo && @props.view.show_todo._id

	componentWillUpdate: (props,state)->
		if state.filter != @state.filter
			state.reset_grid = true	


	render: (props,state)->
		# log state.reset_grid
		pins = []
		# log props
		if !props.group
			return
		

		# decide which pins to display
		if props.view.show_todo_sub
			pins = pins.concat props.view.show_todo_sub.pins
		else if props.view.show_todo
			pins = pins.concat props.view.show_todo.pins
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
		


		# log pins
		pins = pins.map (pin)=>
			if !pin
				return null
			pin.onClick = ()->
				actions.showSlides
					pins: pins
					pin: pin
			h GridItem,
				w: pin.w,h: pin.h,key: pin.id,
					h Pin,pin
		
		reset_grid = @state.reset_grid
		if @state.reset_grid == true
			@state.reset_grid = false

		# console.log 'RESET:',reset_grid
		
		h Grid,
			w: 2
			className: 'pins'
			fixed : false
			toggle_reset: reset_grid
			auto: true
			native_scroll : yes
			pause_scroll : false
			render_beta : 1
			update_offset_beta : 2
			animate: !g.isSafari && true || false
			max_grid_height_beta : 2
			max_reached: true
			innerClass: 'grid-inner'
			pre: h 'div',
				# height: g.dim
				className: 'pins-options'
				h SquareButton,
					onClick: actions.addTodo
					className: 'btn pins-option'
					key: '1'
					sClass: ''
					pClass: 'b1'
					width: g.dim
					vertical: no
					reverse: no
					i: 'location_on'
					active: @state.filter == 'plan'
					onClick: ()=>
						log 'ON CLICK 1'
						@setState
							filter: if @state.filter == 'plan' then null else 'plan' 
				h SquareButton,
					onClick: actions.addTodo
					className: 'btn pins-option'
					key: '2'
					sClass: ''
					pClass: 'b1'
					width: g.dim
					vertical: no
					reverse: yes
					i: 'photo_camera'
					active:  @state.filter == 'event'
					onClick: ()=>
						log 'ON CLICK 2'
						@setState
							filter: if @state.filter == 'event' then null else 'event' 
		,
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
				onChange: (e)=>
					@setState
						email: e.target.value
				type: 'text'
				name: 'email'
				label: 'email'
				value: @state.email
			h InputText,
				height: g.dim
				disabled: @props.disabled
				onChange: (e)=>
					@setState
						pass: e.target.value
				type: 'password'
				autoComplete: 'new-password'
				name: 'pass'
				label: 'pass'
				value: @state.pass
			h Slide,
				height: g.dim
			h SquareButton,
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
				onChange: (e)=>
					@setState
						email: e.target.value
				type: 'text'
				name: 'email'
				disabled: @props.disabled
				label: 'email'
				value: @state.email
			
			h InputText,
				height: g.dim
				onChange: (e)=>
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
				onChange: (e)=>
					@setState
						pass_confirm: e.target.value
				type: 'password'
				autoComplete: 'new-password'
				name: 'confirm pass'
				disabled: @props.disabled
				label: 'confirm pass'
				value: @state.pass_confirm
			h SquareButton,
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
		if !@props.view.group_invite_link
			return h Slide,
				center: yes
				'fetching new link...'
		h Slide,
			className: 'modal-link'
			center: yes
			auto: yes
			vertical: yes
			h 'span',
				className: 'modal-label'
				h 'span',
					className: 'modal-label-pre'
					@props.group.name
			h 'div',
				className: 'title'
				'group invite link'
			h Slide,
				height: g.dim
				vertical: no
				h Slide,
					className: 'b0 invite-link select'
					h 'span',className:'select',@props.view.group_invite_link.link
				h SquareButton,
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
		modal_color =  '#1f292e'
		if props.modal_content == 'slideshow'
			modal_color = '#000'

		modal_content = null

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

		# console.log modal_content

		if ctn != 'slideshow'
			modal = h Modal,
				className: 'modal'
				backColor: modal_color
				show: !!@props.view.show_modal
				mouse: g.mouse
				onClick: ()->
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
		# log participants
		# participants = sortUsers(participants)

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

	componentDidMount: ->
		@_input.focus()

	save: (e)=>
		actions.editGroup(@state,@props.group._id)
		e.preventDefault()
		e.stopPropagation()
		return false

	render: (props)=>		
		h 'form',
			onSubmit: @save
			className: 'form'
			h 'div',
				className: 'title'
				'edit group'
			h InputText,
				onChange: (e)=>
					@setState
						name: e.target.value
				ref: (e)=>
					@_input = e
				type: 'text'
				label: 'name'
				value: @state.name
			h SquareButton,
				outerClassName: 'input-amount-submit full-w'
				reverse: yes
				disabled: !@state.name
				sClass: @state.name && 'input-amount-submit-s' || 'input-amount-submit-false'
				pClass: 'input-amount-submit-p'
				height: g.dim
				vertical: yes
				onClick: @save
				label: 'save'
		


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
				onChange: (e)=>
					@setState
						name: e.target.value
				ref: (e)=>
					@_input = e
				type: 'text'
				label: 'name'
				value: @state.name
			h SquareButton,
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
		@state = 
			show_more_right: no
	
	goHome: ()=>
		actions.goUserHome()

	logout: ()=>
		@setState
			show_more_right: no
		actions.logout()

	opt: (icon,onClick,active,hover,w)->
		h SquareButton,
			className: 'btn'
			# sClass: 'b0'
			pClass: 'b3'
			width: g.dim * (w || 1)
			vertical: yes
			hover: hover
			reverse: no
			i: icon
			active: active
			onClick: onClick


	render: (props,state)->

		more_btn_right = h Button,
			className: 'btn'
			i: 'more_horiz'
			# active: @state.show_more
			disabled: !props.state.user
			width: g.dim
			onClick: ()=>
				@setState
					show_more_right: !@state.show_more_right
			# onMouseEnter: ()=>
			# 	@setState
			# 		show_more_right: yes
			onMouseLeave: ()=>
				@setState
					show_more_right: no

		main_options = [
			@opt('home',@goHome,props.state.view.main_view == 'user' || props.state.view.main_view == 'home')
		]

		main_options_more = [
			@opt('exit_to_app',@logout)
			@opt('settings',@goUserSettings)
		]

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
				left_options
				props.left_children
			h Slide,
				slide: yes
				vertical: no
				pos: if @state.show_more_right then 1 else 0
				h Slide,
					reverse: yes
					more_btn_right
					main_options
					

				h Slide,
					auto: yes
					onMouseEnter: ()=>
						@setState
							show_more_right: yes
					onMouseLeave: ()=>
						@setState
							show_more_right: no
					vertical: no
					className: 'b1'
					main_options_more



class AddFriendView extends Component
	constructor: (props)->
		super(props)
		@state=
			selected: []
			search: null
	search: ()->
		alert 'search'
	render: (props,state)=>
		results = []
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
					onChange: (e)=>
						@setState
							search: e.target.value
						actions.searchUsers(@state.search)
					placeholder: 'search'
					value: @state.search
				h SquareButton,
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
			height: g.dim
			title

	render: (props,state)=>
		user = props.user
		group_items = props.user.groups.map (g)->
			h GridItem,
				w: 2,h: 1,key: g._id,
					h UserViewGroupItem,g

		group_items.push h GridItem,
			w: 1
			h: 1
			key: 'add'
			h Button,
				onClick: ()->
					actions.setModal('newGroup')
				className: 'add-btn'
				i: 'playlist_add'
		
		friend_items = props.user.friends.map (g)->
			h GridItem,
				w: 2,h: 1,key: g._id,
					h Item,g

		friend_items.push h GridItem,
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
			className: 'pad-0-50'
			# h Slide,
			# 	className: 'pad-0-20'
			# 	height: g.dim
			# 	stat('email',user.email)

			@title 'my groups:'
		
			h Grid,
				show_loader: no
				w: g.small_width && 4 || 6
				className: 'lists-grid'
				fixed : false
				toggle_reset: yes
				auto: true
				animate: !g.isSafari && true || false
				max_grid_height_beta : 2
				max_reached: true
				group_items
			h Slide,
				className: 'title pad-0-20'
				height: g.dim
				# onMouseEnter: ()=>
				# 	@setState
				# 		hover_friends: true
				# onMouseLeave: ()=>
				# 	@setState
				# 		hover_friends: no
				'my friends:'
			h Slide,
				auto: yes
				className: 'lists-inner'
				vertical: yes
				h Grid,
					show_loader: no
					w: 8
					className: 'lists-grid'
					fixed : false
					auto: true
					animate: !g.isSafari && true || false
					max_grid_height_beta : 2
					max_reached: true
					friend_items



class UserSettings extends Component
	constructor: (props)->
		super(props)
		if props.user
			@state = 
				name: props.user.name
				email: props.user.email
				img: props.user.img
		else
			@state = {}
	
	componentDidMount: ->
		@_input.focus()	
	
	render: =>
		h Slide,
			h InputText,
				onChange: (e)=>
					@setState
						name: e.target.value
				ref: (e)=>
					@_input = e
				type: 'text'
				label: 'name'
				value: @state.name
			h InputFile,
				onChange: (e)=>
					@setState
						img: e.target.files[0]
				label: 'picture'
				value: null





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


	render: (props,state)=>

		if props.view.main_view == 'home'
			main = h HomeView,props
		else if props.view.main_view == 'group'
			main = h GroupView,props
		else if props.view.main_view == 'user'
			main = h UserView,props


		if props.view.main_view == 'group'
			menu = h Menu,
				left_options: [
					h SquareButton,
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
					h SquareButton,
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
					h SquareButton,
						onClick: ()=>
							actions.setModal('editGroup')
						sClass: ''
						pClass: 'b3'
						width: g.dim
						vertical: yes
						reverse: no
						# reverse: yes
						i: 'mode_edit'
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
				state: props
		else if props.view.main_view == 'user'
			menu = h Menu,
				left_options: [
						h SquareButton,
							onClick: ()=>
								actions.setModal('newGroup')
							sClass: 'blue'
							pClass: 'blue-inv'
							width: g.dim
							vertical: yes
							i:'playlist_add'
							active: props.view.modal_content == 'newGroup'
					,
						h SquareButton,
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

				state: props


		
		h Slide,
			className: 'root-view'
			vertical: yes
			slide: yes
			pos: if props.error then 1 else 0
			h Slide,
				beta: 100
				vertical: yes
				menu
				main
				h ModalView,props
				h Overlay,
					strokeStyle: g.light
					show: props.error
					dir: 'bottom'
					onClick: ()->
						actions.setState
							error: null

			h Slide,
				className: 'error-bg'
				height: g.dim
				center: yes
				props.error
			
			


	







module.exports = connectToStores(MainView)