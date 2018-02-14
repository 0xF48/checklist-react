
express = require 'express'
app = express.Router()
db = require './db.coffee'
TodoGroup = db.TodoGroup
User = db.User
uuid = require 'uuid/v4'
passport = require 'passport'
bodyParser = require 'body-parser'
_ = require 'lodash'
Busboy = require 'busboy'
path = require 'path'
fs = require 'fs'
sharp = require 'sharp'

class View 
	constructor: (view,session)->
		@state = {}
		Object.assign @state,INITIAL_VIEW
		Object.assign @state,view
		@session = session
	getState: ()->
		return @state
	setState: (state,req)->
		_.merge @state,state
		@session.view = @state
		@session.save()


bindRequest = (req,res,next)->
	if req.session.group && !req.group
		TodoGroup.findOne
			_id: req.session.group.id
		.populate 'users'
		.then (group)->
			if group
				req.group = group
			next()
		.catch next


	if req.session.view
		req.view = new View(req.session.view,req.session)
	else
		req.view = new View({},req.session)
		req.session.view = req.view.getState()
		req.session.save()

	if !req.session.group
		next()
	

clearState = (req)->
	req.user = null
	req.session.view = {}
	req.session.save()
	req.view = null
	req.group = null


getState = (req,view)->
	state = {}
	state.user = if req.user then req.user.getState() else null
	state.group = if req.group then req.group.getState() else null
	state.view = if req.view then req.view.getState() else {}
	if view
		Object.assign state.view,view
	return state


# app.use bodyParser.json()

app.get '/state', (req,res,next)->
	res.send getState(req)




# USER
user_auth = (req,res,next)->
	if !req.user
		next new Error 'not logged in'
	else
		next()


app.use '/user/',user_auth


.post '/user/set', (req,res,next)->	
	req.user.name = req.body.name || req.user.name
	req.user.img = req.body.img || req.user.img
	req.user.thumb = req.body.thumb || req.user.thumb

	req.user.save ()->
		res.send getState(req,show_modal:false)


.post '/user/upload',(req,res,next)->
	image_id = uuid()
	save_url = null
	file_ext = null
	save_path = null
	file_thumb_name = null
	save_path_thumb = null
	file_name = null
	save_url_thumb = null
	bb = new Busboy 
		headers: req.headers
	bb.on 'file', (fieldname, file, filename, encoding, mimetype)=>
		if mimetype != 'image/png' && mimetype != 'image/gif' && mimetype != 'image/jpeg' && mimetype != 'image/jpg'
			return next new Error('bad mimetype')
		
		file_ext = mimetype.match('image/(.*)')[1]
		file_name  = image_id + '.' + file_ext
		file_thumb_name =  image_id+"_thumb."+file_ext


		save_url_thumb = path.join CFG.save_url, file_thumb_name
		save_path_thumb = path.join CFG.save_dir, file_thumb_name
		
		save_path = path.join CFG.save_dir, file_name
		save_url = path.join CFG.save_url, file_name

		file.pipe fs.createWriteStream(save_path)

	bb.on 'finish', ()->
		sharp(save_path)
		.resize(400)
		.toFile(save_path_thumb)
		.then ()->
			res.send 
				thumb: save_url_thumb
				img:   save_url
		.catch (e)->
			next new Error 'could not resize image'
	
	req.pipe(bb)


.get '/user/logout', (req,res)->
	req.logout()
	clearState(req)
	res.send getState(req,main_view:'home')



.post '/user/add_friend/:friend_id', (req,res,next)->
	req.params.friend_id

	fi = _.findIndex req.user.friends,(f)->
		f.equals req.params.friend_id || f.equals req.user.id
	log fi
	if fi > -1
		return next new Error 'already in friends list'
	req.user.friends.push req.params.friend_id
	req.user.save()
	.then ()->
		req.user.populate 'friends',()->
			res.send getState(req,main_view:'user')
	



# AUTH
.post '/auth/signup',(req,res,next)->
	User.signupLocal(req.body)
	.then (user)->
		req.logIn user, (err)->
			if err
				return next(err)
			req.view.setState
				main_view: 'user'
			res.send getState(req)
	.catch (err)->
		next err

.get '/auth/local', (req,res,next)->

	if !req.query.pass || !req.query.email
		return next new Error 'missing email/pass'
	passport.authenticate('local',(err, user)->
		if err
			return next(err)
		req.logIn user, (err)->
			if err
				return next(err)
			req.view.setState
				main_view : 'user'
			res.send getState(req)
	)(req, res, next)


.post '/auth/twitter', passport.authenticate('twitter',{ failureRedirect: '/auth/error' })

.post '/auth/twitter/callback', passport.authenticate('twitter'), (req,res)->
	info 'user ['+req.user.auth.twitter_id+'/'+req.user.auth.name+'] logged in w/ twitter'
	res.render 'auth',
		user: req.user.getJson()
		target: cfg.origin



MAX_STR_LENGTH = 1000

trim = (str)->
	if typeof str == 'string'
		return str.substring(0,MAX_STR_LENGTH)
	else
		return str

makePin = (body)->
	id: uuid()
	type: trim body.type
	w: Number(body.w || 1)
	h: Number(body.h || 1)
	name: trim body.name
	link: trim body.link
	is_event: Boolean(body.is_event)
	img: trim body.img
	thumb: trim body.thumb
	link_icon_img: trim body.link_icon_img
	text: trim body.text


setGroup = (req,group)->
	new p (res,rej)->
		group.populate 'users',(g)->
			req.session.group = 
				id: group.id
			req.group = group
			req.session.save()
			res(true)
	
		
setTodo = (body)->
	todo = {}
	if body.name  != undefined
		todo.name = trim body.name
	if body.created_at != undefined
		todo.created_at = trim body.created_at
	if body.completed_at  != undefined
		todo.completed_at = trim body.completed_at
	return todo

# GROUP
app

.get '/user', (req,res)->
	req.session.group = null
	req.group = null 
	req.view.setState
		main_view: 'user'
	res.json getState(req)


.get '/user/find/user', (req,res)->
	if !req.query.name
		return res.json getState(req,search_users:[])

	regex = new RegExp('^'+req.query.name, 'gi')
	User.find
		name: regex
	.select('_id name thumb')
	.lean()
	.then (users)->
		# users = users.map (u)->
		# 	_id: u._id
		# 	name: u.name
		# 	img: u.img
		res.json getState(req,search_users:users)


.get '/user/join/:group_invite', (req,res,next)->
	req.user
	.joinGroup(req.params.group_invite)
	.then (group)->
		setGroup(req,group)
		.then ()->
			req.view.setState
				main_view: 'group'
			res.redirect '/'
	.catch next


.get '/user/group/:group_id', (req,res)->
	setGroup(req,req.group)
	.then ()->
		req.view.setState
			main_view: 'group'
		res.json getState(req)


.get '/user/group/:group_id/invite_link', (req,res)->
	req.group
	.getInviteLink()
	.then (link)->
		req.view.setState
			group_invite_link:
				link: link.link
				expires: link.expires
		res.json getState(req)

.post '/user/group/:group_id/leave', (req,res,next)->
	if req.group.users.length > 1 && req.group.owner == req.user._id
		return next new Error 'cannot leave list, owner must kick all users before leaving.'

	
	req.group.users.splice req.group.users.indexOf(req.user._id),1
	req.user.groups.splice req.user.groups.indexOf(req.group._id),1
	p.all [
		req.user.save()
		req.group.save()
	]
	.then ()->
		req.view.setState
			main_view: 'user'
		req.session.group = null
		req.session.save()
		req.group = null
		res.json getState(req)


# .post '/user/group/:group_id/user/:group_user_id/kick', (req,res,next)->
# 	if req.group.owner == req.user._id
# 		f_id = _.findIndex req.group.users,_id:req.params.group_user_id
# 		if f_id < 0
# 			return new Error 'user not found in group, '+req.params.group_user_id

# 		req.group.users.splice(f_id,1)
# 		req.group.save()
# 		.then ()->
# 			res.json getState(req)

# 	else
# 		return next new Error 'no permissions to remove user from group'


	

.post '/user/group/:group_id/addtodo', (req,res,next)->
	body = req.body
	
	req.group.state.todos.push
		_id: uuid()
		name: trim body.name
		created_at: trim body.created_at
		completed_at: trim body.completed_at
		pins: []
		todos: []
	req.group.markModified('state')
	req.group.save().then ()->
		res.json getState(req)

.post '/user/group/:group_id/todo/:todo_id/addtodo', (req,res,next)->
	body = req.body
	req.todo.todos.push
		_id: uuid()
		name: trim body.name
		created_at: trim body.created_at
		completed_at: trim body.completed_at
		pins: []
		todos: []
	req.group.markModified('state')
	req.todo.completed_at = null
	req.group.save().then ()->
		res.json getState(req)



.post '/user/group/:group_id/todo/:todo_id/set', (req,res,next)->
	Object.assign req.todo,setTodo(req.body)
	req.group.markModified('state')
	req.group.save().then ()->
		res.json getState(req)



.post '/user/group/:group_id/todo/:todo_id/remove', (req,res,next)->
	req.group.state.todos.splice req.group.state.todos.indexOf(req.todo),1
	# Object.assign req.todo,req.body
	req.group.markModified('state')
	req.group.save().then (group)->
		req.group = group
		res.json getState(req)




.post '/user/group/:group_id/todo/:todo_id/addpin', (req,res,next)->
	pin = makePin req.body
	req.todo.pins.push pin
	req.group.markModified('state')
	req.group.save().then ()->
		res.json getState(req)


.post '/user/group/:group_id/todo/:todo_id/subtodo/:todo_id_sub/addpin', (req,res,next)->
	pin = makePin req.body
	req.subtodo.pins.push pin
	req.group.markModified('state')
	req.group.save().then ()->
		res.json getState(req)

.post '/user/group/:group_id/todo/:todo_id/subtodo/:todo_id_sub/set', (req,res,next)->
	Object.assign req.subtodo,setTodo(req.body)
	req.group.markModified('state')
	req.group.save().then ()->
		res.json getState(req)

.post '/user/group/:group_id/todo/:todo_id/subtodo/:todo_id_sub/remove', (req,res,next)->
	Object.assign req.subtodo,setTodo(req.body)
	req.group.markModified('state')
	req.group.save().then ()->
		res.json getState(req)





.post '/user/group/new',(req,res,next)->
	g = new TodoGroup
		owner: req.user._id
		name: req.body.name
		users: [req.user._id]
		admins: [req.user._id]
	
	g.save().then (g)->
		req.user.groups.push g
		req.user.save()
		res.json getState(req)


.post '/user/group/:group_id/set', (req,res,next)->
	if req.group.owner.equals req.user
		return next new Error 'you are not the owner, you cannot edit this list'

	if req.body.remove_users && req.body.remove_users.length
		req.body.remove_users = req.body.remove_users.filter (id)->
			req.user.id.toString() != id
		if !req.body.remove_users.length
			return next new Error 'cannot remove urself from the from'
		req.group.users = req.group.users.filter (u)->
			req.body.remove_users.indexOf(u.toString()) == -1

	11

	_.merge req.group,req.body
	req.group.markModified('state')
	req.group.save().then ->
		req.group.populate 'users',()->
			res.json getState(req)


group_auth_error = 'you are either not logged in, this group does not exist, or you are not part of it'

app
.param 'group_id', (req,res,next,group_id)->
	if !req.user
		next new Error group_auth_error
	TodoGroup.findOne
		_id: group_id
	.then (group)->
		if group
			ok = no
			for u in group.users
				if u.toString() == req.user.id.toString()
					ok = yes
					break
			if !ok
				return next new Error group_auth_error
			req.group = group
			next()
		else
			return next new Error group_auth_error
	.catch (e)->
		next new Error 'could not find group with id '+group_id

.param 'todo_id',(req,res,next,todo_id)->
	if !todo_id
		return next new Error 'invalid todo id'
	todo = _.find req.group.state.todos,{_id:todo_id}
	if !todo
		return next new Error 'todo not found with id '+todo_id
	req.todo = todo
	next()


.param 'todo_id_sub',(req,res,next,todo_id)->
	if !todo_id
		return next new Error 'invalid sub todo id'
	todo = _.find req.todo.todos,{_id:todo_id}
	if !todo
		return next new Error 'sub todo not found with id '+todo_id
	req.subtodo = todo
	next()



# global 404 view
.get '*', (req,res,next)->
	res.json
		error: 'route not found'
	# res.sendStatus(404)





module.exports.bindRequest = bindRequest

module.exports.router = app
module.exports.getState = getState
