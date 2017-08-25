actions = require './actions.coffee'
uuid = require 'uuid/v4'

window.initial_state = 
	error: null
	group: null
	user: null
	view: 
		main_view: 'home'
		side_view: 'pins'
		show_todo: null
		slideshow_pin: null
		show_more_right: no
		search_users: []



sync_local = 
	group_name: String
	group_id: String
	group_pass: String
	side_view: String




syncFromLocal = (state)->
	for key,val in sync_local
		if isset localStorage.state[key]
			state.view[key] = val(localStorage.state[key])
		
syncToLocal = (state)->
	for key,val in sync_local
		if isset state[key]
			localStorage[key] = state[key]

isset = (val)->
	if val == null || val == undefined || val == NaN
		return false
	return true

updateDates = (list)->
	# console.log 'updateDates'
	for todo in list.state.todos

		if !(todo.completed_at instanceof Date) && todo.completed_at?
			todo.completed_at = new Date(todo.completed_at)
		if !(todo.created_at instanceof Date) && todo.created_at?
			todo.created_at = new Date(todo.created_at)
		else
			todo.created_at = new Date(0)
		for sub in todo.todos
			sub.sub = true
			sub.parent_id = todo._id
			sub.parent_name = todo.name
			if !(sub.completed_at instanceof Date) && sub.completed_at?
				sub.completed_at = new Date(sub.completed_at)
			if !(sub.created_at instanceof Date) && sub.created_at?
				sub.created_at = new Date(sub.created_at)
			else
				sub.created_at = new Date(0)


updateIndices = (group)->	
	for todo,i in group.state.todos
		todo.index = i
		for sub_todo,j in todo.todos
			sub_todo.index = j


updateCount = (list)->
	# log list
	list.total_count = list.state.todos.length
	list.done_count = 0
	for todo in list.state.todos
		if !!todo.completed_at
			list.done_count += 1
	return list


# console.log window.state

window.state = window.server_state || {}
for key,val of window.server_state
	if !val
		continue
	window.initial_state[key] = Object.assign {},window.initial_state[key],val
	
# window.initial_state = window.state



fillData = (state)->
	console.log 'FILL DATA'
	if state.group
		updateCount(state.group)
		updateDates(state.group)
		updateIndices(state.group)


	if state.user
		for g in state.user.groups
			for todo in g.state.todos
				if state.view.show_todo && todo._id == state.view.show_todo._id
					state.view.show_todo = todo
					break
				for sub in todo.todos
					if state.view.show_todo && sub._id == state.view.show_todo._id
						state.view.show_todo = sub
						break

			updateDates(g)
			updateCount(g)
			updateIndices(g)


	if state.group
		updateDates(state.group)
		updateCount(state.group)
		updateIndices(state.group)
		for todo in state.group.state.todos
			if state.view.show_todo && todo._id == state.view.show_todo._id
				state.view.show_todo = todo
				break
			for sub in todo.todos
				if state.view.show_todo && sub._id == state.view.show_todo._id
					state.view.show_todo = sub
					break




	
	


fillData(window.initial_state)
# console.log window.initial_state.user.groups[0].done_count

# if state.group_state
# 	updateCount list for list in state.group_state.lists
# 	updateDates list for list in state.group_state.lists
# 	updateIndices list for list in state.group_state.lists







class AppStore
	constructor: ->
		@bindListeners
			hideSide: actions.hideSide
			hideModal: actions.hideModal
			setModal: actions.setModal
			setTodoState: actions.setTodoState
			showPins: actions.showPins
			showSlides: actions.showSlides
			# newGroupUser: actions.newGroupUser
			# sendState: actions.sendState
			setState: actions.setState
			mergeState: actions.mergeState
			newPin: actions.newPin
			showAddSubTodo: actions.showAddSubTodo
			# addListItem: actions.addListItem
			showError: actions.showError
			showAddPinModal: actions.showAddPinModal
			showTodoEditModal: actions.showTodoEditModal
			setView: actions.setView
			# setMyUser: actions.setMyUser
			# editTodoSave: actions.editTodoSave
			# editListItem: actions.editListItem
		@state = initial_state

	setView: (view)->
		Object.assign @state.view,view
		@setState()

	showTodoEditModal: (view)->
		Object.assign @state.view,view
		@state.view.modal_content = 'editTodo'
		@state.view.show_modal = yes
		@setState()


	showAddSubTodo: (view)->
		@state.view.parent_todo = view.parent_todo
		@state.view.show_modal = yes
		@state.view.modal_content = 'addTodo'
		@setState()

	showAddPinModal: (view)->
		Object.assign @state.view,view
		@state.view.modal_content = 'addPin'
		@state.view.show_modal = yes
		@setState()



	showPins: (view)->
		Object.assign @state.view,view
		@setState
			side_view: 'pins'



	showError: (error)->
		@setState
			error: error

	mergeState: (new_state)->
		if new_state.view
			@state.view = Object.assign {},@state.view,new_state.view
		if new_state.group
			@state.group = Object.assign {},@state.group,new_state.group
		if new_state.error
			@state.error = new_state.error
		if new_state.user
			@state.user = Object.assign {},@state.user,new_state.user
		fillData(@state)
		@setState()


	setMyUser: (user)->
		localStorage.my_user_index = user.index
		localStorage.my_user_id = user.id
		@setState 
			my_user_id: user.id
			my_user_index: user.index

	hideSide: (index)->
		@setState
			side_view: null

	editListItem: (props)->
		@setState
			edit_list: props
			modal_content: 'listSettings'
			show_modal: yes


	sendState: (opt)->
		@setState opt


	newPin: (opt)->

		if opt.sub_index
			@state.group_state.lists[@state.show_list].todos[opt.index].todos[opt.sub_index].pins.push opt.pin
		else
			@state.group_state.lists[@state.show_list].todos[opt.index].pins.push opt.pin

		@setState()



	showSlides: (opt)->
		Object.assign @state.view, 
			slideshow_pins: opt.pins
			slideshow_pin: opt.pin
			show_modal: yes
			modal_content: 'slideshow'
		@setState()

	editTodoSave: (opt)->
		if isset opt.sub_index
			Object.assign @state.group_state.lists[@state.show_list].todos[opt.index].todos[opt.sub_index],opt.state
		else
			Object.assign @state.group_state.lists[@state.show_list].todos[opt.index],opt.state
		
		
		updateCount( @state.group_state.lists[@state.show_list] )
		updateDates( @state.group_state.lists[@state.show_list] )
		updateIndices( @state.group_state.lists[@state.show_list] )

		@hideModal()

		


	# editTodo: (opt)->
	# 	@setState
	# 		edit_todo_index: opt.index
	# 		edit_todo_index_sub: opt.sub_index
	# 		modal_content: 'editTodo'
	# 		show_modal: yes

	# addListItem: (state)->
	# 	list = 
	# 		name: state.text
	# 		participants: []
	# 		todos: []
	# 		pins: []
	# 		id: uuid()
	# 		completed_at: null
	# 		created_at: Date.now()
	# 	for sel,i in state.selected
	# 		if sel == true
	# 			list.participants.push(@state.group_state.users[i])
	# 	@state.lists.push(list)
		
	# 	@setState
	# 		show_modal: no

	
	setModal: (content)->
		
		Object.assign @state.view,
			# main_view: if content == 'addGroup' then 'home' else @state.main_view
			modal_content: content
			show_modal: yes
			show_more_right: no
		@setState()
		


	addPin: (todo)->
		@setTodoState(todo)

	# showLists: ()->
	# 	@setState
	# 		side_view: null
	# 		main_view: 'home'
	# 		show_list: null
	# 		modal_content: null
	# 		show_modal: null

	# showList: (i)->
	# 	@setState
	# 		main_view: 'group'
	# 		show_list: i
	# 		side_view: if !g.mobile then 'pins'

	newGroupUser: (user)->
		@state.group_state.users.push(user)
		@setState
			show_modal: false
			modal_content: null
		@setMyUser(user)


	hideModal: ()->
		Object.assign @state.view,
			edit_todo: null
			parent_todo: null
			edit_todo_sub: null
			modal_content: null
			show_more_right: false
			show_modal: false			
		
		@setState()


	# addTodo: (todo)->
	# 	@state.group_state.lists[@state.show_list].todos.push todo
	# 	updateCount(@state.group_state.lists[@state.show_list])
	# 	@setState
	# 		show_modal: false
	
	setTodoState: (opt)->
		console.log 'setTodoState'
		
		if opt.state.todos && opt.state.todos.length
			log 'TODOS'
			ok = true
			for todo in opt.state.todos
				log todo.completed_at
				if !(todo.completed_at instanceof Date)
					ok = false
					break
			if ok == true
				opt.state.completed_at = new Date()
			else
				opt.state.completed_at = null
				# log 'SET NULL'

		Object.assign @state.group_state.lists[@state.show_list].todos[opt.index], opt.state

		# updatePinTypes( @state.lists[@state.show_list] )
		updateCount( @state.group_state.lists[@state.show_list] )
		updateDates( @state.group_state.lists[@state.show_list] )
		updateIndices( @state.group_state.lists[@state.show_list] )
		# console.log @state.lists[@state.show_list].done_count
		@setState()



module.exports = alt.createStore(AppStore,'AppStore')