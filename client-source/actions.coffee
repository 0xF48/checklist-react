uuid = require 'uuid/v4'
parseUrl = require('url-parse')


uploadImage = (form,res,rej,use_get)->
	$.ajax
		type: 'post'
		url: 'api/user/upload'
		data: form
		contentType: false
		processData: false
		success: (url)->
			res(url)
		error: (xhr,type)->
			actions.setState
				error: xhr.response || 'error'


sendState = (opt)->
	$.ajax
		type: opt.type
		url: opt.route
		data: opt.type == 'post' && JSON.stringify(opt.state) || opt.state
		dataType: 'json'
		contentType: 'application/json'
		timeout: 1000
		success: actions.mergeState
		error: (xhr,type)->
			actions.setState
				error: xhr.response
			if opt.rej
				opt.rej(new Error 'error')










getPinWH = (width,height)->
	w = 1
	h = 1
	console.log width,height
	if width > height * 1.4
		w = 2
	else if height > width * 1.4
		h = 2

	console.log w,h

	return
		w: w
		h: h



class Actions 


	signup: (state)->
		if state.pass != state.pass_confirm
			return @showError 'passwords dont match'
		
		sendState 
			type: 'post'
			route: 'api/auth/signup'
			state: 
				email: state.email
				pass: state.pass


	login: (state)->
		sendState 
			type: 'get'
			route: 'api/auth/local'
			state: 
				email: state.email
				pass: state.pass
				# document.location.href = '/group/'+state.group.id


	logout: (state)->
		sendState 
			type: 'get'
			route: 'api/user/logout'


	goUserHome: (state)->
		sendState
			type: 'get'
			route: 'api/user'


	addTodo: (state)->
		todo = 
			name: state.text
			created_at: Date.now()
			completed_at: null

		if state.parent_todo_id
			route = 'api/user/group/'+state.group_id+'/todo/'+state.parent_todo_id+'/addtodo'
		else
			route = 'api/user/group/'+state.group_id+'/addtodo'


		sendState
			type: 'post'
			route: route
			state: todo
		@hideModal()
	
	editTodo: (group_id,todo_id,todo_id_sub,state)->
		if todo_id_sub
			route = 'api/user/group/'+group_id+'/todo/'+todo_id+'/subtodo/'+todo_id_sub+'/set'
		else
			route = 'api/user/group/'+group_id+'/todo/'+todo_id+'/set'

		sendState
			type: 'post'
			route: route
			state: state
		@hideModal()


	findFriend: (name)->
		sendState
			type: 'get'
			route: 'api/user/find/user'
			state:
				name: name


	generateGroupLink: (group_id)->
		sendState
			type: 'get'
			route: 'api/user/group/'+group_id+'/invite_link'

	setTodoState: (index,state,sub_index)->
		return {
			index: index
			sub_index: sub_index
			state: state
		}

	showAddPinModal: (todo,sub_todo)->
		return
			edit_todo: todo
			edit_todo_sub: sub_todo

	
	addPin: (group_id,todo_id,todo_id_sub,form,state)->
		state = Object.assign {},state
		delete state.files 
		if todo_id_sub
			route = '/api/user/group/'+group_id+'/todo/'+todo_id+'/subtodo/'+todo_id_sub+'/addpin'
		else
			route = '/api/user/group/'+group_id+'/todo/'+todo_id+'/addpin'
		



		

		
		uploadImage form,
		(img_url)->

			state.img = img_url
			sendState
				type: 'post'
				route: route
				state: state

		url = URL.createObjectURL(form.get('file'))
		img = new Image()
		img.src = url
		img.onload = ()->
			dim = getPinWH(img.width,img.height)
			Object.assign state,dim
		
		
		

		@hideModal()
			

	



	setState: (state)->
		return state

	mergeState: (state)->
		return state




	showTodoEditModal: (todo,sub_todo)->
		return
			edit_todo: todo
			edit_todo_sub: sub_todo


	removeTodo: (group_id,todo_id,sub_todo_id)->
		if sub_todo_id
			route = 'api/user/group/'+group_id+'/todo/'+todo_id+'/subtodo/'+sub_todo_id+'/remove'
		else
			route = 'api/user/group/'+group_id+'/todo/'+todo_id+'/remove'
		

		sendState
			type: 'post'
			route: route
		
		@hideModal()



	showAddSubTodo: (todo)->
		return
			parent_todo: todo
		# @setModal('addTodo')

	showGroup: (id)->
		sendState
			type: 'get'
			route: 'api/user/group/'+id


	createGroup: (state)->
		sendState 
			type: 'post'
			route: 'api/user/group/new'
			state: state
		@hideModal()


	editGroup: (state,id)->
		sendState 
			type: 'post'
			route: 'api/user/group/'+id+'/set'
			state: state
		@hideModal()

	
	sendState: (state)->
		return (dispatch)->
			sendState state,
				(state)->
					console.log "GOT SERVER STATE",state
					dispatch state
				(error)->
					console.log "GOT SERVER STATE ERROR",error
					dispatch
						# show_modal: false
						error: error.message


	setModal: (content)->
		return content

	newPin: (form)->
		type = form.get('type')
		pin = 
			id : uuid()
			type: type
		if type == 'photo'
			pin.img = URL.createObjectURL(form.get('file'))
			img = new Image()
			img.src = pin.img
			dim = getPinWH(img.naturalWidth,img.naturalHeight)
			Object.assign pin,dim
			pin.width = img.naturalWidth
			pin.height = img.naturalHeight
			pin.caption = form.get('caption')

		else if type == 'link'
			link = form.get('link')
			link = parseUrl(link)
			pin.link = link
			pin.link_icon_img = 'http://www.google.com/s2/favicons?domain='+link.host

		else if type == 'textsms'
			pin.text = form.get('text')


		return pin

	newGroupUser: (form)->
		user = 
			name: form.get('name')

		form.append 'id',user.id
		return (dispatch)->
			uploadImage form,
			(got_user)->
				dispatch Object.assign got_user,user




	showPins: (i1,i2)->
		show_todo: i1
		show_todo_sub: i2
	

	setRooomPass: (pass)->
		return send
			pass: pass
		.then (ok)->
			return {
				ok: yes
			}
		.catch (err)->
			return {
				error: err
				ok: no
			}



	showSlides: (opt)->
		return opt



	
	hideSide: ()->
		return true


	hideModal: ()->
		return true

	showTodoForm: ()->
		return true
	
	showError: (message)->
		return message
	


module.exports = alt.createActions Actions